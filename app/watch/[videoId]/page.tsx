"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import FocusOverlay from "@/component/focus/FocusOverlay";
import FocusControls from "@/component/focus/FocusControls";
import ReflectionModal from "@/component/focus/ReflectionModal";
import FocusTimer from "@/component/focus/FocusTimer";
import { useTimer } from "@/hooks/useTimer";
import { addWatchTime } from "@/lib/progress";
import type { YouTubePlayer } from "@/types/youtube-player";

/* =========================
   YouTube API types
   ========================= */
declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => YouTubePlayer;

      PlayerState: {
        PLAYING: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}


export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const searchParams = useSearchParams();
  const goalId = searchParams.get("goalId");

  const containerRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  /* =========================
     Focus duration
     ========================= */
  const [focusMinutes, setFocusMinutes] = useState(30);

  useEffect(() => {
    const saved = localStorage.getItem("focus-duration");
    if (saved) setFocusMinutes(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("focus-duration", String(focusMinutes));
  }, [focusMinutes]);

  /* =========================
     Video meta
     ========================= */
  const [videoMeta, setVideoMeta] = useState({
    title: "Loading video…",
    channel: "",
    duration: "–",
  });

  /* =========================
     Focus timer
     ========================= */
  const focusTimer = useTimer({
    durationMinutes: focusMinutes,
    onComplete: () => {
      playerRef.current?.pauseVideo();

      // ✅ ADD GOAL PROGRESS HERE
      if (goalId) {
        addWatchTime(goalId, focusMinutes * 60);
      }

      setShowReflection(true);
    },
  });

  useEffect(() => {
    focusTimer.reset();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMinutes]);

  /* =========================
     Load YouTube Player (once)
     ========================= */
  useEffect(() => {
    if (!videoId || playerRef.current) return;

    const loadPlayer = () => {
      playerRef.current = new window.YT.Player(playerHostRef.current!, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (event: { data: number }) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              focusTimer.start();
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              focusTimer.reset();
              setShowReflection(true);
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }

   return () => {
  if (playerRef.current) {
    playerRef.current.destroy();
    playerRef.current = null;
  }
};

  }, [videoId]); // intentionally only videoId

  /* =========================
     Fetch video metadata
     ========================= */
  useEffect(() => {
    if (!videoId) return;

    async function fetchMeta() {
      const apiKey = localStorage.getItem("YOUTUBE_API_KEY");
      if (!apiKey) return;

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
      );
      if (!res.ok) return;

      const data = await res.json();
      const item = data.items?.[0];
      if (!item) return;

      const iso = item.contentDetails.duration;
      const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

      const h = Number(match?.[1] || 0);
      const m = Number(match?.[2] || 0);
      const s = Number(match?.[3] || 0);

      const formatted =
        h > 0
          ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${m}:${String(s).padStart(2, "0")}`;

      setVideoMeta({
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        duration: formatted,
      });
    }

    fetchMeta();
  }, [videoId]);

  if (!videoId) return <p>Invalid video</p>;

  /* =========================
     UI
     ========================= */
  return (
    <div className="mx-auto max-w-225 p-5">
      <FocusOverlay />

      <div className="mb-4 flex justify-end">
        <FocusTimer
          minutes={focusTimer.minutes}
          seconds={focusTimer.seconds}
          isRunning={focusTimer.isRunning}
          focusMinutes={focusMinutes}
          onChangeDuration={setFocusMinutes}
          onReset={focusTimer.reset}
        />
      </div>

      <div
        ref={containerRef}
        className="relative bg-black"
        style={{ paddingBottom: "56.25%", height: 0 }}
      >
        <div ref={playerHostRef} className="absolute inset-0 h-full w-full" />
        {playerReady && (
          <FocusControls
            playerRef={playerRef}
            containerRef={containerRef}
          />
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-neutral-300">
        <h2 className="text-lg font-semibold text-white">
          {videoMeta.title}
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          {videoMeta.channel} · {videoMeta.duration}
        </p>
        <p className="mt-3 text-sm">
          🎯 Focus session: <span className="text-white">{focusMinutes} min</span>
        </p>
      </div>

      <ReflectionModal
        open={showReflection}
        videoMeta={{
          videoId,
          title: videoMeta.title,
          channel: videoMeta.channel,
          duration: videoMeta.duration,
        }}
        onSubmit={(reflection) => {
          localStorage.setItem(
            `reflection:${videoId}:${Date.now()}`,
            JSON.stringify({
              videoId,
              title: videoMeta.title,
              channel: videoMeta.channel,
              duration: videoMeta.duration,
              text: reflection,
              createdAt: Date.now(),
            })
          );
          setShowReflection(false);
        }}
      />
    </div>
  );
}
