"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Languages supported" },
  { value: "HD", label: "Voice cloning quality" },
  { value: "< 2 min", label: "Average processing time" },
  { value: "Free", label: "To get started" },
];

export function SocialProof() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-brand-muted text-sm font-medium mb-10">
            Built for creators, educators, and businesses who want to reach a global audience
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-brand-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
