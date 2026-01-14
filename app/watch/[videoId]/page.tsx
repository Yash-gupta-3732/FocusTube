"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import FocusOverlay from "@/component/focus/FocusOverlay";
import FocusControls from "@/component/focus/FocusControls";
import ReflectionModal from "@/component/focus/ReflectionModal";
import FocusTimer from "@/component/focus/FocusTimer";
import { useTimer } from "@/hooks/useTimer";

// Extend window for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();

  const containerRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  /* ============================
     FOCUS DURATION
     ============================ */

  const [focusMinutes, setFocusMinutes] = useState(30);

  useEffect(() => {
    const saved = localStorage.getItem("focus-duration");
    if (saved) setFocusMinutes(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("focus-duration", String(focusMinutes));
  }, [focusMinutes]);

  /* ============================
     VIDEO META
     ============================ */

  const [videoMeta, setVideoMeta] = useState({
    title: "Loading video…",
    channel: "",
    duration: "–",
  });

  /* ============================
     FOCUS TIMER
     ============================ */

  const focusTimer = useTimer({
    durationMinutes: focusMinutes,
    onComplete: () => {
      playerRef.current?.pauseVideo();
      setShowReflection(true);
    },
  });

  useEffect(() => {
    focusTimer.reset();
  }, [focusMinutes]);

  /* ============================
     LOAD YOUTUBE PLAYER
     ============================ */

  useEffect(() => {
    if (!videoId || playerRef.current) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
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
          onStateChange: (event: any) => {
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
  }, [videoId]);

  /* ============================
     FETCH VIDEO META
     ============================ */

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

  return (
    <div className="mx-auto max-w-[900px] p-5">
      {/* Focus overlay */}
      <FocusOverlay />

      {/* Timer */}
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

      {/* VIDEO */}
      <div
        ref={containerRef}
        className="relative bg-black"
        style={{ paddingBottom: "56.25%", height: 0 }}
      >
        <div ref={playerHostRef} className="absolute inset-0 h-full w-full" />

        {playerReady && (
          <FocusControls playerRef={playerRef} containerRef={containerRef} />
        )}
      </div>

      {/* 🧠 CONTEXT PANEL (NEW) */}
      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-neutral-300">
        <h2 className="text-lg font-semibold text-white">
          {videoMeta.title}
        </h2>

        <p className="mt-1 text-sm text-neutral-400">
          {videoMeta.channel} · {videoMeta.duration}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            🎯 <span className="text-white">Focus session:</span>{" "}
            {focusMinutes} minutes
          </p>

          <p>
            🧠 Reflection will appear when the session ends.
          </p>

          <p className="text-neutral-500">
            Stay with the video. One insight is enough.
          </p>
        </div>
      </div>

      {/* REFLECTION */}
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
