import Link from "next/link";

interface Translation {
  id: string;
  target_language: string;
  status: string;
  duration_seconds: number | null;
  created_at: string;
}

interface RecentTranslationsProps {
  translations: Translation[];
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

export function RecentTranslations({ translations }: RecentTranslationsProps) {
  if (translations.length === 0) {
    return (
      <div className="text-center py-12 text-brand-muted">
        <p className="text-sm">No translations yet. Start by uploading a video above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-3">Recent translations</h2>
      {translations.map((t) => (
        <Link
          key={t.id}
          href={`/dashboard/${t.id}`}
          className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-white hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">{t.target_language.toUpperCase()}</p>
              <p className="text-xs text-brand-muted">
                {new Date(t.created_at).toLocaleDateString()}
                {t.duration_seconds && ` · ${Math.ceil(t.duration_seconds / 60)} min`}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
              statusColors[t.status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {t.status}
          </span>
        </Link>
      ))}
    </div>
  );
}
