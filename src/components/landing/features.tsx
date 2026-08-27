"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Voice cloning",
    description: "AI preserves the original speaker's voice, tone, and emotion in the translated audio.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    visual: (
      <div className="flex items-center gap-3 mt-5 p-3 bg-gray-50 rounded-xl">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
              <span className="text-[10px]">🎤</span>
            </div>
            <span className="text-[10px] font-medium">Original voice</span>
          </div>
          <div className="flex gap-0.5">
            {[3, 5, 8, 4, 7, 9, 6, 3, 7, 5, 8, 4, 6, 9, 3, 5, 7, 4, 8, 6].map((h, i) => (
              <div key={i} className="w-1 bg-brand-primary/40 rounded-full" style={{ height: `${h * 2.5}px` }} />
            ))}
          </div>
        </div>
        <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center">
              <span className="text-[10px]">🔊</span>
            </div>
            <span className="text-[10px] font-medium">Cloned in Spanish</span>
          </div>
          <div className="flex gap-0.5">
            {[4, 6, 7, 5, 8, 9, 5, 4, 8, 6, 7, 3, 7, 8, 4, 6, 8, 5, 7, 5].map((h, i) => (
              <div key={i} className="w-1 bg-brand-secondary/40 rounded-full" style={{ height: `${h * 2.5}px` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "50+ languages",
    description: "From Spanish to Swahili. Reach audiences worldwide with accurate, natural translations.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    visual: (
      <div className="flex flex-wrap gap-1.5 mt-5">
        {["🇺🇸", "🇪🇸", "🇫🇷", "🇩🇪", "🇯🇵", "🇰🇷", "🇨🇳", "🇧🇷", "🇷🇺", "🇮🇳", "🇸🇦", "🇹🇷", "🇮🇹", "🇳🇱", "🇵🇱", "🇻🇳", "🇹🇭", "🇺🇦", "🇬🇷", "🇸🇪", "🇨🇿", "🇷🇴", "🇭🇺", "🇮🇩"].map((flag, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm hover:scale-110 transition-transform cursor-default"
          >
            {flag}
          </motion.div>
        ))}
        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary">
          +30
        </div>
      </div>
    ),
  },
  {
    title: "Any video source",
    description: "Upload files or paste links from YouTube, Vimeo, or any direct video URL.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    visual: (
      <div className="space-y-2 mt-5">
        {[
          { icon: "▶️", name: "YouTube", color: "bg-red-50 text-red-500" },
          { icon: "🔵", name: "Vimeo", color: "bg-blue-50 text-blue-500" },
          { icon: "📁", name: "File upload", color: "bg-gray-50 text-gray-500" },
        ].map((source) => (
          <div key={source.name} className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50">
            <span className="text-sm">{source.icon}</span>
            <span className="text-xs font-medium">{source.name}</span>
            <svg className="w-3.5 h-3.5 text-green-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Lightning fast",
    description: "Most videos are translated in minutes, not hours. Priority processing for paid plans.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    visual: (
      <div className="mt-5 p-3 bg-gray-50 rounded-xl">
        <div className="space-y-2.5">
          {[
            { step: "Transcribe", time: "0:12", pct: 100 },
            { step: "Translate", time: "0:08", pct: 100 },
            { step: "Clone voice", time: "0:34", pct: 100 },
            { step: "Merge", time: "0:05", pct: 75 },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <span className="text-[10px] font-medium w-16">{item.step}</span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-primary rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${item.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-[10px] text-brand-muted w-8 text-right">{item.time}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-200">
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="text-[10px] font-medium text-green-600">Done in under 1 minute</span>
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Built for creators who think globally
          </h2>
          <p className="text-lg text-brand-muted">
            Everything you need to reach a worldwide audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-card border border-brand-border hover:shadow-lg hover:shadow-black/5 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-brand-muted leading-relaxed">{f.description}</p>
              {f.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
