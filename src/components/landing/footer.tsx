import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-brand-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Image src="/logo-r.png" alt="Revox AI" width={24} height={24} className="object-contain" />
          <span className="font-semibold">Revox AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-brand-muted">
          <Link href="/pricing" className="hover:text-brand-text transition-colors">Pricing</Link>
          <a href="#" className="hover:text-brand-text transition-colors">Terms</a>
          <a href="#" className="hover:text-brand-text transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand-text transition-colors">Contact</a>
        </div>
        <p className="text-sm text-brand-muted">
          &copy; {new Date().getFullYear()} Revox AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
