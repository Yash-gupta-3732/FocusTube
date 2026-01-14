"use client";

import { useState } from "react";

const DURATIONS = [15, 30, 45, 60];

interface FocusTimerProps {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  focusMinutes: number;
  onChangeDuration: (m: number) => void;
  onReset: () => void;
}

export default function FocusTimer({
  minutes,
  seconds,
  isRunning,
  focusMinutes,
  onChangeDuration,
  onReset,
}: FocusTimerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative z-45">
      {/* COLLAPSED VIEW */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-3 rounded-full bg-neutral-900 px-4 py-2 text-white shadow-lg hover:bg-neutral-800"
      >
        {/* ✅ THIS is the fix */}
        <span
          suppressHydrationWarning
          className="font-mono text-sm"
        >
          {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </span>

        {/* Reset (non-button to avoid nesting) */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="cursor-pointer rounded bg-neutral-700 px-2 py-1 text-xs hover:bg-neutral-600"
        >
          Reset
        </span>
      </button>

      {/* EXPANDED PANEL */}
      {expanded && (
        <div className="absolute right-0 mt-2 w-max rounded-xl bg-neutral-900 p-4 text-white shadow-xl">
          <div className="mb-3 text-xs text-neutral-400">
            {isRunning ? "Focusing" : "Idle"}
          </div>

          <div className="flex gap-2">
            {DURATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  onChangeDuration(m);
                  setExpanded(false);
                }}
                className={`rounded px-3 py-1 text-xs transition ${
                  focusMinutes === m
                    ? "bg-blue-600"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
