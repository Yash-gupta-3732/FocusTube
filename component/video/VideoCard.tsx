"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { YouTubeVideo } from "@/types/youtube";
import type { GoalProgress } from "@/types/progress";

interface VideoCardProps {
  video: YouTubeVideo;
  goalId?: string | null;
  progress?: GoalProgress;
}

export default function VideoCard({
  video,
  goalId,
  progress,
}: VideoCardProps) {
  const router = useRouter();

  // Simple cap so bar doesn’t overflow visually
  const progressPercent = Math.min(
    Math.floor((progress?.totalSeconds ?? 0) / 3600 * 100),
    100
  );

  return (
    <li
      onClick={() =>
        router.push(`/watch/${video.id.videoId}?goalId=${goalId ?? ""}`)
      }
      className="cursor-pointer rounded-lg hover:bg-neutral-900 transition overflow-hidden"
    >
      <div className="flex gap-4 p-3">
        {/* Thumbnail */}
        <Image
          src={
            video.snippet.thumbnails?.medium?.url ??
            video.snippet.thumbnails?.default?.url ??
            "/thumbnail-placeholder.png"
          }
          alt={video.snippet.title}
          width={160}
          height={90}
          className="rounded-md object-cover shrink-0"
          unoptimized
        />

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-medium">{video.snippet.title}</h3>

          <p className="mt-1 text-sm text-neutral-400">
            {video.snippet.channelTitle}
            {video.duration && (
              <>
                <span className="mx-1">•</span>
                <span className="text-neutral-500">
                  {video.duration}
                </span>
              </>
            )}
          </p>

          {/* 🟦 PROGRESS BAR */}
          {progress && progress.totalSeconds > 0 && (
            <div className="mt-3 h-1 w-full rounded bg-neutral-800">
              <div
                className="h-1 rounded bg-blue-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
