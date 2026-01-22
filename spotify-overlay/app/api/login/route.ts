import { NextResponse } from 'next/server';
import crypto from 'crypto';


export async function GET() {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: 'user-read-playback-state user-read-currently-playing',
    prompt: 'consent',
    state,
  });

  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorise?${params.toString()}`
  );

  response.cookies.set('spotify_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
