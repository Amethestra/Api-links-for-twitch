import SpotifyWebApi from "spotify-web-api-node";

export type SpotifyTokens = {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
};

export async function getSpotifyClient(tokens: SpotifyTokens) {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID!,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
    });

    spotifyApi.setAccessToken(tokens.accessToken);
    spotifyApi.setRefreshToken(tokens.refreshToken);

    if (Date.now() >= tokens.expiresAt - 60_000) {
        const refreshed = await spotifyApi.refreshAccessToken();

        const newAccessToken = refreshed.body.access_token;
        const newExpiresAt = Date.now() + refreshed.body.expires_in * 1000;
        const newRefreshToken = 
            refreshed.body.refresh_token ?? tokens.refreshToken;

        await updateUserTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt: newExpiresAt,
        });

        spotifyApi.setAccessToken(newAccessToken);
        spotifyApi.setRefreshToken(newRefreshToken);
    }

    return spotifyApi;
}