import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function RefundPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Refund Policy</h1>
          <p className="text-brand-muted mb-8">Last updated: August 28, 2026</p>

          <section className="space-y-4 text-sm leading-relaxed text-brand-text/80">
            <h2 className="text-lg font-semibold text-brand-text">Free Trial</h2>
            <p>Revox AI offers a free tier so you can try the service before purchasing a paid subscription. We encourage all users to test the service with the free tier before upgrading.</p>

            <h2 className="text-lg font-semibold text-brand-text">Subscription Cancellation</h2>
            <p>You may cancel your subscription at any time. Upon cancellation:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your subscription will remain active until the end of your current billing period</li>
              <li>You will not be charged for the next billing period</li>
              <li>Your account will revert to the free tier after the billing period ends</li>
              <li>Your translation history will be preserved</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Refund Eligibility</h2>
            <p>We offer refunds under the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Within 7 days of purchase:</strong> Full refund if you have used less than 10% of your monthly minutes</li>
              <li><strong>Service failure:</strong> If our service fails to process your video due to a technical error on our end, we will credit the minutes back to your account</li>
              <li><strong>Duplicate charges:</strong> If you are charged twice for the same billing period, we will refund the duplicate charge immediately</li>
              <li><strong>Unauthorized charges:</strong> If a charge was made without your authorization, contact us immediately</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Non-Refundable</h2>
            <p>Refunds are generally NOT provided for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Minutes already used for completed translations</li>
              <li>Dissatisfaction with AI translation quality (since this can be tested on the free tier)</li>
              <li>Failure to cancel before the next billing cycle</li>
              <li>Account suspension or termination due to policy violations</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">How to Request a Refund</h2>
            <p>To request a refund, email <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a> with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your account email</li>
              <li>Date of purchase</li>
              <li>Reason for refund request</li>
            </ul>
            <p>We will review your request and respond within 3 business days. Approved refunds will be processed through Stripe and typically appear on your statement within 5-10 business days.</p>

            <h2 className="text-lg font-semibold text-brand-text">Chargebacks</h2>
            <p>We encourage you to contact us before initiating a chargeback with your bank. Chargebacks result in additional fees and may lead to account suspension. We are happy to resolve any billing issues directly.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
