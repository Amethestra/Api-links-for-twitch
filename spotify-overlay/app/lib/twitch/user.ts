export async function fetchTwitchUser(accessToken: string) {
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const res = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': clientId,
    },
  });

  if (!res.ok) {
    throw new Error(`Twitch API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // Twitch returns an array of users, usually one
  return data.data[0];
}
