import { useEffect, useState } from "react";

export default function YouTubeApiKeyModal({ open, onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Open Google Cloud Console",
      content: (
        <>
          <p className="text-slate-300">
            Sign in using your Google account.
          </p>
          <a
            href="https://console.cloud.google.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            Open Google Cloud Console →
          </a>
        </>
      ),
    },
    {
      title: "Create a New Project",
      content: (
        <ul className="list-disc pl-5 text-slate-300 space-y-1">
          <li>Click the project selector (top bar)</li>
          <li>Select <b>New Project</b></li>
          <li>Name it (e.g. No-Scroll-YouTube)</li>
        </ul>
      ),
    },
    {
      title: "Enable YouTube Data API",
      content: (
        <p className="text-slate-300">
          Go to <b>APIs & Services → Library</b>, search for
          <b> YouTube Data API v3</b>, and enable it.
        </p>
      ),
    },
    {
      title: "Create an API Key",
      content: (
        <p className="text-slate-300">
          Open <b>APIs & Services → Credentials</b>, click
          <b> Create Credentials → API Key</b>, and copy it.
        </p>
      ),
    },
    {
      title: "Secure Your API Key",
      content: (
        <ul className="list-disc pl-5 text-slate-300 space-y-1">
          <li>Restrict API to <b>YouTube Data API v3</b></li>
          <li>
            Restrict HTTP referrer:
            <br />
            <code className="rounded bg-slate-900 px-2 py-1 text-xs">
              https://yourwebsite.com/*
            </code>
          </li>
        </ul>
      ),
    },
    {
      title: "You're All Set",
      content: (
        <p className="text-slate-300">
          Your YouTube API key is ready and secure.  
          You can now paste it wherever the app asks for it.
        </p>
      ),
    },
  ];

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 grid place-items-center bg-black/60">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-slate-900 p-6 text-white">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl text-slate-400 hover:text-white cursor-pointer"
        >
          ×
        </button>

        {/* Progress */}
        <div className="mb-2 text-xs text-slate-400">
          Step {step + 1} of {steps.length}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold">
          {steps[step].title}
        </h2>

        {/* Content */}
        <div className="my-4 space-y-3">
          {steps[step].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 cursor-pointer"
            >
              Back
            </button>
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto rounded-xl bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500 cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="ml-auto rounded-xl bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-500 cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
