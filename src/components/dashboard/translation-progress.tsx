"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
}

const STEPS = [
  { key: "pending", label: "Queued" },
  { key: "transcribing", label: "Transcribing audio" },
  { key: "translating", label: "Translating text" },
  { key: "dubbing", label: "Cloning voice" },
  { key: "merging", label: "Merging video" },
  { key: "completed", label: "Done" },
];

export function TranslationProgress({ id }: { id: string }) {
  const [data, setData] = useState<TranslationData | null>(null);

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

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === data.status);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Translation</h1>
      <p className="text-brand-muted mb-8">
        {data.target_language.toUpperCase()}
        {data.duration_seconds && ` · ${Math.ceil(data.duration_seconds / 60)} min`}
      </p>

      {data.status === "failed" ? (
        <div className="p-6 rounded-card bg-red-50 border border-red-100">
          <h2 className="font-semibold text-red-700 mb-1">Translation failed</h2>
          <p className="text-sm text-red-600">{data.error_message ?? "An unexpected error occurred."}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {STEPS.map((step, i) => {
              const isCompleted = data.status === "completed" ? true : i < currentStepIndex;
              const isActive = !isCompleted && step.key === data.status;
              const isFuture = !isCompleted && !isActive;

              return (
                <div key={step.key} className="flex items-center gap-4">
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
                  <span
                    className={`text-sm font-medium ${
                      isFuture ? "text-brand-muted" : "text-brand-text"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {data.status !== "completed" && (
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          {data.status === "completed" && data.download_url && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <a
                href={data.download_url}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download translated video
              </a>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
