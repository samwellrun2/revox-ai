"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LANGUAGES } from "@/lib/constants/languages";

interface TranslationData {
  id: string;
  status: string;
  source_language: string | null;
  target_language: string;
  duration_seconds: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
  download_url: string | null;
  captions_url: string | null;
}

const STEPS = [
  { key: "pending", label: "Queued", description: "Waiting in line..." },
  { key: "transcribing", label: "Transcribing audio", description: "Extracting speech from the video" },
  { key: "translating", label: "Translating text", description: "Converting text to target language" },
  { key: "dubbing", label: "Cloning voice", description: "Generating speech with cloned voice" },
  { key: "merging", label: "Merging video", description: "Combining dubbed audio with original video" },
  { key: "completed", label: "Done", description: "Your video is ready" },
];

function getElapsedTime(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate).getTime();
  const end = endDate ? new Date(endDate).getTime() : Date.now();
  const seconds = Math.floor((end - start) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function getLanguageName(code: string): string {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? `${lang.flag} ${lang.name}` : code.toUpperCase();
}

// Each step gets a percentage range so progress feels smooth
const STEP_RANGES = [
  { start: 0, end: 5 },      // pending
  { start: 5, end: 20 },     // transcribing
  { start: 20, end: 35 },    // translating
  { start: 35, end: 85 },    // dubbing (longest step)
  { start: 85, end: 98 },    // merging
  { start: 98, end: 100 },   // completed
];

export function TranslationProgress({ id }: { id: string }) {
  const [data, setData] = useState<TranslationData | null>(null);
  const [elapsed, setElapsed] = useState("0s");
  const [smoothPercent, setSmoothPercent] = useState(0);
  const [stepEnteredAt, setStepEnteredAt] = useState(Date.now());
  const [lastStatus, setLastStatus] = useState("");

  useEffect(() => {
    async function poll() {
      const res = await fetch(`/api/translate/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.status !== "completed" && json.status !== "failed") {
          setTimeout(poll, 2000);
        }
      }
    }
    poll();
  }, [id]);

  // Track when step changes
  useEffect(() => {
    if (data && data.status !== lastStatus) {
      setLastStatus(data.status);
      setStepEnteredAt(Date.now());
    }
  }, [data, lastStatus]);

  // Smooth percentage + elapsed time ticker
  useEffect(() => {
    if (!data || data.status === "completed" || data.status === "failed") {
      if (data?.status === "completed") setSmoothPercent(100);
      return;
    }
    const interval = setInterval(() => {
      setElapsed(getElapsedTime(data.created_at));

      const stepIdx = STEPS.findIndex((s) => s.key === data.status);
      const range = STEP_RANGES[stepIdx] ?? { start: 0, end: 100 };
      const timeInStep = (Date.now() - stepEnteredAt) / 1000;
      // Ease toward 90% of the step range over time (never quite reaches end)
      const stepProgress = 1 - Math.exp(-timeInStep / 60);
      const percent = range.start + (range.end - range.start) * stepProgress * 0.9;
      setSmoothPercent(Math.round(Math.min(percent, range.end - 1)));
    }, 1000);
    return () => clearInterval(interval);
  }, [data, stepEnteredAt]);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === data.status);
  const percentage = data.status === "completed" ? 100 : smoothPercent;

  const totalTime = data.completed_at
    ? getElapsedTime(data.created_at, data.completed_at)
    : elapsed;

  // Estimate time remaining based on step and video duration
  const videoDuration = data.duration_seconds ?? 60;
  // Rough multiplier: processing takes ~3-5x video length on CPU
  const estimatedTotalSeconds = videoDuration * 4;
  const elapsedSeconds = (Date.now() - new Date(data.created_at).getTime()) / 1000;
  const remainingSeconds = Math.max(estimatedTotalSeconds - elapsedSeconds, 10);
  const estimatedTimeLeft = data.status === "completed" || data.status === "failed"
    ? "—"
    : remainingSeconds > 60
      ? `~${Math.ceil(remainingSeconds / 60)} min`
      : `~${Math.ceil(remainingSeconds)}s`;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Translation</h1>
          <p className="text-brand-muted">
            {data.source_language && (
              <span>{getLanguageName(data.source_language)} &rarr; </span>
            )}
            {getLanguageName(data.target_language)}
          </p>
        </div>
        {data.status !== "failed" && (
          <div className="text-right">
            <div className="text-3xl font-bold text-brand-primary">{percentage}%</div>
            <p className="text-xs text-brand-muted">
              {data.status === "completed" ? "Complete" : "Processing"}
            </p>
          </div>
        )}
      </div>

      {data.status === "failed" ? (
        <div className="space-y-6">
          <div className="p-6 rounded-card bg-red-50 border border-red-100">
            <h2 className="font-semibold text-red-700 mb-1">Translation failed</h2>
            <p className="text-sm text-red-600">{data.error_message ?? "An unexpected error occurred."}</p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-brand-border hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Try again
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {/* Left: Steps */}
          <div className="col-span-2">
            {/* Progress bar with percentage */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {data.status === "completed" ? "Translation complete" : STEPS[currentStepIndex]?.description}
                </span>
                <span className="text-sm font-semibold text-brand-primary">{percentage}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${data.status === "completed" ? "bg-green-500" : "bg-brand-primary"}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const isCompleted = data.status === "completed" ? true : i < currentStepIndex;
                const isActive = !isCompleted && step.key === data.status;
                const isFuture = !isCompleted && !isActive;

                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      isActive ? "bg-brand-primary/5 border border-brand-primary/20" :
                      isCompleted ? "bg-green-50/50" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100 text-brand-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : isActive ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-xs font-medium">{i + 1}</span>
                      )}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${isFuture ? "text-brand-muted" : "text-brand-text"}`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <p className="text-xs text-brand-muted mt-0.5">{step.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Video player + download */}
            {data.status === "completed" && data.download_url && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                {/* Video player */}
                <div className="rounded-card overflow-hidden border border-brand-border bg-black">
                  <video
                    controls
                    className="w-full aspect-video"
                    src={data.download_url}
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Download buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      const res = await fetch(data.download_url!);
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `translated-${data.target_language}.mp4`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold transition-colors shadow-lg shadow-brand-primary/25"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download video
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Info panel */}
          <div className="space-y-4">
            {/* Time card */}
            <div className="p-4 rounded-card border border-brand-border bg-white">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Time</span>
              </div>
              <div className="space-y-2">
                {data.status !== "completed" && data.status !== "failed" ? (
                  <div className="flex justify-between">
                    <span className="text-xs text-brand-muted">Estimated remaining</span>
                    <span className="text-xs font-medium">{estimatedTimeLeft}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-xs text-brand-muted">Total time</span>
                    <span className="text-xs font-medium">{totalTime}</span>
                  </div>
                )}
                {data.duration_seconds && (
                  <div className="flex justify-between">
                    <span className="text-xs text-brand-muted">Video length</span>
                    <span className="text-xs font-medium">
                      {Math.floor(data.duration_seconds / 60)}:{String(Math.floor(data.duration_seconds % 60)).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Details card */}
            <div className="p-4 rounded-card border border-brand-border bg-white">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span className="text-sm font-medium">Details</span>
              </div>
              <div className="space-y-2">
                {data.source_language && (
                  <div className="flex justify-between">
                    <span className="text-xs text-brand-muted">From</span>
                    <span className="text-xs font-medium">{getLanguageName(data.source_language)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-xs text-brand-muted">To</span>
                  <span className="text-xs font-medium">{getLanguageName(data.target_language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-brand-muted">Status</span>
                  <span className={`text-xs font-medium capitalize ${
                    data.status === "completed" ? "text-green-600" :
                    data.status === "failed" ? "text-red-600" :
                    "text-brand-primary"
                  }`}>
                    {data.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Back to dashboard */}
            <a
              href="/dashboard"
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-brand-border hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
