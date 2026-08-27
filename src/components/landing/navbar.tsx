"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Revox AI" width={36} height={36} />
          <span className="text-xl font-bold tracking-tight">Revox AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
            How it works
          </a>
          <a href="#features" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth"
            className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium transition-colors"
          >
            Get started free
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
