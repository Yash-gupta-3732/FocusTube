"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import YouTubeApiKeyModal from "./YouTubeApiKeyModal";

export default function DevPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      alert("API key is required");
      return;
    }

    localStorage.setItem("YOUTUBE_API_KEY", apiKey.trim());
    localStorage.setItem("DEV_MODE", "true");

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-2">
          Development Mode
        </h1>

        <p className="text-sm text-neutral-400 mb-6">
          This is a development-only demo.  
          Enter your own YouTube Data API key to continue.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="YoutubeApi"
              className="block text-sm text-neutral-300 mb-1"
            >
              YouTube API Key
            </label>

            <input
              id="YoutubeApi"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-lg border border-neutral-700 bg-black px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium hover:bg-blue-500 transition"
          >
            Save API Key & Continue
          </button>
        </form>

        {/* Help */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setOpen(true)}
            className="text-sm text-blue-400 hover:underline"
          >
            ⓘ How to get a YouTube API Key
          </button>
        </div>
      </div>

      {/* Modal */}
      <YouTubeApiKeyModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </main>
  );
}
