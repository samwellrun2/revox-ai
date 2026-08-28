import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function AcceptableUsePage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Acceptable Use Policy</h1>
          <p className="text-brand-muted mb-8">Last updated: August 28, 2026</p>

          <section className="space-y-4 text-sm leading-relaxed text-brand-text/80">
            <p>This Acceptable Use Policy outlines prohibited activities when using Revox AI. Violation of this policy may result in immediate account suspension or termination.</p>

            <h2 className="text-lg font-semibold text-brand-text">Prohibited Content</h2>
            <p>You may not upload, translate, or distribute content that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Infringes on any copyright, trademark, or intellectual property rights</li>
              <li>Contains illegal material in any jurisdiction</li>
              <li>Is sexually explicit or pornographic</li>
              <li>Promotes violence, terrorism, or hate speech</li>
              <li>Contains personal information of others without consent</li>
              <li>Is defamatory, harassing, or threatening</li>
              <li>Contains malware, viruses, or harmful code</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Prohibited Uses of Voice Cloning</h2>
            <p>Voice cloning technology must be used responsibly. You may NOT:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Impersonate others</strong> — do not clone someone&apos;s voice without their explicit consent</li>
              <li><strong>Create deepfakes</strong> — do not create misleading audio/video intended to deceive</li>
              <li><strong>Fraud or scams</strong> — do not use cloned voices for fraudulent purposes</li>
              <li><strong>Political manipulation</strong> — do not create fake political content</li>
              <li><strong>Non-consensual content</strong> — do not clone voices of people who haven&apos;t consented</li>
            </ul>
            <p>You may only clone voices from content you own or have explicit permission to translate.</p>

            <h2 className="text-lg font-semibold text-brand-text">Prohibited Technical Activities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Attempting to bypass usage limits or security measures</li>
              <li>Reverse engineering or scraping the service</li>
              <li>Using automated tools to access the service without authorization</li>
              <li>Sharing account credentials with others</li>
              <li>Reselling access to the service</li>
              <li>Overloading the service with excessive requests</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Copyright Compliance</h2>
            <p>You are solely responsible for ensuring you have the legal right to translate any content you upload. This includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Content you created yourself</li>
              <li>Content you have a license to translate</li>
              <li>Content that falls under fair use (educational, commentary, criticism)</li>
            </ul>
            <p>If you are unsure whether you have the right to translate content, do not upload it.</p>

            <h2 className="text-lg font-semibold text-brand-text">Reporting Violations</h2>
            <p>If you become aware of any content or activity that violates this policy, please report it to <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a>.</p>

            <h2 className="text-lg font-semibold text-brand-text">Enforcement</h2>
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Remove any content that violates this policy</li>
              <li>Suspend or terminate accounts without prior notice</li>
              <li>Report illegal activities to law enforcement</li>
              <li>Cooperate with legal authorities in investigations</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
