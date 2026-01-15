import { LearningGoal } from "@/types/goal";

const STORAGE_KEY = "FOCUSTUBE_GOALS";

export function getGoals(): LearningGoal[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveGoals(goals: LearningGoal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}
