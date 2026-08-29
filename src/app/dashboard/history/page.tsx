import { createClient } from "@/lib/supabase/server";
import { RecentTranslations } from "@/components/dashboard/recent-translations";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: translations } = await supabase
    .from("translations")
    .select("id, target_language, status, duration_seconds, created_at, source_url")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">History</h1>
      <p className="text-brand-muted mb-8">All your past translations.</p>
      <RecentTranslations translations={translations ?? []} showDelete />
    </div>
  );
}
