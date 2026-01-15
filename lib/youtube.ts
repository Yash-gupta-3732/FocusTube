import {
  YouTubeSearchItem,
  YouTubeVideoDetailsItem,
} from "@/types/youtube";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

/* =========================
   HELPERS
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
   SEARCH YOUTUBE
   ========================= */

export async function searchYouTubeVideos(
  apiKey: string,
  query: string,
  maxResults: number = 50
) {
  if (!apiKey) {
    throw new Error("YouTube API key not provided");
  }

  /* ---------- 1️⃣ SEARCH ---------- */
  const searchParams = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: maxResults.toString(),
    key: apiKey,
  });

  const searchRes = await fetch(
    `${YOUTUBE_BASE_URL}/search?${searchParams}`
  );

  if (!searchRes.ok) {
    const error = await searchRes.json();
    throw new Error(error.error?.message || "Search failed");
  }

  const searchData: { items: YouTubeSearchItem[] } =
    await searchRes.json();

  const videoIds = searchData.items
    .map((item) => item.id.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) {
    return { ...searchData, items: [] };
  }

  /* ---------- 2️⃣ DETAILS ---------- */
  const detailsParams = new URLSearchParams({
    part: "contentDetails",
    id: videoIds.join(","),
    key: apiKey,
  });

  const detailsRes = await fetch(
    `${YOUTUBE_BASE_URL}/videos?${detailsParams}`
  );

  if (!detailsRes.ok) {
    const error = await detailsRes.json();
    throw new Error(error.error?.message || "Details failed");
  }

  const detailsData: { items: YouTubeVideoDetailsItem[] } =
    await detailsRes.json();

  /* ---------- 3️⃣ MAP DURATIONS ---------- */
  const durationMap = new Map<string, string>();
  detailsData.items.forEach((item) => {
    durationMap.set(item.id, item.contentDetails.duration);
  });

  /* ---------- 4️⃣ MERGE + FILTER ---------- */
  const itemsWithDuration = searchData.items
    .map((video) => {
      const iso = durationMap.get(video.id.videoId);
      const seconds = isoToSeconds(iso);

      return {
        ...video,
        duration: formatDuration(iso),
        durationSeconds: seconds,
      };
    })
    // ❌ Block Shorts / very short videos
    // ✅ Allow ≥ 1 minute
    .filter((video) => video.durationSeconds >= 60);

  return {
    ...searchData,
    items: itemsWithDuration,
  };
}
