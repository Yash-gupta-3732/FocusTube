"use client";

import { useEffect, useState } from "react";
import type { YouTubePlayer } from "@/types/youtube-player";

interface FocusControlsProps {
  playerRef: React.RefObject<YouTubePlayer>;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Helper: ignore shortcuts while typing in inputs/textareas
 */
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

  /**
   * Auto-hide controls after mouse / touch inactivity
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const showControls = () => {
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(false), 2500);
    };

    window.addEventListener("mousemove", showControls);
    window.addEventListener("touchstart", showControls);

    return () => {
      window.removeEventListener("mousemove", showControls);
      window.removeEventListener("touchstart", showControls);
      clearTimeout(timeout);
    };
  }, []);

  /**
   * Mouse / button handlers
   */
  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }

    setIsPlaying((prev) => !prev);
  };

  const seek = (seconds: number) => {
    const player = playerRef.current;
    if (!player) return;

    const current = player.getCurrentTime();
    player.seekTo(Math.max(current + seconds, 0), true);
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isMuted) {
      player.unMute();
    } else {
      player.mute();
    }

    setIsMuted((prev) => !prev);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /**
   * Keyboard shortcuts
   * Space → play/pause
   * M     → mute/unmute
   * ←/→   → seek ±10s
   * F     → fullscreen toggle
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const player = playerRef.current;
      if (!player) return;
      if (isTyping(e.target)) return;

      switch (e.key) {
        case " ":
          e.preventDefault(); // prevent page scroll
          if (isPlaying) {
            player.pauseVideo();
          } else {
            player.playVideo();
          }
          setIsPlaying((prev) => !prev);
          break;

        case "m":
        case "M":
          if (isMuted) {
            player.unMute();
          } else {
            player.mute();
          }
          setIsMuted((prev) => !prev);
          break;

        case "ArrowLeft": {
          const t = player.getCurrentTime();
          player.seekTo(Math.max(t - 10, 0), true);
          break;
        }

        case "ArrowRight": {
          const t = player.getCurrentTime();
          player.seekTo(t + 10, true);
          break;
        }

        case "f":
        case "F":
          if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted, playerRef, containerRef]);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-45 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center justify-between bg-black/70 px-4 py-3 text-white">
        {/* Left: playback */}
        <div className="flex items-center gap-4">
          <button onClick={() => seek(-10)}>⏪</button>
          <button onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={() => seek(10)}>⏩</button>
        </div>

        {/* Center: reserved for future timer / status */}
        <div />

        {/* Right: audio + fullscreen */}
        <div className="flex items-center gap-4">
          <button onClick={toggleMute}>
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button onClick={toggleFullscreen}>⛶</button>
        </div>
      </div>
    </div>
  );
}
