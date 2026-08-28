import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-brand-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Revox AI" width={28} height={28} className="rounded-md" />
          <span className="font-semibold">Revox AI</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-brand-muted">
          <Link href="/pricing" className="hover:text-brand-text transition-colors">Pricing</Link>
          <Link href="/terms" className="hover:text-brand-text transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-brand-text transition-colors">Privacy</Link>
          <Link href="/acceptable-use" className="hover:text-brand-text transition-colors">Acceptable Use</Link>
          <Link href="/dmca" className="hover:text-brand-text transition-colors">DMCA</Link>
          <Link href="/disclaimer" className="hover:text-brand-text transition-colors">Disclaimer</Link>
          <Link href="/refund" className="hover:text-brand-text transition-colors">Refund Policy</Link>
          <Link href="/security" className="hover:text-brand-text transition-colors">Security</Link>
          <Link href="/ai-disclosure" className="hover:text-brand-text transition-colors">AI Disclosure</Link>
          <Link href="/accessibility" className="hover:text-brand-text transition-colors">Accessibility</Link>
          <Link href="/contact" className="hover:text-brand-text transition-colors">Contact</Link>
        </div>
        <p className="text-xs text-brand-muted">
          &copy; {new Date().getFullYear()} Revox AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
