"use client";

import { useParams } from "next/navigation";

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();

  if (!videoId) {
    return <p>Invalid video</p>;
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h2>Focus Mode</h2>

      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%", // 16:9
          height: 0,
          marginTop: 20,
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    </div>
  );
}
