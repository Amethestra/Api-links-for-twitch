import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const REDIRECT_URI = 'https://api-links-for-twitch.vercel.app/auth/twitch/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const returnedState = searchParams.get('state');

  // Get the 'oauth_state' cookie from the request
  const cookieState = request.cookies.get('oauth_state')?.value;

  // Verify the state parameter matches the cookie
  if (!returnedState || !cookieState || returnedState !== cookieState) {
    return new NextResponse('Invalid state parameter', { status: 400 });
  }

  if (error) {
    return NextResponse.redirect(new URL('/auth/error?error=' + encodeURIComponent(error), request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error?error=Missing%20authorization%20code', request.url));
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(new URL('/auth/error?error=' + encodeURIComponent(tokenData.message), request.url));
    }

    // Set cookies with access_token and refresh_token
    const response = NextResponse.redirect(new URL('/', request.url)); // Redirect to homepage or dashboard

    response.cookies.set('twitch_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: tokenData.expires_in,
      path: '/',
      sameSite: 'lax',
    });

    response.cookies.set('twitch_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: true,
      // Set to 30 days; adjust if needed
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });

    // **Important:** Clear the oauth_state cookie after verification
    response.cookies.delete({
        name: 'oauth_state',
        path: '/',
    });


    return response;
  } catch {
    return NextResponse.redirect(new URL('/auth/error?error=Server%20error', request.url));
  }
}
