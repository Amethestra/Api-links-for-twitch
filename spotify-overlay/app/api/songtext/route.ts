// src/app/api/songtext/route.ts
import { NextRequest } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
});

spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN!);

function isTrackObjectFull(item: unknown): item is SpotifyApi.TrackObjectFull {
  return typeof item === "object" && item !== null && "artists" in item;
}

export async function GET() {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body["access_token"]);

    const trackData = await spotifyApi.getMyCurrentPlayingTrack();

    if (trackData.body?.is_playing && trackData.body?.item) {
      const item = trackData.body.item;

      if (isTrackObjectFull(item)) {
        const songName = item.name;
        const artists = item.artists.map((a) => a.name).join(", ");
        const responseText = `${songName} - ${artists}`;

        return new Response(responseText, {
          headers: { "Content-Type": "text/plain" },
        });
      }
    }

    return new Response("No song playing", {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Error in /api/songtext:", err);
    return new Response("Error retrieving song", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
