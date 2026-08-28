import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function DMCAPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">DMCA Policy</h1>
          <p className="text-brand-muted mb-8">Last updated: August 28, 2026</p>

          <section className="space-y-4 text-sm leading-relaxed text-brand-text/80">
            <h2 className="text-lg font-semibold text-brand-text">Copyright Infringement Notices</h2>
            <p>Revox AI respects the intellectual property rights of others. If you believe that content available through our service infringes your copyright, you may submit a DMCA takedown notice.</p>

            <h2 className="text-lg font-semibold text-brand-text">How to File a DMCA Notice</h2>
            <p>To file a DMCA takedown notice, send an email to <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a> with the subject line &quot;DMCA Takedown Request&quot; and include:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>A description of the copyrighted work you claim has been infringed</li>
              <li>A description of where the infringing material is located on our service (e.g., translation ID, URL)</li>
              <li>Your contact information (name, address, phone number, email)</li>
              <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner</li>
              <li>A statement, under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner</li>
              <li>Your physical or electronic signature</li>
            </ol>

            <h2 className="text-lg font-semibold text-brand-text">Response Timeline</h2>
            <p>Upon receiving a valid DMCA notice, we will:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Remove or disable access to the infringing content within 24 hours</li>
              <li>Notify the user who uploaded the content</li>
              <li>Provide the user an opportunity to file a counter-notice if they believe the takedown was in error</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Repeat Infringers</h2>
            <p>We will terminate the accounts of users who are repeat copyright infringers. A user who receives three valid DMCA notices will have their account permanently suspended.</p>

            <h2 className="text-lg font-semibold text-brand-text">Counter-Notices</h2>
            <p>If you believe your content was removed in error, you may submit a counter-notice to the same email address with your contact information, a description of the removed content, and a statement under penalty of perjury that you have a good faith belief the content was removed by mistake.</p>

            <h2 className="text-lg font-semibold text-brand-text">Contact</h2>
            <p>DMCA Agent: <a href="mailto:sam.fan2009@gmail.com" className="text-brand-primary hover:underline">sam.fan2009@gmail.com</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
