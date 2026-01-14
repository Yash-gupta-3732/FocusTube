"use client";

export default function FocusOverlay() {
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
        🔒 Focus Mode Active
      </div>
    </div>
  );
}