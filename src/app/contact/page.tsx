import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Contact us</h1>
          <p className="text-brand-muted mb-10">
            Have a question, feature request, or need help? We&apos;d love to hear from you.
          </p>

          <div className="space-y-6">
            <a
              href="mailto:sam.fan2009@gmail.com"
              className="flex items-center gap-4 p-5 rounded-card border border-brand-border bg-white hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Email us</p>
                <p className="text-sm text-brand-muted">sam.fan2009@gmail.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 rounded-card border border-brand-border bg-white text-left">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Response time</p>
                <p className="text-sm text-brand-muted">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
