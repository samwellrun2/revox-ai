import { createClient } from "@/lib/supabase/server";
import { AccountSettings } from "@/components/settings/account-settings";
import { TIER_LIMITS, type Tier } from "@/lib/tier-limits";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier, stripe_subscription_id")
    .eq("user_id", user!.id)
    .single();

  const tier = (subscription?.tier ?? "free") as Tier;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: usage } = await supabase
    .from("usage")
    .select("minutes_used")
    .eq("user_id", user!.id)
    .eq("month", currentMonth)
    .single();

  return (
    <AccountSettings
      email={user!.email ?? ""}
      tier={tier}
      minutesUsed={usage?.minutes_used ?? 0}
      minutesLimit={TIER_LIMITS[tier].minutesPerMonth}
      stripeSubscriptionId={subscription?.stripe_subscription_id ?? null}
    />
  );
}
