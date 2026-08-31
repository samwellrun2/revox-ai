export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { PricingCards } from "@/components/pricing/pricing-cards";

export default async function PricingPage() {
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
    <main className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-brand-muted max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>
        <PricingCards currentTier={currentTier} />
      </div>
    </main>
  );
}
