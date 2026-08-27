import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { SocialProof } from "@/components/landing/social-proof";
import { Footer } from "@/components/landing/footer";
import { PricingCards } from "@/components/pricing/pricing-cards";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-brand-muted max-w-xl mx-auto">
                Start free. Upgrade when you need more.
              </p>
            </div>
            <PricingCards currentTier="free" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
