import { YouTubeSearchItem, YouTubeVideoDetailsItem } from "@/types/youtube";
type YouTubeApiErrorResponse = {
  error?: {
    message?: string;
  };
};

/* =========================
   HELPERS (UNCHANGED)
   ========================= */

function isoToSeconds(iso?: string): number {
  if (!iso) return 0;

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const h = Number(match[1] || 0);
  const m = Number(match[2] || 0);
  const s = Number(match[3] || 0);

  return h * 3600 + m * 60 + s;
}

function formatDuration(iso?: string): string {
  if (!iso) return "–";

  const seconds = isoToSeconds(iso);
  if (seconds === 0) return "–";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

/* =========================
   SEARCH YOUTUBE (SERVER-SAFE)
   ========================= */

export async function searchYouTubeVideos(
  apiKey: string,
  query: string,
  maxResults: number = 50
) {
  if (!apiKey) {
    throw new Error("YouTube API key not provided");
  }

  /* 🔐 CALL YOUR SERVER ROUTE */
  const res = await fetch("/api/youtube/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      query,
      maxResults,
    }),
  });

  const data: { items: YouTubeSearchItem[] } = await res.json();

  if (!res.ok) {
    const errorData = data as YouTubeApiErrorResponse;
    throw new Error(errorData.error?.message ?? "YouTube search failed");
  }

  /* ---------- IDs ---------- */
  const videoIds = data.items.map((item) => item.id.videoId).filter(Boolean);

  if (videoIds.length === 0) {
    return { items: [] };
  }

  /* ---------- DETAILS (SECOND SERVER CALL) ---------- */
  const detailsRes = await fetch("/api/youtube/details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      videoIds,
    }),
  });

  const detailsData: { items: YouTubeVideoDetailsItem[] } =
    await detailsRes.json();
  if (!detailsRes.ok) {
    const errorData = detailsData as YouTubeApiErrorResponse;
    throw new Error(errorData.error?.message ?? "Details fetch failed");
  }

  /* ---------- MAP DURATIONS ---------- */
  const durationMap = new Map<string, string>();
  detailsData.items.forEach((item) => {
    durationMap.set(item.id, item.contentDetails.duration);
  });

  /* ---------- MERGE + FILTER ---------- */
  const itemsWithDuration = data.items
    .map((video) => {
      const iso = durationMap.get(video.id.videoId);
      const seconds = isoToSeconds(iso);

      return {
        ...video,
        duration: formatDuration(iso),
        durationSeconds: seconds,
      };
    })
    // ❌ Shorts
    // ✅ ≥ 1 minute
    .filter((video) => video.durationSeconds >= 60);

  return {
    items: itemsWithDuration,
  };
}
