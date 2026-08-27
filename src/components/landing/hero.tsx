"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const floatingLanguages = [
  { flag: "🇪🇸", label: "Spanish", x: "-10%", y: "20%", delay: 0 },
  { flag: "🇫🇷", label: "French", x: "85%", y: "15%", delay: 0.2 },
  { flag: "🇯🇵", label: "Japanese", x: "-5%", y: "70%", delay: 0.4 },
  { flag: "🇩🇪", label: "German", x: "90%", y: "65%", delay: 0.6 },
  { flag: "🇧🇷", label: "Portuguese", x: "5%", y: "45%", delay: 0.3 },
  { flag: "🇰🇷", label: "Korean", x: "88%", y: "40%", delay: 0.5 },
];

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            Now supporting 50+ languages
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Your voice.
            <br />
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Any language.
            </span>
          </h1>

          <p className="text-xl text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Translate any video into 50+ languages with AI that clones the
            original speaker&apos;s voice. Same person. Same emotion. Different language.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth"
              className="px-8 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-lg transition-colors shadow-lg shadow-brand-primary/25"
            >
              Start translating free
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-xl bg-white border border-brand-border hover:bg-gray-50 font-semibold text-lg transition-colors"
            >
              See how it works
            </a>
          </div>
        </motion.div>

        {/* Dashboard mockup preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative"
        >
          {/* Floating language badges */}
          {floatingLanguages.map((lang) => (
            <motion.div
              key={lang.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + lang.delay }}
              className="absolute z-10 bg-white rounded-full shadow-lg shadow-black/10 px-3 py-1.5 flex items-center gap-1.5 border border-brand-border/50"
              style={{ left: lang.x, top: lang.y }}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-xs font-medium text-brand-text">{lang.label}</span>
            </motion.div>
          ))}

          <div className="rounded-card bg-white border border-brand-border shadow-2xl shadow-black/5 p-2 overflow-hidden">
            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              {/* Fake dashboard UI */}
              <div className="flex gap-4">
                {/* Sidebar mock */}
                <div className="w-48 hidden md:block">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center">
                      <span className="text-white font-bold text-xs">R</span>
                    </div>
                    <span className="font-bold text-sm">Revox AI</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.001 15.04 3 18.75m6-9.75l1.5 1.5" /></svg>
                      Translate
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      History
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281" /></svg>
                      Settings
                    </div>
                  </div>
                </div>

                {/* Main content mock */}
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="h-5 w-40 bg-gray-800 rounded mb-1.5" />
                    <div className="h-3 w-64 bg-gray-300 rounded" />
                  </div>

                  {/* Upload zone mock */}
                  <div className="border-2 border-dashed border-brand-primary/30 rounded-2xl p-8 bg-white/80 text-center mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    </div>
                    <p className="text-xs font-medium text-gray-600">Drop your video here, or click to browse</p>
                    <p className="text-[10px] text-gray-400 mt-1">MP4, MOV, AVI, MKV up to 2GB</p>
                  </div>

                  {/* Language selector mock */}
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Select a language...</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>

                  {/* Translate button mock */}
                  <div className="bg-brand-primary rounded-xl py-2.5 text-center">
                    <span className="text-white text-xs font-semibold">Translate video</span>
                  </div>
                </div>

                {/* Usage meter mock */}
                <div className="w-40 hidden lg:block">
                  <div className="bg-white rounded-2xl border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-medium">Usage</span>
                      <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-full font-medium">Free</span>
                    </div>
                    <div className="flex items-baseline gap-0.5 mb-2">
                      <span className="text-lg font-bold">0.0</span>
                      <span className="text-[10px] text-gray-400">/ 3 min</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full w-0 bg-brand-primary rounded-full" />
                    </div>
                  </div>

                  {/* Recent translations mock */}
                  <div className="mt-3 space-y-1.5">
                    {[
                      { flag: "🇪🇸", status: "Completed", color: "text-green-500" },
                      { flag: "🇫🇷", status: "Processing", color: "text-blue-500" },
                    ].map((item) => (
                      <div key={item.flag} className="bg-white rounded-xl border border-gray-200 p-2 flex items-center gap-2">
                        <span className="text-sm">{item.flag}</span>
                        <div className="flex-1">
                          <div className="h-2 w-12 bg-gray-200 rounded" />
                          <span className={`text-[8px] ${item.color} font-medium`}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-brand-primary/5 blur-2xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
