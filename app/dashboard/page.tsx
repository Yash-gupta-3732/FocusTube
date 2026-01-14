"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Navbar from "../../layout/NavBar";
import { searchYouTubeVideos } from "@/lib/youtube";
import type { YouTubeVideo } from "@/types/youtube";

export default function DashboardPage() {
  const router = useRouter();

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  /* =========================
     FETCH VIDEOS
     ========================= */
  const fetchVideos = async (searchQuery: string) => {
    const apiKey = localStorage.getItem("YOUTUBE_API_KEY");

    if (!apiKey || !apiKey.trim()) {
      router.push("/dev");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchYouTubeVideos(apiKey, searchQuery, 12);
      setVideos(data.items);
      setQuery(searchQuery);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch videos");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
     ========================= */
  useEffect(() => {
    fetchVideos(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <Navbar
        initialQuery={query}
        onSearch={(q) => fetchVideos(q)}
      />

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {loading && <p className="text-neutral-400">Loading videos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-2">
          {videos.map((video) => (
            <li
              key={video.id.videoId}
              onClick={() => router.push(`/watch/${video.id.videoId}`)}
              className="cursor-pointer rounded-lg hover:bg-neutral-900 transition"
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
                <div className="flex flex-col justify-center">
                  <h3 className="font-medium leading-snug">
                    {video.snippet.title}
                  </h3>

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
                </div>
              </div>
            </li>
          ))}
        </ul>

        {!loading && videos.length === 0 && (
          <p className="text-neutral-400 mt-6">
            No videos found.
          </p>
        )}
      </div>
    </div>
  );
}
