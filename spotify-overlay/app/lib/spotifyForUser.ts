import SpotifyWebApi from "spotify-web-api-node";
import { supabase } from "@/lib/supabaseServer";

export async function getSpotifyApiForUser(userId: string) {
    
    //Load tokens from supabase
    const { data, error } = await supabase
        .from("spotify_tokens")
        .select("*")
        .eq("spotify_user_id", userId)
        .single();
    
    if (error || !data) {
        throw new Error("User not connected to Spotify");
    }

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID!,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    });

    spotifyApi.setAccessToken(data.access_token)
    spotifyApi.setRefreshToken(data.refresh_token)

    // Refresh if expired

    if (new Date(data.expires_at) <= new Date()) {
        const refreshed = await spotifyApi.refreshAccessToken();

        const expiresAt = new Date(
            Date.now() + refreshed.body.expires_in * 1000
        ).toISOString();

        await supabase
            .from("spotify_tokens")
            .update({
                access_token: refreshed.body.access_token,
                expires_at: expiresAt,
                updated_at: new Date().toISOString(),
            })
            .eq("spotify_user_id", userId);

        spotifyApi.setAccessToken(refreshed.body.access_token);
    }

    return spotifyApi;
}