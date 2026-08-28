import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <Image src="/logo.png" alt="Revox AI" width={40} height={40} className="rounded-lg" />
          <span className="text-2xl font-bold tracking-tight">Revox AI</span>
        </Link>
        <AuthForm />
        <p className="text-center text-xs text-brand-muted mt-8">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-brand-primary hover:underline">Terms</Link>,{" "}
          <Link href="/privacy" className="text-brand-primary hover:underline">Privacy Policy</Link>, and{" "}
          <Link href="/acceptable-use" className="text-brand-primary hover:underline">Acceptable Use Policy</Link>.
        </p>
      </div>
    </main>
  );
}
