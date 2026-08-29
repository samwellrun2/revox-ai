import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier")
    .eq("user_id", user!.id)
    .single();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: usage } = await supabase
    .from("usage")
    .select("minutes_used")
    .eq("user_id", user!.id)
    .eq("month", currentMonth)
    .single();

  const { data: translations } = await supabase
    .from("translations")
    .select("id, target_language, status, duration_seconds, created_at, source_url, source_file_path, output_file_path")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Generate signed URLs for source videos (for thumbnails)
  const translationsWithUrls = await Promise.all(
    (translations ?? []).map(async (t) => {
      let thumbnail_url: string | null = null;
      // Try to get stored thumbnail
      const { data: thumbData } = await supabase.storage.from("videos").createSignedUrl(`thumbnails/${t.id}.jpg`, 3600);
      thumbnail_url = thumbData?.signedUrl ?? null;
      return { ...t, thumbnail_url };
    })
  );

  const tier = (subscription?.tier ?? "free") as string;
  const minutesUsed = usage?.minutes_used ?? 0;
  const limits: Record<string, number> = { free: 3, pro: 30, business: 120, enterprise: 500 };
  const minutesLimit = limits[tier] ?? 3;

  return (
    <DashboardClient
      tier={tier}
      minutesUsed={minutesUsed}
      minutesLimit={minutesLimit}
      translations={translationsWithUrls}
    />
  );
}
