import { NextResponse } from "next/server";
import type {
  YouTubeSearchItem,
  YouTubeVideoDetailsItem,
} from "@/types/youtube";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

/* =========================
   Helpers
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

  const total = isoToSeconds(iso);
  if (total === 0) return "–";

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

/* =========================
   POST /api/youtube/search
   ========================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, maxResults = 12 } = body;

    // 🔐 API key comes from user (BYOK)
    const apiKey = body.apiKey || req.headers.get("x-youtube-key");

    if (!apiKey || !query) {
      return NextResponse.json(
        { error: "Missing API key or query" },
        { status: 400 }
      );
    }

    /* ---------- 1️⃣ SEARCH ---------- */
    const searchParams = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: String(maxResults),
      key: apiKey,
    });

    const searchRes = await fetch(
      `${YOUTUBE_BASE_URL}/search?${searchParams}`
    );

    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      return NextResponse.json(
        { error: searchData.error?.message || "Search failed" },
        { status: 400 }
      );
    }

    const videoIds = (searchData.items as YouTubeSearchItem[])
      .map((item) => item.id.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      return NextResponse.json({ items: [] });
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

    const detailsData = await detailsRes.json();

    if (!detailsRes.ok) {
      return NextResponse.json(
        { error: detailsData.error?.message || "Details failed" },
        { status: 400 }
      );
    }

    const durationMap = new Map<string, string>();
    (detailsData.items as YouTubeVideoDetailsItem[]).forEach((item) => {
      durationMap.set(item.id, item.contentDetails.duration);
    });

    /* ---------- 3️⃣ MERGE + FILTER ---------- */
    const items = (searchData.items as YouTubeSearchItem[])
      .map((video) => {
        const iso = durationMap.get(video.id.videoId);
        const seconds = isoToSeconds(iso);

        return {
          ...video,
          duration: formatDuration(iso),
          durationSeconds: seconds,
        };
      })
      // ❌ Block Shorts
      .filter((v) => v.durationSeconds >= 60);

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
