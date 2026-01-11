const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function searchYouTubeVideos(
  apiKey: string,
  query: string,
  maxResults: number = 10
) {
  if (!apiKey) {
    throw new Error("YouTube API key not provided");
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: maxResults.toString(),
    videoDuration: "medium",
    key: apiKey,
  });

  const res = await fetch(`${YOUTUBE_BASE_URL}/search?${params}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "YouTube API error");
  }

  return res.json();
}
