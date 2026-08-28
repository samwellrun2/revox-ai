import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function AIDisclosurePage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Disclosure</h1>
          <p className="text-brand-muted mb-8">Transparency about our use of artificial intelligence</p>

          <section className="space-y-4 text-sm leading-relaxed text-brand-text/80">
            <h2 className="text-lg font-semibold text-brand-text">AI Technologies Used</h2>
            <p>Revox AI uses the following artificial intelligence technologies to provide our video translation service:</p>

            <h3 className="font-semibold text-brand-text">Speech Recognition (Transcription)</h3>
            <p>We use AI-powered speech recognition to convert spoken audio into text. This process automatically detects the language being spoken and produces a text transcript of the video&apos;s audio content.</p>

            <h3 className="font-semibold text-brand-text">Machine Translation</h3>
            <p>AI-powered machine translation converts the transcribed text from the source language to the target language. While AI translation has improved significantly, it may not capture all nuances, idioms, or cultural context perfectly.</p>

            <h3 className="font-semibold text-brand-text">Voice Cloning &amp; Speech Synthesis</h3>
            <p>Our service uses AI voice cloning technology to generate speech that approximates the original speaker&apos;s voice characteristics. The cloned voice speaks the translated text in the target language. This technology:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Analyzes the acoustic properties of the original speaker&apos;s voice</li>
              <li>Generates new speech that mimics these properties</li>
              <li>Is an approximation — not a perfect reproduction</li>
              <li>May vary in quality depending on the source audio</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Limitations of AI</h2>
            <p>Users should be aware that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>AI translations may contain errors or inaccuracies</li>
              <li>Voice cloning quality depends on the clarity of the source audio</li>
              <li>Some languages may produce better results than others</li>
              <li>Complex technical, medical, or legal content may not translate accurately</li>
              <li>Humor, sarcasm, and cultural references may not translate well</li>
              <li>Background noise in source audio can reduce quality</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Data Usage</h2>
            <p>Your uploaded content is processed by AI models to provide the translation service. We want to be transparent about how your data interacts with AI:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your videos are sent to AI services for processing</li>
              <li>We do not use your videos or translations to train or improve AI models</li>
              <li>Processed data is stored temporarily and deleted according to our data retention policy</li>
              <li>Third-party AI providers may have their own data handling policies</li>
            </ul>

            <h2 className="text-lg font-semibold text-brand-text">Ethical Use</h2>
            <p>We are committed to the ethical use of AI technology. We prohibit the use of our voice cloning technology for impersonation, deepfakes, fraud, or any deceptive purposes. See our <a href="/acceptable-use" className="text-brand-primary hover:underline">Acceptable Use Policy</a> for details.</p>

            <h2 className="text-lg font-semibold text-brand-text">Human Oversight</h2>
            <p>While our service is automated, we maintain human oversight for abuse prevention, content moderation, and customer support. AI-generated translations are not reviewed by humans before delivery — users are responsible for verifying accuracy.</p>

            <h2 className="text-lg font-semibold text-brand-text">Continuous Improvement</h2>
            <p>AI technology is continuously evolving. We regularly evaluate and update our AI systems to improve accuracy, quality, and safety. As AI capabilities improve, the quality of our translations and voice cloning will improve as well.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
