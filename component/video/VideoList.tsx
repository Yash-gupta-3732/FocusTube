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
  return (
    <ul className="space-y-2 mt-4">
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
