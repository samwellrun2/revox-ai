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
    .select("id, target_language, status, duration_seconds, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const tier = (subscription?.tier ?? "free") as string;
  const minutesUsed = usage?.minutes_used ?? 0;
  const limits: Record<string, number> = { free: 3, pro: 30, business: 120, enterprise: 500 };
  const minutesLimit = limits[tier] ?? 3;

  return (
    <DashboardClient
      tier={tier}
      minutesUsed={minutesUsed}
      minutesLimit={minutesLimit}
      translations={translations ?? []}
    />
  );
}
