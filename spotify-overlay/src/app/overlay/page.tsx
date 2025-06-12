"use client";

import { useEffect, useState } from "react";

interface SongData {
  isPlaying: boolean;
  name?: string;
  artist?: string;
  albumArt?: string;
}

export default function Overlay() {
  const [song, setSong] = useState<SongData>({ isPlaying: false });

  useEffect(() => {
    async function fetchSong() {
      try {
        const res = await fetch("/api/song");
        const data = await res.json();
        setSong(data);
      } catch (e) {
        console.error("Error fetching song:", e);
        setSong({ isPlaying: false });
      }
    }

    fetchSong();
    const interval = setInterval(fetchSong, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        background: "rgba(255,255,255,0.5)",
        borderRadius: "10px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "white",
        width: "320px",
        boxShadow: "0 0 30px rgba(0, 0, 0, 0.4)",
    }}>
        <img
            style={{ width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover" }}
            src={song.isPlaying ? song.albumArt : "/fallback.png"}
            alt="Album Art"
        />
        <div style={{ overflow: "hidden" }}>
            <div style = {{
                fontWeight: 600,
                color: "black",
                fontSize: "1rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            }}>
                {song.isPlaying ? song.name : "Nothing Playing"}
            </div>
            <div style = {{ fontSize: "0.875rem", opacity: 0.8}}>
                {song.isPlaying ? song.artist : ""}
            </div>
        </div>
    </div>
  );
}
