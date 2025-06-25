import { cookies } from 'next/headers';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { fetchTwitchUser } from '@/lib/twitch/user';

export async function GET() {
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
  const accessToken = cookieStore.get('twitch_access_token')?.value;

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const user = await fetchTwitchUser(accessToken);
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Failed to fetch Twitch user', { status: 500 });
  }
}
