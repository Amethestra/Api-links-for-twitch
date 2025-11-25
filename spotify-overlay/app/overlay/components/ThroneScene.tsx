"use client";

import React, { useEffect, useState } from "react";

type SceneVariant = "starting" | "brb" | "ending";

interface SongData {
  isPlaying?: boolean;
  title?: string;
  artist?: string;
}

interface ThroneSceneProps {
  variant: SceneVariant;
}

const variantCopy: Record<SceneVariant, { title: string; subtitle: string }> = {
  starting: {
    title: "Summoning the Stream",
    subtitle: "Starting Soon",
  },
  brb: {
    title: "A Brief Retreat",
    subtitle: "Be Right Back",
  },
  ending: {
    title: "The Ritual Concludes",
    subtitle: "Stream Ending",
  },
};

export default function ThroneScene({ variant }: ThroneSceneProps) {
  const [song, setSong] = useState<SongData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    async function fetchSong() {
      try {
        const res = await fetch("/api/song");
        if (!res.ok) return;
        const data = await res.json();
        setSong(data);
      } catch {
        // fail silently for overlays
      }
    }

    fetchSong();
    const interval = setInterval(fetchSong, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  const copy = variantCopy[variant];
  const isPlaying = !!song?.isPlaying;

  return (
    <div className="overlay-root">
      <div className="overlay-1080p">
        {/* Sigil ring + music pulse */}
        <div className="layer layer-sigil">
          <div
            className={
              "sigil-ring" +
              (isPlaying ? " sigil-ring--active" : " sigil-ring--idle")
            }
          >
            <div className="sigil-inner-ring" />
            <div className="sigil-runes sigil-runes-outer" />
            <div className="sigil-runes sigil-runes-inner" />
          </div>
        </div>

        {/* Fog strips */}
        <div className="layer layer-fog">
          <div className="fog fog-low" />
          <div className="fog fog-mid" />
          <div className="fog fog-high" />
        </div>



        {/* Bottom chat box (600 x 400) */}
        <div className="layer layer-chatbar">
          <div className="chat-bar" />
        </div>

        {/* Variant-specific accent bar */}
        <div className="layer layer-accent">
          <div className={`accent-bar accent-bar--${variant}`} />
        </div>
      </div>
    </div>
  );
}
