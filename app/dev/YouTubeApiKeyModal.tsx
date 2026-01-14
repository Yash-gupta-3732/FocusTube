"use client";

import { useEffect, useState } from "react";

interface YouTubeApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function YouTubeApiKeyModal({
  open,
  onClose,
}: YouTubeApiKeyModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Open Google Cloud Console",
      content: (
        <>
          <p className="text-neutral-400 text-sm">
            Sign in using your Google account.
          </p>
          <a
            href="https://console.cloud.google.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-blue-400 hover:underline text-sm"
          >
            Open Google Cloud Console →
          </a>
        </>
      ),
    },
    {
      title: "Create a New Project",
      content: (
        <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-400">
          <li>Click the project selector (top bar)</li>
          <li>Select <b className="text-neutral-200">New Project</b></li>
          <li>Name it (e.g. FocusTube)</li>
        </ul>
      ),
    },
    {
      title: "Enable YouTube Data API",
      content: (
        <p className="text-sm text-neutral-400">
          Go to <b className="text-neutral-200">APIs & Services → Library</b>,
          search for <b className="text-neutral-200">YouTube Data API v3</b>,
          and enable it.
        </p>
      ),
    },
    {
      title: "Create an API Key",
      content: (
        <p className="text-sm text-neutral-400">
          Open <b className="text-neutral-200">APIs & Services → Credentials</b>,
          click <b className="text-neutral-200">Create Credentials → API Key</b>,
          and copy it.
        </p>
      ),
    },
    {
      title: "Secure Your API Key",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-400">
          <li>
            Restrict API to{" "}
            <b className="text-neutral-200">YouTube Data API v3</b>
          </li>
          <li>
            Restrict HTTP referrer:
            <div className="mt-1 rounded-md bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-300">
              https://yourwebsite.com/*
            </div>
          </li>
        </ul>
      ),
    },
    {
      title: "You're All Set",
      content: (
        <p className="text-sm text-neutral-400">
          Your YouTube API key is ready.
          <br />
          Paste it into FocusTube and start learning without distractions.
        </p>
      ),
    },
  ];

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[92%] max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-xl">

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-2 text-neutral-500 hover:text-white text-xl"
        >
          ×
        </button>

        {/* Progress */}
        <div className="mb-4 flex items-center justify-between pr-6">
          <span className="text-xs text-neutral-500">
            Step {step + 1} of {steps.length}
          </span>

          <div className="flex gap-1">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i <= step ? "bg-blue-500" : "bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold">{steps[step].title}</h2>

        {/* Content */}
        <div className="mt-4 space-y-3">{steps[step].content}</div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-500"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium hover:bg-emerald-500"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
