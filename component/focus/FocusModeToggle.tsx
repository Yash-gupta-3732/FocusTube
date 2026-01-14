"use client";

interface Props {
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export default function FocusModeToggle({
  enabled,
  onEnable,
  onDisable,
}: Props) {
  return enabled ? (
    <button
      onClick={onDisable}
      className="rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700"
    >
      Exit Focus Mode
    </button>
  ) : (
    <button
      onClick={onEnable}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Start Focus Mode
    </button>
  );
}
