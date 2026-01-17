"use client";

export default function VideoSkeletonCard() {
  return (
    <li className="rounded-lg bg-neutral-900 p-3 animate-pulse">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="h-22.5 w-[160px] shrink-0 rounded-md bg-neutral-800" />

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="h-4 w-3/4 rounded bg-neutral-800" />

          {/* Channel + duration */}
          <div className="h-3 w-1/2 rounded bg-neutral-800" />

          {/* Progress bar placeholder */}
          <div className="h-1 w-full rounded bg-neutral-800" />
        </div>
      </div>
    </li>
  );
}
