"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    const apiKey = localStorage.getItem("YOUTUBE_API_KEY");
    if (apiKey && apiKey.trim()) {
      router.push("/dashboard");
    } else {
      router.push("/dev");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div className="text-lg font-semibold tracking-wide">
          Focus<span className="text-blue-500">Tube</span>
        </div>

        <button
          onClick={handleGetStarted}
          className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:bg-neutral-200 transition"
        >
          Get Started
        </button>
      </header>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
          Watch YouTube. <br />
          <span className="text-blue-500">Without Losing Focus.</span>
        </h1>

        <p className="mt-6 text-neutral-400 max-w-xl text-lg">
          FocusTube removes distractions and turns learning videos into
          intentional focus sessions — with timers, reflection, and zero noise.
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={handleGetStarted}
            className="rounded-full bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 transition"
          >
            Start a Focus Session →
          </button>

          <a
            href="#how-it-works"
            className="rounded-full border border-neutral-700 px-6 py-3 font-medium text-neutral-300 hover:bg-neutral-900 transition"
          >
            See How It Works
          </a>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          One-time YouTube API key setup required.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-t border-neutral-800 px-6 py-20"
      >
        <h2 className="text-2xl font-semibold text-center mb-12">
          How FocusTube Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Step
            title="Choose a video"
            description="Search and select any YouTube video you want to learn from."
          />
          <Step
            title="Enter Focus Mode"
            description="Distractions are blocked. Shortcuts disabled. Just the video."
          />
          <Step
            title="Reflect & continue"
            description="Capture one insight before moving on. Learning sticks."
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-neutral-950 border-t border-neutral-800">
        <h2 className="text-2xl font-semibold text-center mb-12">
          Built for Intentional Learning
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Feature
            title="🔒 Focus Mode"
            text="Blocks distractions, keyboard shortcuts, and recommendations."
          />
          <Feature
            title="⏱ Focus Timer"
            text="User-defined sessions that start only when the video plays."
          />
          <Feature
            title="✍ Reflection Prompt"
            text="Write what you actually learned before continuing."
          />
          <Feature
            title="🧘 No Infinite Scroll"
            text="One session at a time. No autoplay traps."
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 text-center border-t border-neutral-800">
        <h2 className="text-3xl font-semibold">
          Ready to watch with intention?
        </h2>

        <button
          onClick={handleGetStarted}
          className="mt-8 rounded-full bg-white text-black px-8 py-3 font-medium hover:bg-neutral-200 transition"
        >
          Start a Focus Session →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-neutral-500 py-6 border-t border-neutral-800">
        FocusTube — Learn intentionally.
      </footer>
    </main>
  );
}

/* ---------- Small components ---------- */

function Step({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 p-6 bg-neutral-900">
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 p-6 bg-black">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{text}</p>
    </div>
  );
}
