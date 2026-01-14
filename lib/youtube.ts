const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function searchYouTubeVideos(
  apiKey: string,
  query: string,
  maxResults: number = 50
) {
  if (!apiKey) {
    throw new Error("YouTube API key not provided");
  }

  /* ---------------- 1️⃣ SEARCH ---------------- */
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

  const searchData: {
    items: YouTubeSearchItem[];
  } = await searchRes.json();

  /* ---------------- 2️⃣ IDS ---------------- */
  const videoIds = searchData.items.map(
    (item) => item.id.videoId
  );

  if (videoIds.length === 0) {
    return searchData;
  }

  /* ---------------- 3️⃣ DETAILS ---------------- */
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

  const detailsData: {
    items: YouTubeVideoDetailsItem[];
  } = await detailsRes.json();

  /* ---------------- 4️⃣ MAP ---------------- */
  const durationMap = new Map<string, string>(
    detailsData.items.map((item) => [
      item.id,
      item.contentDetails.duration,
    ])
  );

  /* ---------------- 5️⃣ FORMAT ---------------- */
  const formatDuration = (iso?: string): string => {
    if (!iso) return "–";

    const match = iso.match(
      /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );
    if (!match) return "–";

    const h = Number(match[1] || 0);
    const m = Number(match[2] || 0);
    const s = Number(match[3] || 0);

    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${m}:${String(s).padStart(2, "0")}`;
  };

  /* ---------------- 6️⃣ MERGE ---------------- */

  const isoToSeconds = (iso?: string): number => {
  if (!iso) return 0;

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const h = Number(match[1] || 0);
  const m = Number(match[2] || 0);
  const s = Number(match[3] || 0);

  return h * 3600 + m * 60 + s;
};

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
  // ✅ ALLOW 1 minute and above
  // ❌ BLOCK anything below 1 minute
  .filter((video) => video.durationSeconds >= 60);


  return {
    ...searchData,
    items: itemsWithDuration,
  };
}
