// /pages/api/song.js
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

export default async function handler(req, res) {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);

    const trackData = await spotifyApi.getMyCurrentPlayingTrack();

    if (trackData.body?.is_playing && trackData.body?.item) {
      const track = trackData.body.item;
      return res.status(200).json({
        isPlaying: true,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        albumArt: track.album.images[0].url
      });
    } else {
      return res.status(200).json({ isPlaying: false });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load song data' });
  }
}
