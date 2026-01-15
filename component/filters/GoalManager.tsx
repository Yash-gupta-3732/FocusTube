"use client";

import { useEffect, useState } from "react";

/* =========================
   Types
   ========================= */
export interface LearningGoal {
  id: string;
  label: string;
  query: string;
}

interface GoalManagerProps {
  onGoalCreated?: (goal: LearningGoal) => void;
}

/* =========================
   Config
   ========================= */
const STORAGE_KEY = "FOCUSTUBE_CUSTOM_GOALS";
const MAX_GOALS = 5;

/* =========================
   Storage helpers
   ========================= */
function loadGoals(): LearningGoal[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveGoals(goals: LearningGoal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

/* =========================
   Component
   ========================= */
export default function GoalManager({ onGoalCreated }: GoalManagerProps) {
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [label, setLabel] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const addGoal = () => {
    if (goals.length >= MAX_GOALS) return;
    if (!label.trim() || !query.trim()) return;

    const newGoal: LearningGoal = {
      id: crypto.randomUUID(),
      label: label.trim(),
      query: query.trim(),
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGoals(updated);

    onGoalCreated?.(newGoal);

    setLabel("");
    setQuery("");
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <h2 className="text-sm font-medium text-white mb-3">
        Custom Learning Goals
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        <input
          placeholder="Goal name (e.g. Business)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white"
        />

        <input
          placeholder="Search query (e.g. startup fundamentals)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white"
        />

        {goals.length >= MAX_GOALS && (
          <p className="text-xs text-yellow-400">
            Maximum {MAX_GOALS} goals allowed.
          </p>
        )}

        <button
          onClick={addGoal}
          disabled={goals.length >= MAX_GOALS}
          className={`self-start rounded-md px-3 py-1.5 text-sm transition
            ${
              goals.length >= MAX_GOALS
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
        >
          Add Goal
        </button>
      </div>

      {goals.length > 0 && (
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className="flex justify-between items-center rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2"
            >
              <div>
                <p className="text-sm text-white">{goal.label}</p>
                <p className="text-xs text-neutral-400">{goal.query}</p>
              </div>

              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
