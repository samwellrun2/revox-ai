import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Security</h1>
          <p className="text-brand-muted mb-8">How we protect your data</p>

          <section className="space-y-4 text-sm leading-relaxed text-brand-text/80">
            <h2 className="text-lg font-semibold text-brand-text">Infrastructure Security</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Encryption in transit:</strong> All data is transmitted over HTTPS/TLS encryption</li>
              <li><strong>Encryption at rest:</strong> Database and file storage are encrypted at rest</li>
              <li><strong>Secure hosting:</strong> Our infrastructure is hosted on Vercel and Supabase, both SOC 2 compliant platforms</li>
              <li><strong>DDoS protection:</strong> Built-in protection through our hosting providers</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Authentication Security</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sign-in via Google OAuth 2.0 — no passwords stored on our servers</li>
              <li>Sessions use secure JWT tokens with expiration</li>
              <li>Row-Level Security (RLS) ensures users can only access their own data</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Payment Security</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All payment processing is handled by Stripe, a PCI DSS Level 1 certified provider</li>
              <li>We never see, store, or process your credit card information</li>
              <li>Stripe webhook signatures are verified to prevent fraudulent events</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Data Protection</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>API routes are authenticated — unauthenticated requests are rejected</li>
              <li>File uploads are validated for type and size</li>
              <li>Rate limiting prevents abuse</li>
              <li>Environment variables and API keys are stored securely, never in client-side code</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Video Data Security</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uploaded videos are stored in private cloud storage</li>
              <li>Download links are time-limited signed URLs (expire after 1 hour)</li>
              <li>Translated videos are retained for 30 days, then automatically deleted</li>
              <li>Videos are processed in isolated temporary environments</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Vulnerability Reporting</h2>
            <p>If you discover a security vulnerability, please report it responsibly to <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a> with the subject line &quot;Security Vulnerability Report&quot;. Please include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Description of the vulnerability</li>
              <li>Steps to reproduce</li>
              <li>Potential impact</li>
            </ul>
            <p>We will acknowledge your report within 48 hours and work to resolve the issue promptly. We appreciate responsible disclosure and will not take legal action against researchers who report vulnerabilities in good faith.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
