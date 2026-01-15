"use client";

interface Goal {
  id: string;
  label: string;
  query: string;
}

interface GoalFilterProps {
  goals: Goal[];
  value: Goal | null;
  onChange: (goal: Goal) => void;
  onAddClick: () => void;
  canAddMore: boolean;
}

export default function GoalFilter({
  goals,
  value,
  onChange,
  onAddClick,
  canAddMore,
}: GoalFilterProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <label className="text-sm text-neutral-400">
        Learning Goal:
      </label>

      <select
        value={value?.id ?? ""}
        onChange={(e) => {
          const selected = goals.find((g) => g.id === e.target.value);
          if (selected) onChange(selected);
        }}
        className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm"
      >
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.label}
          </option>
        ))}
      </select>

      <button
        onClick={onAddClick}
        disabled={!canAddMore}
        className={`
          ml-2 rounded-md px-3 py-2 text-sm transition
          ${
            canAddMore
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
          }
        `}
      >
        + Add
      </button>
    </div>
  );
}
