"use client";

interface ProgressBarProps {
  value: number;   // current seconds
  max: number;     // target seconds
}

export default function ProgressBar({ value, max }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-neutral-400">
        {percentage}% of daily goal
      </p>
    </div>
  );
}
