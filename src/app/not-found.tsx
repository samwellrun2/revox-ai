import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
        <p className="text-xl font-semibold mb-2">Page not found</p>
        <p className="text-brand-muted mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-medium transition-colors"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
