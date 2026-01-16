"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../layout/NavBar";
import GoalFilter from "../../component/filters/GoalFilter";
import GoalManager from "@/component/filters/GoalManager";
import VideoSkeletonList from "@/component/video/VideoSkeletonList";
import GoalProgressCard from "@/component/progress/GoalProgressCard";
import VideoList from "@/component/video/VideoList";

import { loadProgress } from "@/lib/progress";

import type { YouTubeVideo } from "@/types/youtube";
import type { LearningGoal } from "@/types/goal";

const GOALS_STORAGE_KEY = "FOCUSTUBE_CUSTOM_GOALS";
const MAX_GOALS = 5;

export default function DashboardPage() {
  const router = useRouter();

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);

  const [query, setQuery] = useState("");
  const [showGoalManager, setShowGoalManager] = useState(false);

  /* =========================
     LOAD GOALS
     ========================= */
  useEffect(() => {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    const parsed: LearningGoal[] = raw ? JSON.parse(raw) : [];

    setGoals(parsed);
    setSelectedGoal(parsed[0] ?? null);
  }, []);

  /* =========================
     FETCH VIDEOS (SERVER API)
     ========================= */
 const fetchVideos = async (searchQuery: string) => {
  // 🔐 1️⃣ Read API key
  const apiKey = localStorage.getItem("YOUTUBE_API_KEY");

  // 🚨 2️⃣ HARD GUARD (MOBILE SAFE)
  if (!apiKey || apiKey.length < 30) {
    setError("YouTube API key missing. Please re-enter your key.");
    router.push("/dev");
    return;
  }

  // 🚨 3️⃣ Guard empty query (important)
  if (!searchQuery || !searchQuery.trim()) {
    setError("Please enter a search query.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // 🌐 4️⃣ Call server API (NOT YouTube directly)
    const res = await fetch("/api/youtube/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-youtube-key": apiKey, // ✅ required
      },
      body: JSON.stringify({
        query: searchQuery,
        maxResults: 12,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "YouTube search failed");
    }

    // 🎬 5️⃣ Success
    setVideos(data.items);
    setQuery(searchQuery);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to fetch videos");
  } finally {
    setLoading(false);
  }
};

  /* =========================
     AUTO FETCH ON GOAL CHANGE
     ========================= */
  useEffect(() => {
    if (selectedGoal) {
      fetchVideos(selectedGoal.query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGoal]);

  /* =========================
     GOAL PROGRESS
     ========================= */
  const progress = loadProgress();

  const goalsWithProgress = goals.filter(
    (g) => progress[g.id]?.totalSeconds > 0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar initialQuery={query} onSearch={fetchVideos} />

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* 🎯 GOALS */}
        {goals.length === 0 ? (
          <GoalManager
            onGoalCreated={(goal) => {
              setGoals([goal]);
              setSelectedGoal(goal);
              fetchVideos(goal.query);
            }}
          />
        ) : (
          <>
            <GoalFilter
              goals={goals}
              value={selectedGoal}
              onChange={setSelectedGoal}
              onAddClick={() => setShowGoalManager((p) => !p)}
              canAddMore={goals.length < MAX_GOALS}
            />

            {showGoalManager && goals.length < MAX_GOALS && (
              <div className="mt-4 max-w-xl">
                <GoalManager
                  onGoalCreated={(goal) => {
                    const updated = [...goals, goal];
                    setGoals(updated);
                    setSelectedGoal(goal);
                    setShowGoalManager(false);
                    fetchVideos(goal.query);
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* 📊 GOAL PROGRESS */}
        {goalsWithProgress.length > 0 && (
          <div className="mt-6 mb-8">
            <h3 className="mb-3 text-sm font-medium text-neutral-300">
              Your Focus Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goalsWithProgress.map((goal) => (
                <GoalProgressCard
                  key={goal.id}
                  goal={goal}
                  progress={progress[goal.id]}
                />
              ))}
            </div>
          </div>
        )}

        {/* ⏳ LOADING */}
        {loading && <VideoSkeletonList count={8} />}

        {/* ❌ ERROR */}
        {error && <p className="text-red-500">{error}</p>}

        {/* 🎬 VIDEOS */}
        {!loading && videos.length > 0 && (
          <VideoList
            videos={videos}
            goalId={selectedGoal?.id}
            progress={
              selectedGoal ? progress[selectedGoal.id] : undefined
            }
          />
        )}

        {!loading && !error && videos.length === 0 && selectedGoal && (
          <p className="text-neutral-400 mt-6">
            No videos found for this goal.
          </p>
        )}
      </div>
    </div>
  );
}
