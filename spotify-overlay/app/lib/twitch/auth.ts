export function generateTwitchAuthUrl(state: string) {
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const redirectUri = encodeURIComponent('https://api-links-for-twitch.vercel.app/auth/twitch/callback');
  const responseType = 'code';
  const scope = encodeURIComponent('user:read:follows channel:read:subscriptions');
  const forceVerify = 'true';

  return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}` +
         `&redirect_uri=${redirectUri}` +
         `&response_type=${responseType}` +
         `&scope=${scope}` +
         `&state=${state}` +
         `&force_verify=${forceVerify}`;
}
