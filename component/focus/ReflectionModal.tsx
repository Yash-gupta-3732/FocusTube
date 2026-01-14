"use client";

import { useEffect, useState } from "react";

interface VideoMeta {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
}

interface ReflectionModalProps {
  open: boolean;
  videoMeta: VideoMeta;
  onSubmit: (reflection: string) => void;
}

const MIN_CHARS = 20;

export default function ReflectionModal({
  open,
  videoMeta,
  onSubmit,
}: ReflectionModalProps) {
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setReflection("");
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const trimmed = reflection.trim();
  const canSubmit = trimmed.length >= MIN_CHARS;

  const dateStr = new Date().toLocaleString();

  const fileBaseName = `FocusTube_${videoMeta.title
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}`;

  /* ---------------------------------------------
     SINGLE SOURCE OF TRUTH FOR EXPORT CONTENT
  --------------------------------------------- */
  const buildExportText = () => {
    return `
Title      : ${videoMeta.title}
Channel    : ${videoMeta.channel}
Duration   : ${videoMeta.duration}
Watched on : ${dateStr}

----------------------------------------

Reflection:
${trimmed}
`.trim();
  };

  /* ---------------- TXT DOWNLOAD ---------------- */
  const downloadTxt = () => {
    const content = buildExportText();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBaseName}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  /* ---------------- PDF DOWNLOAD ---------------- */
  const downloadPdf = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>${fileBaseName}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            h1 {
              font-size: 20px;
              margin-bottom: 20px;
            }
            pre {
              white-space: pre-wrap;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>FocusTube Reflection</h1>
          <pre>${buildExportText().replace(/</g, "&lt;")}</pre>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 p-6 text-white shadow-2xl">
        <h2 className="mb-2 text-xl font-semibold">
          Pause. Capture one insight.
        </h2>

        <p className="mb-4 text-sm text-neutral-400">
          Write what mattered. You can export this for later review.
        </p>

        {/* Metadata preview (subtle but powerful) */}
        <div className="mb-3 text-xs text-neutral-500">
          <div>{videoMeta.title}</div>
          <div>
            {videoMeta.channel} • {videoMeta.duration}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What did you actually learn from this video?"
            rows={5}
            className="w-full resize-none rounded-lg bg-neutral-800 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          {/* Export buttons */}
          {canSubmit && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={downloadTxt}
                className="rounded-lg bg-neutral-800 px-3 py-2 text-xs hover:bg-neutral-700"
              >
                Download .txt
              </button>

              <button
                type="button"
                onClick={downloadPdf}
                className="rounded-lg bg-neutral-800 px-3 py-2 text-xs hover:bg-neutral-700"
              >
                Download PDF
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition
                ${
                  canSubmit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-neutral-700 cursor-not-allowed"
                }`}
            >
              Save & Continue
            </button>
          </div>

          {!canSubmit && (
            <p className="text-xs text-neutral-500">
              Write at least {MIN_CHARS} characters to continue.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
