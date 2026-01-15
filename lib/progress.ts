import { GoalProgress } from "@/types/progress";

const STORAGE_KEY = "FOCUSTUBE_GOAL_PROGRESS";

export function loadProgress(): Record<string, GoalProgress> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveProgress(progress: Record<string, GoalProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addWatchTime(goalId: string, seconds: number) {
  if (seconds <= 0) return;

  const progress = loadProgress();

  const current = progress[goalId] ?? {
    goalId,
    totalSeconds: 0,
    lastWatchedAt: Date.now(),
  };

  progress[goalId] = {
    ...current,
    totalSeconds: current.totalSeconds + seconds,
    lastWatchedAt: Date.now(),
  };

  saveProgress(progress);
}
