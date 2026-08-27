"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Creators" },
  { value: "50+", label: "Languages" },
  { value: "100K+", label: "Videos translated" },
  { value: "4.9/5", label: "Rating" },
];

export function SocialProof() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-brand-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
