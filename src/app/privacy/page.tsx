import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-brand-muted mb-8">Last updated: August 28, 2026</p>

          <section className="space-y-4 text-sm leading-relaxed text-brand-text/80">
            <h2 className="text-lg font-semibold text-brand-text">1. Information We Collect</h2>
            <p>When you create an account, we collect your email address and name. If you sign in with Google, we receive your basic profile information from Google (name, email, profile picture).</p>
            <p>When you use our service, we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Videos you upload for translation (stored temporarily for processing)</li>
              <li>Translation history and usage data</li>
              <li>Payment information (processed securely by Stripe — we never store your card details)</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and improve our video translation service</li>
              <li>Process your translations and manage your account</li>
              <li>Track usage for billing purposes</li>
              <li>Send important service updates (no marketing spam)</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">3. Video Data</h2>
            <p>Videos you upload are processed using third-party AI services (OpenAI for transcription and translation). Your videos are stored temporarily in our secure cloud storage during processing and are available for download after completion. We do not use your videos to train AI models.</p>

            <h2 className="text-lg font-semibold text-brand-text">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase</strong> — authentication and database hosting</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>OpenAI</strong> — speech transcription and text translation</li>
              <li><strong>Vercel</strong> — website hosting</li>
            </ul>
            <p>Each service has its own privacy policy. We recommend reviewing them.</p>

            <h2 className="text-lg font-semibold text-brand-text">5. Data Security</h2>
            <p>We implement industry-standard security measures including encrypted connections (HTTPS), secure authentication tokens, and row-level database security. Payment data is handled entirely by Stripe and never touches our servers.</p>

            <h2 className="text-lg font-semibold text-brand-text">6. Data Retention</h2>
            <p>Your account data is retained as long as your account is active. Translated videos are stored for 30 days after processing, then automatically deleted. You can request deletion of your account and all associated data at any time by contacting us.</p>

            <h2 className="text-lg font-semibold text-brand-text">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">8. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>

            <h2 className="text-lg font-semibold text-brand-text">9. International Users (GDPR)</h2>
            <p>If you are located in the European Economic Area (EEA), United Kingdom, or similar jurisdictions, you have additional rights under the General Data Protection Regulation (GDPR):</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Legal basis:</strong> We process your data based on your consent (account creation) and legitimate interest (service operation)</li>
              <li><strong>Data portability:</strong> You may request a copy of your data in a machine-readable format</li>
              <li><strong>Right to erasure:</strong> You may request complete deletion of all your data</li>
              <li><strong>Right to restrict processing:</strong> You may request we limit how we use your data</li>
              <li><strong>Right to object:</strong> You may object to our processing of your data</li>
              <li><strong>Data transfers:</strong> Your data may be transferred to and processed in the United States where our servers are located</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a>. We will respond within 30 days.</p>

            <h2 className="text-lg font-semibold text-brand-text">10. California Residents (CCPA)</h2>
            <p>If you are a California resident, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Know what personal data we collect about you</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of the sale of your personal data (we do not sell your data)</li>
              <li>Not be discriminated against for exercising your rights</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">11. Children&apos;s Privacy</h2>
            <p>Revox AI is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected data from a child under 13, contact us immediately and we will delete it.</p>

            <h2 className="text-lg font-semibold text-brand-text">12. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the date above.</p>

            <h2 className="text-lg font-semibold text-brand-text">13. Contact</h2>
            <p>If you have questions about this privacy policy, contact us at <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
