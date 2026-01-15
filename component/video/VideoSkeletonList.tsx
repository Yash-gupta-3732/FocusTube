import VideoSkeleton from "./VideoSkeleton";

export default function VideoSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <VideoSkeleton />
        </li>
      ))}
    </ul>
  );
}
