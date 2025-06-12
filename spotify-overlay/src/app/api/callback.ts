import type { NextApiRequest, NextApiResponse } from 'next';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);

    const accessToken = data.body.access_token;
    const refreshToken = data.body.refresh_token;


    res.status(200).json({
      message: 'Spotify authorization successful!',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Authorization failed:', err);
    res.status(500).json({ error: 'Authorization failed' });
  }
}
