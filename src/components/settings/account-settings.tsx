"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AccountSettingsProps {
  email: string;
  tier: string;
  minutesUsed: number;
  minutesLimit: number;
  stripeSubscriptionId: string | null;
}

export function AccountSettings({
  email,
  tier,
  minutesUsed,
  minutesLimit,
  stripeSubscriptionId,
}: AccountSettingsProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-brand-muted">Manage your account and subscription.</p>
      </div>

      <div className="p-6 rounded-card border border-brand-border bg-white space-y-4">
        <h2 className="font-semibold">Account</h2>
        <div className="flex items-center justify-between py-3 border-b border-brand-border/50">
          <span className="text-sm text-brand-muted">Email</span>
          <span className="text-sm font-medium">{email}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-brand-muted">Plan</span>
          <span className="text-sm font-medium capitalize">{tier}</span>
        </div>
      </div>

      <div className="p-6 rounded-card border border-brand-border bg-white space-y-4">
        <h2 className="font-semibold">Usage this month</h2>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{minutesUsed.toFixed(1)}</span>
          <span className="text-brand-muted">/ {minutesLimit} minutes</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary rounded-full"
            style={{ width: `${Math.min((minutesUsed / minutesLimit) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="p-6 rounded-card border border-brand-border bg-white space-y-4">
        <h2 className="font-semibold">Subscription</h2>
        {tier !== "free" ? (
          <p className="text-sm text-brand-muted">
            You&apos;re on the <span className="font-medium text-brand-text capitalize">{tier}</span> plan.
            {stripeSubscriptionId && " Manage your billing through the Stripe customer portal."}
          </p>
        ) : (
          <p className="text-sm text-brand-muted">
            You&apos;re on the free plan.{" "}
            <a href="/pricing" className="text-brand-primary font-medium hover:underline">
              Upgrade
            </a>{" "}
            for more minutes and features.
          </p>
        )}
      </div>

      <button
        onClick={handleSignOut}
        className="px-4 py-2.5 rounded-xl border border-brand-border hover:bg-gray-50 text-sm font-medium transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
