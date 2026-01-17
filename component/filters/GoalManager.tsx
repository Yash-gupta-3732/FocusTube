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
  onClose?: () => void;
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
export default function GoalManager({
  onGoalCreated,
  onClose,
}: GoalManagerProps) {
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
    <div className="mt-4 max-w-xl rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">
          Manage Learning Goals
        </h2>

        <button
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-white"
        >
          Close
        </button>
      </div>

      {/* INPUTS */}
      <div className="mb-4 flex flex-col gap-2">
        <input
          placeholder="Goal name (e.g. Business)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
        />

        <input
          placeholder="Search query (e.g. startup fundamentals)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white"
        />

        {goals.length < MAX_GOALS ? (
          <button
            onClick={addGoal}
            className="self-start rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500"
          >
            + Add Goal
          </button>
        ) : (
          <p className="text-xs text-neutral-400">
            You’ve reached the maximum of {MAX_GOALS} goals.
            <br />
            Remove one below to add a new goal.
          </p>
        )}
      </div>

      {/* GOAL LIST */}
      {goals.length > 0 && (
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2"
            >
              <div className="pr-2">
                <p className="text-sm text-white">{goal.label}</p>
                <p className="text-xs text-neutral-400">{goal.query}</p>
              </div>

              <button
                onClick={() => deleteGoal(goal.id)}
                className="rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400 active:bg-red-500/20"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
