"use client";

import { GoalProgress } from "@/types/progress";
import { LearningGoal } from "@/types/goal";
import ProgressBar from "./ProgressBar";

const DAILY_TARGET_SECONDS = 60 * 60; // 1 hour

function formatTime(seconds = 0) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function GoalProgressCard({
  goal,
  progress,
}: {
  goal: LearningGoal;
  progress?: GoalProgress;
}) {
  if (!progress || progress.totalSeconds <= 0) return null;

  return (
    <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4">
      <p className="text-sm font-medium text-white">{goal.label}</p>

      <p className="mt-1 text-xs text-neutral-400">
        Focused: {formatTime(progress.totalSeconds)}
      </p>

      <ProgressBar
        value={progress.totalSeconds}
        max={DAILY_TARGET_SECONDS}
      />
    </div>
  );
}
