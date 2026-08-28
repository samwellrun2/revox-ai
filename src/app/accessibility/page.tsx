import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Accessibility Statement</h1>
          <p className="text-brand-muted mb-8">Last updated: August 28, 2026</p>

          <section className="space-y-4 text-sm leading-relaxed text-brand-text/80">
            <h2 className="text-lg font-semibold text-brand-text">Our Commitment</h2>
            <p>Revox AI is committed to ensuring digital accessibility for people with disabilities. We strive to continually improve the user experience for everyone and apply relevant accessibility standards.</p>

            <h2 className="text-lg font-semibold text-brand-text">Accessibility Features</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Semantic HTML structure for screen reader compatibility</li>
              <li>Keyboard navigable interface</li>
              <li>Sufficient color contrast ratios</li>
              <li>Text alternatives for non-text content</li>
              <li>Responsive design that works on all devices</li>
              <li>Clear and consistent navigation</li>
              <li>Form labels and error messages</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Standards</h2>
            <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible to people with a wide range of disabilities.</p>

            <h2 className="text-lg font-semibold text-brand-text">Feedback</h2>
            <p>We welcome your feedback on the accessibility of Revox AI. If you encounter any accessibility barriers or have suggestions for improvement, please contact us at <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a>.</p>
            <p>We aim to respond to accessibility feedback within 5 business days and resolve issues as quickly as possible.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
