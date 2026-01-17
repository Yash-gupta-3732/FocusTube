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
  onManageClick: () => void;
  canAddMore: boolean;
}

export default function GoalFilter({
  goals,
  value,
  onChange,
  onManageClick,
  canAddMore,
}: GoalFilterProps) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm text-neutral-400">Learning Goals</p>

      <div className="flex flex-wrap gap-2">
        {goals.map((goal) => {
          const active = value?.id === goal.id;

          return (
            <button
              key={goal.id}
              onClick={() => onChange(goal)}
              className={`rounded-full px-4 py-1.5 text-sm transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }
              `}
            >
              {goal.label}
            </button>
          );
        })}

        {/* MANAGE / ADD */}
        <button
          onClick={onManageClick}
          className={`rounded-full px-4 py-1.5 text-sm transition
            ${
              canAddMore
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
            }
          `}
        >
          {canAddMore ? "+ Add Goal" : "Manage Goals"}
        </button>
      </div>
    </div>
  );
}
