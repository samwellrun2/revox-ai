"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "./upload-zone";
import { LanguageSelector } from "./language-selector";
import { UsageMeter } from "./usage-meter";
import { RecentTranslations } from "./recent-translations";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import type { LanguageCode } from "@/lib/constants/languages";

interface DashboardClientProps {
  tier: string;
  minutesUsed: number;
  minutesLimit: number;
  translations: Array<{
    id: string;
    target_language: string;
    status: string;
    duration_seconds: number | null;
    created_at: string;
    source_url?: string | null;
    thumbnail_url?: string | null;
  }>;
}

export function DashboardClient({
  tier,
  minutesUsed,
  minutesLimit,
  translations,
}: DashboardClientProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageCode | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");
  const [durationError, setDurationError] = useState("");
  const router = useRouter();

  const maxSeconds: Record<string, number> = { free: 60, pro: 180, business: 300, enterprise: 600 };
  const maxSec = maxSeconds[tier] ?? 60;

  const hasSource = file !== null || url !== "";
  const canTranslate = hasSource && selectedLang !== "" && !isSubmitting && !durationError;

  function checkVideoDuration(videoFile: File) {
    setDurationError("");
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > maxSec) {
        setDurationError(
          `Video is ${Math.ceil(video.duration / 60)} min — your ${tier} plan allows up to ${Math.ceil(maxSec / 60)} min. Upgrade for longer videos.`
        );
      }
    };
    video.src = URL.createObjectURL(videoFile);
  }

  async function handleTranslate() {
    if (!canTranslate) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("target_language", selectedLang);
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("url", url);
    }

    const res = await fetch("/api/translate", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      router.push(`/dashboard/${data.id}`);
    } else {
      if (res.status === 403) {
        setUpgradeReason(data.error);
        setShowUpgrade(true);
      } else {
        alert(data.error ?? "Something went wrong");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">
        Translate a video
      </h1>
      <p className="text-brand-muted mb-8">
        Paste a link or upload a file to get started.
      </p>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <UploadZone
            onFileSelect={(f) => {
              setFile(f);
              setUrl("");
              setDurationError("");
              checkVideoDuration(f);
            }}
            onUrlSubmit={(u) => {
              setUrl(u);
              setFile(null);
              setDurationError("");
            }}
          />

          {hasSource && (
            <div className="p-4 rounded-xl bg-white border border-brand-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-sm font-medium truncate">
                {file ? file.name : url}
              </span>
              <button
                onClick={() => { setFile(null); setUrl(""); }}
                className="ml-auto text-brand-muted hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {durationError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-medium mb-2">{durationError}</p>
              <button
                onClick={() => {
                  setUpgradeReason(durationError);
                  setShowUpgrade(true);
                }}
                className="text-sm text-brand-primary font-medium hover:underline"
              >
                Upgrade your plan &rarr;
              </button>
            </div>
          )}

          <LanguageSelector
            value={selectedLang}
            onChange={setSelectedLang}
            tier={tier}
          />

          <button
            onClick={handleTranslate}
            disabled={!canTranslate}
            className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Starting translation..." : "Translate video"}
          </button>
        </div>

        <div className="space-y-6">
          <UsageMeter
            minutesUsed={minutesUsed}
            minutesLimit={minutesLimit}
            tier={tier}
          />
        </div>
      </div>

      <div className="mt-12">
        <RecentTranslations translations={translations} />
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
        currentTier={tier}
      />
    </div>
  );
}
