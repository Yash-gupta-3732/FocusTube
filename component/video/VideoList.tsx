"use client";

import type { YouTubeVideo } from "@/types/youtube";
import type { GoalProgress } from "@/types/progress";
import VideoCard from "./VideoCard";

interface VideoListProps {
  videos: YouTubeVideo[];
  goalId?: string | null;
  progress?: GoalProgress;
}

export default function VideoList({
  videos,
  goalId,
  progress,
}: VideoListProps) {
  if (videos.length === 0) return null;

  return (
    <ul
      className="
        mt-4
        flex flex-col gap-3
        sm:gap-4
        touch-pan-y
        overscroll-contain
      "
    >
      {videos.map((video) => (
        <VideoCard
          key={video.id.videoId}
          video={video}
          goalId={goalId}
          progress={progress}
        />
      ))}
    </ul>
  );
}
