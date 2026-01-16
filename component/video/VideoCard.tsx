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

  // Visual-only progress (cap at 100%)
  const progressPercent = Math.min(
    Math.floor(((progress?.totalSeconds ?? 0) / 3600) * 100),
    100
  );

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() =>
        router.push(`/watch/${video.id.videoId}?goalId=${goalId ?? ""}`)
      }
      className="
        group cursor-pointer rounded-xl border border-neutral-800
        bg-neutral-950 hover:bg-neutral-900
        transition active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    >
      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Thumbnail */}
        <div className="relative w-28 sm:w-40 shrink-0">
          <Image
            src={
              video.snippet.thumbnails?.medium?.url ??
              video.snippet.thumbnails?.default?.url ??
              "/thumbnail-placeholder.png"
            }
            alt={video.snippet.title}
            width={320}
            height={180}
            className="rounded-lg object-cover"
            unoptimized
          />

          {/* Duration overlay (mobile-friendly) */}
          {video.duration && (
            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
              {video.duration}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-sm sm:text-base font-medium leading-snug line-clamp-2">
            {video.snippet.title}
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-neutral-400 line-clamp-1">
            {video.snippet.channelTitle}
          </p>

          {/* Progress */}
          {progress && progress.totalSeconds > 0 && (
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-neutral-800">
                <div
                  className="h-1.5 rounded-full bg-blue-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-1 text-[11px] text-neutral-500">
                {progressPercent}% focused
              </p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
