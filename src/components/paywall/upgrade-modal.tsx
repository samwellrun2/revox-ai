"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  currentTier: string;
}

const upgrades = [
  { plan: "pro", name: "Pro", price: "$15/mo", minutes: "30 min/month" },
  { plan: "business", name: "Business", price: "$49/mo", minutes: "120 min/month" },
  { plan: "enterprise", name: "Enterprise", price: "$99/mo", minutes: "500 min/month" },
];

export function UpgradeModal({ isOpen, onClose, reason, currentTier }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

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
    }
    setLoading(null);
  }

  const availableUpgrades = upgrades.filter((u) => {
    const order = ["free", "pro", "business", "enterprise"];
    return order.indexOf(u.plan) > order.indexOf(currentTier);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-card p-8 max-w-md w-full shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-brand-muted hover:text-brand-text transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold mb-2">Upgrade your plan</h2>
            <p className="text-brand-muted text-sm mb-6">{reason}</p>

            <div className="space-y-3">
              {availableUpgrades.map((u) => (
                <button
                  key={u.plan}
                  onClick={() => handleUpgrade(u.plan)}
                  disabled={loading !== null}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-brand-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all"
                >
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-brand-muted">{u.minutes}</p>
                  </div>
                  <span className="font-semibold text-brand-primary">
                    {loading === u.plan ? "..." : u.price}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
