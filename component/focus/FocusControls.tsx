"use client";

import { useEffect, useState } from "react";
import type { YouTubePlayer } from "@/types/youtube-player";

interface FocusControlsProps {
  playerRef: React.RefObject<YouTubePlayer | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const isTyping = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
};

export default function FocusControls({
  playerRef,
  containerRef,
}: FocusControlsProps) {
  const [visible, setVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const [speed, setSpeed] = useState(1);

  /* =========================
     Auto-hide controls
     ========================= */
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const show = () => {
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(false), 2500);
    };

    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);

    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      clearTimeout(timeout);
    };
  }, []);

  /* =========================
     Speed control
     ========================= */
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    player.setPlaybackRate(speed);
  }, [speed, playerRef]);

  /* =========================
     Actions
     ========================= */
  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) player.pauseVideo();
    else player.playVideo();

    setIsPlaying((p) => !p);
  };

  const seek = (seconds: number) => {
    const player = playerRef.current;
    if (!player) return;

    const t = player.getCurrentTime();
    player.seekTo(Math.max(t + seconds, 0), true);
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isMuted) player.unMute();
    else player.mute();

    setIsMuted((p) => !p);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  /* =========================
     Keyboard shortcuts
     ========================= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "ArrowLeft":
          seek(-10);
          break;
        case "ArrowRight":
          seek(10);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
 

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-50 transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center justify-between bg-black/70 px-4 py-3 text-white text-sm">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={() => seek(-10)}>⏪</button>
          <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={() => seek(10)}>⏩</button>
        </div>

        {/* Center */}
        <div className="flex items-center gap-3">
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-black text-white border border-neutral-700 rounded px-2 py-1"
          >
            {[0.5, 1, 1.25, 1.5, 1.75, 2].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button onClick={toggleMute}>{isMuted ? "🔇" : "🔊"}</button>
          <button onClick={toggleFullscreen}>⛶</button>
        </div>
      </div>
    </div>
  );
}
