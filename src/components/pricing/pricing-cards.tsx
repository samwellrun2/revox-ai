"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try it out",
    features: [
      "2 minutes / month",
      "Up to 1 min videos",
      "5 languages",
      "Voice cloning",
    ],
    excluded: [],
    cta: "Get started",
    plan: null,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/ month",
    description: "For short-form creators",
    features: [
      "30 minutes / month",
      "Up to 3 min videos",
      "50+ languages",
      "Voice cloning",
    ],
    excluded: [],
    cta: "Upgrade to Pro",
    plan: "pro" as const,
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/ month",
    description: "For teams & longer content",
    features: [
      "120 minutes / month",
      "Up to 5 min videos",
      "50+ languages",
      "Voice cloning",
    ],
    excluded: [],
    cta: "Upgrade to Business",
    plan: "business" as const,
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/ month",
    description: "For scale",
    features: [
      "500 minutes / month",
      "Up to 10 min videos",
      "50+ languages",
      "Voice cloning",
    ],
    excluded: [],
    cta: "Upgrade to Enterprise",
    plan: "enterprise" as const,
    highlighted: false,
  },
];

export function PricingCards({ currentTier }: { currentTier: string }) {
  const [loading, setLoading] = useState("");
  const router = useRouter();

  async function handleUpgrade(plan: string) {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Something went wrong");
      setLoading("");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tiers.map((tier) => {
        const isCurrent = tier.plan === currentTier || (tier.plan === null && currentTier === "free");
        return (
          <div
            key={tier.name}
            className={`relative rounded-card p-6 transition-all ${
              tier.highlighted
                ? "bg-white border-2 border-brand-primary shadow-lg shadow-brand-primary/10 scale-[1.02]"
                : "bg-white border border-brand-border"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-primary text-white text-xs font-semibold rounded-full">
                Most popular
              </div>
            )}
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="text-sm text-brand-muted mb-4">{tier.description}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className="text-brand-muted text-sm">{tier.period}</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-brand-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
              {tier.excluded.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-brand-muted/60">
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                if (tier.plan) {
                  handleUpgrade(tier.plan);
                } else if (!isCurrent) {
                  router.push("/auth");
                }
              }}
              disabled={isCurrent || loading === tier.plan}
              className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
                tier.highlighted
                  ? "bg-brand-primary hover:bg-brand-primary-hover text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-brand-text"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isCurrent ? "Current plan" : loading === tier.plan ? "Redirecting..." : tier.cta}
            </button>
          </div>
        );
      })}
    </div>
  );
}
