"use client";

import VideoSkeletonCard from "./VideoSkeleton";

interface Props {
  count?: number;
}

export default function VideoSkeletonList({ count = 6 }: Props) {
  return (
    <ul className="mt-4 space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <VideoSkeletonCard key={i} />
      ))}
    </ul>
  );
}
