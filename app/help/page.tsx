"use client";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 text-neutral-300">
      <h1 className="text-2xl font-bold text-white mb-6">
        How FocusTube Works
      </h1>

      {/* 1. INTRO */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          1. What is FocusTube?
        </h2>
        <p className="text-sm leading-relaxed">
          FocusTube is a distraction-free learning platform built on top of
          YouTube. It removes recommendations, enforces focus sessions, and
          helps you learn intentionally using goals, timers, reflections,
          and progress tracking.
        </p>
      </section>

      {/* 2. SETUP */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          2. First-Time Setup
        </h2>
        <p className="text-sm leading-relaxed">
          FocusTube uses a Bring Your Own API Key (BYOK) approach.
          You provide your own YouTube Data API key, which is stored
          locally in your browser and never sent to any server.
        </p>
      </section>

      {/* 3. GOALS */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          3. Learning Goals
        </h2>
        <p className="text-sm leading-relaxed">
          Learning goals define what type of content you want to focus on.
          Each goal has a name and a search query. You can create up to
          five goals and switch between them anytime.
        </p>
      </section>

      {/* 4. FOCUS MODE */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          4. Focus Mode
        </h2>
        <p className="text-sm leading-relaxed">
          When you start a video, FocusTube enters Focus Mode.
          The timer starts automatically, playback controls are limited,
          and recommendations are removed to keep you fully focused.
        </p>
      </section>

      {/* 5. PROGRESS */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          5. Progress Tracking
        </h2>
        <p className="text-sm leading-relaxed">
          Progress is recorded only when you complete a full focus session.
          Each learning goal tracks total focused time and shows progress
          visually on the dashboard.
        </p>
      </section>

      {/* 6. REFLECTION */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          6. Reflections
        </h2>
        <p className="text-sm leading-relaxed">
          After every focus session, you are prompted to write a reflection.
          This reinforces learning and helps convert passive watching
          into active understanding.
        </p>
      </section>

      {/* 7. BEST PRACTICES */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          7. Best Practices
        </h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Use shorter focus sessions (25–45 minutes).</li>
          <li>Focus on one video at a time.</li>
          <li>Write short but meaningful reflections.</li>
          <li>Review progress regularly to stay motivated.</li>
        </ul>
      </section>

      {/* 8. FAQ */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-2">
          8. Common Questions
        </h2>
        <ul className="text-sm space-y-2">
          <li>
            <b>Progress not showing?</b> Make sure you completed a full
            focus session.
          </li>
          <li>
            <b>Video not loading?</b> Check your YouTube API key and quota.
          </li>
          <li>
            <b>Lost data?</b> Avoid clearing browser local storage.
          </li>
        </ul>
      </section>
    </div>
  );
}
