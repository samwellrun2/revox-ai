export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { PricingCards } from "@/components/pricing/pricing-cards";

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentTier = "free";
  if (user) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("tier")
      .eq("user_id", user.id)
      .single();
    currentTier = subscription?.tier ?? "free";
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Upgrade your plan</h1>
      <p className="text-brand-muted mb-8">Get more minutes, longer videos, and more languages.</p>
      <PricingCards currentTier={currentTier} />
    </div>
  );
}
