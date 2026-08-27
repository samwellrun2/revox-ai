"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
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

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="rounded-card bg-white border border-brand-border shadow-2xl shadow-black/5 p-2 overflow-hidden">
            <div className="rounded-xl bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                </div>
                <p className="text-brand-muted text-sm">Video demo preview</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-brand-primary/5 blur-2xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
