import type { NextApiRequest, NextApiResponse } from 'next';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
});

spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN!);

type SongResponse =
  | {
      isPlaying: true;
      name: string;
      artist: string;
      albumArt: string;
    }
  | {
      isPlaying: false;
    }
  | {
      error: string;
    };

// Type guard to check if item is a track (not an episode)
function isTrack(item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject): item is SpotifyApi.TrackObjectFull {
  return (item as SpotifyApi.TrackObjectFull).artists !== undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SongResponse>
) {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);

    const trackData = await spotifyApi.getMyCurrentPlayingTrack();

    if (
      trackData.body?.is_playing &&
      trackData.body?.item &&
      isTrack(trackData.body.item)
    ) {
      const track = trackData.body.item;
      return res.status(200).json({
        isPlaying: true,
        name: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        albumArt: track.album.images[0].url,
      });
    } else {
      return res.status(200).json({ isPlaying: false });
    }
  } catch (err: any) {
    console.error('Spotify API error:', err);
    return res.status(500).json({ error: 'Failed to load song data' });
  }
}
