import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TIER_LIMITS, type Tier } from "@/lib/tier-limits";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier")
    .eq("user_id", user.id)
    .single();

  const tier = (subscription?.tier ?? "free") as Tier;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: usage } = await supabase
    .from("usage")
    .select("minutes_used, translations_count")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .single();

  return NextResponse.json({
    tier,
    minutes_used: usage?.minutes_used ?? 0,
    translations_count: usage?.translations_count ?? 0,
    minutes_limit: TIER_LIMITS[tier].minutesPerMonth,
  });
}
