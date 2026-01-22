import { NextRequest, NextResponse } from "next/server";
import { getSpotifyApiForUser } from "@/lib/spotifyForUser";


function isTrackObjectFull(
  item: unknown
): item is SpotifyApi.TrackObjectFull {
  return typeof item === "object" && item !== null && "artists" in item;
}

export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get("user");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing user parameter"},
      { status: 400}
    );
  }

  try {
    const spotifyApi = await getSpotifyApiForUser(userId);
    const trackData = await spotifyApi.getMyCurrentPlayingTrack();

    if (!trackData.body?.is_playing || !trackData.body.item) {
      return NextResponse.json({ isPlaying: false });
    }

    const item = trackData.body.item;

    if (!isTrackObjectFull(item)) {
      return NextResponse.json({ isPlaying: false });
    }

    return NextResponse.json({
      isPlaying: true,
      name: item.name,
      artist: item.artists.map(a => a.name).join(", "),
      albumArt: item.album.images[0]?.url ?? "",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch song"},
      { status: 500}
    );
  }
}