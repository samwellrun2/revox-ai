"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LANGUAGES } from "@/lib/constants/languages";

interface Translation {
  id: string;
  target_language: string;
  status: string;
  duration_seconds: number | null;
  created_at: string;
  source_url?: string | null;
  video_url?: string | null;
}

interface RecentTranslationsProps {
  translations: Translation[];
  showDelete?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  transcribing: "bg-blue-50 text-blue-600",
  translating: "bg-indigo-50 text-indigo-600",
  dubbing: "bg-violet-50 text-violet-600",
  merging: "bg-purple-50 text-purple-600",
  completed: "bg-green-50 text-green-600",
  failed: "bg-red-50 text-red-600",
};

function getLangInfo(code: string) {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? { flag: lang.flag, name: lang.name } : { flag: "", name: code.toUpperCase() };
}

function getYouTubeThumbnail(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  return null;
}

export function RecentTranslations({ translations, showDelete = false }: RecentTranslationsProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this translation? This cannot be undone.")) return;

    setDeleting(id);
    await fetch(`/api/translate/${id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(null);
  }

  if (translations.length === 0) {
    return (
      <div className="text-center py-16 text-brand-muted">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1">No translations yet</p>
        <p className="text-xs">Upload a video or paste a link to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent translations</h2>
        <span className="text-xs text-brand-muted">{translations.length} total</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {translations.map((t) => {
          const lang = getLangInfo(t.target_language);
          const thumbnail = getYouTubeThumbnail(t.source_url);
          const isProcessing = !["completed", "failed"].includes(t.status);

          return (
            <Link
              key={t.id}
              href={`/dashboard/${t.id}`}
              className="group rounded-card border border-brand-border bg-white hover:shadow-md transition-all overflow-hidden"
            >
              {/* Thumbnail / preview */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-50">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : t.video_url ? (
                  <video
                    src={t.video_url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                    onLoadedData={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.currentTime = 1;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Status overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-1.5">
                      <div className="w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium capitalize">{t.status}...</span>
                    </div>
                  </div>
                )}

                {/* Duration badge */}
                {t.duration_seconds && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {Math.floor(t.duration_seconds / 60)}:{String(Math.floor(t.duration_seconds % 60)).padStart(2, "0")}
                  </div>
                )}

                {/* Play icon on hover for completed */}
                {t.status === "completed" && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-brand-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <p className="text-sm font-medium">{lang.name}</p>
                      <p className="text-[11px] text-brand-muted">
                        {new Date(t.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                        statusColors[t.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                    {showDelete && (
                      <button
                        onClick={(e) => handleDelete(t.id, e)}
                        disabled={deleting === t.id}
                        className="p-1 rounded-lg hover:bg-red-50 text-brand-muted hover:text-red-500 transition-colors"
                      >
                        {deleting === t.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
