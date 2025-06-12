// src/app/api/song/route.ts
import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
});

spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN!);

// Type guard to check if the item is a TrackObjectFull
function isTrackObjectFull(item: unknown): item is SpotifyApi.TrackObjectFull {
  return typeof item === "object" && item !== null && "artists" in item;
}

export async function GET() {
  try {
    // Refresh token to get a fresh access token
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // Get the current playing track/episode
    const trackData = await spotifyApi.getMyCurrentPlayingTrack();

    if (trackData.body?.is_playing && trackData.body?.item) {
      const item = trackData.body.item;

      if (isTrackObjectFull(item)) {
        return NextResponse.json({
          isPlaying: true,
          name: item.name,
          artist: item.artists.map((a) => a.name).join(", "),
          albumArt: item.album.images[0]?.url ?? "",
        });
      } else {
        // Not a track (maybe a podcast episode), respond with no playing info
        return NextResponse.json({ isPlaying: false });
      }
    } else {
      // Nothing playing
      return NextResponse.json({ isPlaying: false });
    }
  } catch (err) {
    console.error("Error fetching song data:", err);
    return NextResponse.json(
      { error: "Failed to load song data" },
      { status: 500 }
    );
  }
}
