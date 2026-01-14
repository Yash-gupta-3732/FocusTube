"use client";

import { useEffect, useState } from "react";
import type { Reflection } from "@/types/focus";

/* ---------------------------------------------
   PURE HELPER: Load reflections from localStorage
   (Outside component = no React warnings)
--------------------------------------------- */
function loadReflections(): Reflection[] {
  const items: Reflection[] = [];

  if (typeof window === "undefined") return items;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("reflection:")) continue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);

      items.push({
        videoId: parsed.videoId,
        title: parsed.title ?? "Unknown video",
        channel: parsed.channel ?? "Unknown channel",
        duration: parsed.duration ?? "–",
        text: parsed.text,
        createdAt: parsed.createdAt ?? Date.now(),
      });
    } catch {
      // ignore corrupted entries safely
    }
  }

  // newest first
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

/* ---------------------------------------------
   PAGE COMPONENT
--------------------------------------------- */
export default function ReflectionsPage() {
  // ✅ Lazy initialization (no useEffect init)
  const [reflections, setReflections] = useState<Reflection[]>(loadReflections);

  // ✅ Sync effect (consistency without warnings)
  useEffect(() => {
    const sync = () => {
      setReflections(loadReflections());
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold text-white">
        Your Reflections
      </h1>

      {reflections.length === 0 && (
        <p className="text-neutral-400">
          You haven’t written any reflections yet.
        </p>
      )}

      <ul className="space-y-4">
        {reflections.map((r) => (
          <li
            key={`${r.videoId}-${r.createdAt}`}
            className="rounded-lg bg-neutral-900 p-4"
          >
            <div className="mb-2">
              <h2 className="text-white font-medium">
                {r.title}
              </h2>

              <p className="text-sm text-neutral-400">
                {r.channel}
                <span className="mx-1">•</span>
                {r.duration}
              </p>
            </div>

            <p className="whitespace-pre-wrap text-sm text-neutral-200">
              {r.text}
            </p>

            <p className="mt-3 text-xs text-neutral-500">
              {new Date(r.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
