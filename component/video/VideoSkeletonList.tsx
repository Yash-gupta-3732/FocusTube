"use client";

import VideoSkeletonCard from "./VideoSkeleton";

interface VideoSkeletonListProps {
  count?: number;
}

export default function VideoSkeletonList({
  count = 6,
}: VideoSkeletonListProps) {
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
      {Array.from({ length: count }).map((_, i) => (
        <VideoSkeletonCard key={i} />
      ))}
    </ul>
  );
}
