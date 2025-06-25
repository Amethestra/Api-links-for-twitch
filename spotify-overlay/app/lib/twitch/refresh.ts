export async function refreshTwitchAccessToken(refreshToken: string) {
    const ClientID = process.env.TWITCH_CLIENT_ID;
    const ClientSecret = process.env.TWITCH_CLIENT_SECRET;

    const res = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: ClientID || '',
            client_secret: ClientSecret || '',
        }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
        throw new Error(`Failed to refresh Twitch access token: ${data.error || 'Unknown error'}`);
    }

    return data;
}