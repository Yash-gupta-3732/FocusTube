export default function VideoSkeleton() {
  return (
    <div className="flex gap-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 animate-pulse">
      {/* Thumbnail */}
      <div className="w-[160px] h-[90px] rounded-md bg-neutral-800 shrink-0" />

      {/* Text */}
      <div className="flex flex-col justify-center flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-neutral-800 rounded" />
        <div className="h-3 w-1/3 bg-neutral-800 rounded" />
      </div>
    </div>
  );
}
