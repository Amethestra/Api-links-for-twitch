import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";
import { supabase } from "@/lib/supabaseServer";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
});

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code"}, { status: 400 });
  }

  try {
    const auth = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(auth.body.access_token);
    if (auth.body.refresh_token) {
      spotifyApi.setRefreshToken(auth.body.refresh_token);
    }
    
    const me = await spotifyApi.getMe();

    const expiresAt = new Date(
      Date.now() + auth.body.expires_in * 1000
    ).toISOString();

    await supabase
      .from("spotify_tokens")
      .upsert({
        spotify_user_id: me.body.id,
        access_token: auth.body.access_token,
        refresh_token: auth.body.refresh_token ?? undefined,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      });
    
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/success?user=${me.body.id}`
      );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Auth Failed"}, { status: 500 });
  }
}