"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Upload or paste a link",
    description: "Drop a video file or paste a YouTube, Vimeo, or direct video URL.",
    visual: (
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <div className="border-2 border-dashed border-brand-primary/20 rounded-xl p-4 text-center bg-white/50">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center mx-auto mb-2">
            <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-[10px] text-gray-500">my-video.mp4</p>
        </div>
        <div className="flex items-center gap-2 mt-3 px-2 py-1.5 bg-white rounded-lg border border-gray-200">
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757" /></svg>
          <span className="text-[10px] text-gray-400 truncate">https://youtube.com/watch?v=...</span>
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "Choose your language",
    description: "Select from 50+ languages. Our AI handles the rest.",
    visual: (
      <div className="mt-5 rounded-xl bg-gray-50 p-4 space-y-1.5">
        {[
          { flag: "🇪🇸", name: "Spanish", selected: true },
          { flag: "🇫🇷", name: "French", selected: false },
          { flag: "🇩🇪", name: "German", selected: false },
          { flag: "🇯🇵", name: "Japanese", selected: false },
        ].map((lang) => (
          <div
            key={lang.name}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              lang.selected ? "bg-brand-primary/10 border border-brand-primary/20" : "bg-white border border-gray-100"
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span className={`text-xs font-medium ${lang.selected ? "text-brand-primary" : "text-gray-600"}`}>
              {lang.name}
            </span>
            {lang.selected && (
              <svg className="w-3.5 h-3.5 text-brand-primary ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "03",
    title: "Get your dubbed video",
    description: "Download your video with the original voice speaking a new language.",
    visual: (
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-3">
          <div className="flex items-center gap-2">
            {["Transcribe", "Translate", "Clone", "Merge"].map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-[9px] text-gray-500">{s}</span>
                {i < 3 && <div className="w-3 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-brand-primary rounded-lg">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="text-[10px] text-white font-medium">Download translated video</span>
          </div>
        </div>
      </div>
    ),
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
              {item.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
