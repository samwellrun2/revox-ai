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
  const [addCaptions, setAddCaptions] = useState(true);
  const [removeOriginalSubs, setRemoveOriginalSubs] = useState(true);
  const router = useRouter();

  const hasSource = file !== null || url !== "";
  const canTranslate = hasSource && selectedLang !== "" && !isSubmitting;

  async function handleTranslate() {
    if (!canTranslate) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("target_language", selectedLang);
    formData.append("add_captions", addCaptions ? "true" : "false");
    formData.append("remove_original_subs", removeOriginalSubs ? "true" : "false");
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
            }}
            onUrlSubmit={(u) => {
              setUrl(u);
              setFile(null);
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

          <LanguageSelector
            value={selectedLang}
            onChange={setSelectedLang}
            tier={tier}
          />

          {/* Caption options */}
          <div className="p-4 rounded-xl border border-brand-border bg-white space-y-3">
            <p className="text-sm font-medium">Caption options</p>
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <span className="text-sm">Add translated captions</span>
              </div>
              <input
                type="checkbox"
                checked={addCaptions}
                onChange={(e) => setAddCaptions(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span className="text-sm">Remove original subtitles</span>
              </div>
              <input
                type="checkbox"
                checked={removeOriginalSubs}
                onChange={(e) => setRemoveOriginalSubs(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20"
              />
            </label>
          </div>

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
