import { NextRequest } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";
import { supabase } from "@/lib/supabaseServer";
import { access } from "fs";
import { getSpotifyApiForUser } from "@/lib/spotifyForUser";

function isTrackObjectFull(
  item: unknown
): item is SpotifyApi.TrackObjectFull {
  return typeof item === "object" && item !== null && "artists" in item;
}

export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get("user");

  if (!userId) {
    return new Response("Missing user parameter", {
      status: 400,
      headers: { "Content-Type": "text/plain"},
    });
  }

  try {
    const spotifyApi = await getSpotifyApiForUser(userId);
    const trackData = await spotifyApi.getMyCurrentPlayingTrack();

    if (!trackData.body?.is_playing || !trackData.body.item) {
      return new Response("No song playing", {
        headers: { "Content-Type": "text/plain"},
      });
    }

    const item = trackData.body.item;

    if (!isTrackObjectFull(item)) {
      return new Response("No song playing", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response(
      `${item.name} - ${item.artists.map(a => a.name).join(", ")}`,
      { headers: { "Content-Type": "text/plain" } }
    );
  } catch (err) { 
    console.error(err);
    return new Response("Error retriving song", {
      status: 500,
      headers: { "Content-Type": "text/plain"},
    });
  }
}
