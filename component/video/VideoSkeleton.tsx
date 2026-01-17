"use client";

export default function VideoSkeletonCard() {
  return (
    <li
      className="
        animate-pulse
        rounded-xl border border-neutral-800
        bg-neutral-950
      "
    >
      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Thumbnail skeleton */}
        <div className="relative w-28 sm:w-40 shrink-0">
          <div className="h-18 sm:h-22.5 w-full rounded-lg bg-neutral-800" />

          {/* Duration placeholder */}
          <div className="absolute bottom-1 right-1 h-3 w-8 rounded bg-neutral-700" />
        </div>

        {/* Text skeleton */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Title */}
          <div className="h-4 w-full rounded bg-neutral-800" />
          <div className="mt-1 h-4 w-3/4 rounded bg-neutral-800" />

          {/* Channel */}
          <div className="mt-2 h-3 w-1/2 rounded bg-neutral-700" />

          {/* Progress bar skeleton */}
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-neutral-800" />
            <div className="mt-1 h-3 w-16 rounded bg-neutral-700" />
          </div>
        </div>
      </div>
    </li>
  );
}
