import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { apiKey, videoIds } = await req.json();

    if (!apiKey || !videoIds?.length) {
      return NextResponse.json(
        { error: "Missing apiKey or videoIds" },
        { status: 400 }
      );
    }

    const url =
      "https://www.googleapis.com/youtube/v3/videos" +
      `?part=contentDetails&id=${videoIds.join(",")}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Details failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
