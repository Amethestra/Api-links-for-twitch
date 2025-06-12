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
  const [isClient, setIsClient] = useState(false); // ← track hydration

  useEffect(() => {
    setIsClient(true); // mark that we’re on the client

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

  if (!isClient) return null; // don't render on server

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          background: transparent;
          font-family: 'Segoe UI', sans-serif;
        }
      `}</style>
      <style jsx>{`
        .song-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: black;
          width: 320px;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
        }

        .album-cover {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          object-fit: cover;
        }

        .song-info {
          overflow: hidden;
        }

        .song-name {
          font-weight: 600;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .artist-name {
          font-size: 0.875rem;
          opacity: 0.8;
        }
      `}</style>

      <div className="song-card" id="song-card">
        <img
          className="album-cover"
          id="album"
          src={song.isPlaying ? song.albumArt : "/fallback.png"}
          alt="Album Cover"
        />
        <div className="song-info">
          <div className="song-name" id="track">
            {song.isPlaying ? song.name : "Nothing playing"}
          </div>
          <div className="artist-name" id="artist">
            {song.isPlaying ? song.artist : ""}
          </div>
        </div>
      </div>
    </>
  );
}
