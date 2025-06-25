import { NextResponse } from 'next/server';
import { generateTwitchAuthUrl } from '@/lib/twitch/auth';

function generateRandomState(length = 24) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  const state = generateRandomState();

  const url = generateTwitchAuthUrl(state);

  // Create a response that sets the state cookie
  const response = NextResponse.redirect(url);

  // Set HTTP-only cookie with the state (expires in 15 minutes)
  response.cookies.set({
    name: 'oauth_state',
    value: state,
    httpOnly: true,
    path: '/',
    maxAge: 15 * 60, // 15 minutes
    secure: true,
    sameSite: 'lax',
  });

  return response;
}
