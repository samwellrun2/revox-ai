"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Upload or paste a link",
    description: "Drop a video file or paste a YouTube, Vimeo, or direct video URL.",
  },
  {
    step: "02",
    title: "Choose your language",
    description: "Select from 50+ languages. Our AI handles the rest.",
  },
  {
    step: "03",
    title: "Get your dubbed video",
    description: "Download your video with the original voice speaking a new language.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Three steps. That&apos;s it.
          </h2>
          <p className="text-lg text-brand-muted">
            No editing skills needed. No complicated setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative p-8 rounded-card bg-white border border-brand-border"
            >
              <span className="text-5xl font-bold text-brand-primary/10 absolute top-6 right-6">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
                <span className="text-brand-primary font-bold">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-brand-muted leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
