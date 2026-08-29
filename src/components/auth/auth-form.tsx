"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score: 4, label: "Strong", color: "bg-green-500" };
  return { score: 5, label: "Very strong", color: "bg-green-600" };
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const strength = getPasswordStrength(password);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isLogin) {
      if (!name.trim()) {
        setError("Please enter your full name");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }
      if (strength.score < 2) {
        setError("Password is too weak. Add uppercase letters, numbers, or symbols.");
        setLoading(false);
        return;
      }
      if (!agreeToTerms) {
        setError("You must agree to the Terms and Privacy Policy");
        setLoading(false);
        return;
      }
    }

    if (isLogin) {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        if (authError.message.includes("Invalid login")) {
          setError("Incorrect email or password. Please try again.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
        },
      });
      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("An account with this email already exists. Try signing in.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }
      setSuccess("Account created! Check your email to verify, then sign in.");
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false,
      },
    });
    if (error) {
      setError(error.message);
    }
    if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-center mb-2">
        {isLogin ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-brand-muted text-center mb-8">
        {isLogin
          ? "Sign in to continue translating"
          : "Get started with 3 free minutes"}
      </p>

      <button
        onClick={handleGoogleAuth}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-brand-border bg-white hover:bg-gray-50 transition-colors font-medium mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-brand-bg px-4 text-brand-muted">or continue with email</span>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
              placeholder="John Doe"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            {isLogin && (
              <button
                type="button"
                className="text-xs text-brand-primary hover:underline"
                onClick={() => {
                  // Future: implement forgot password
                  alert("Check your email for a password reset link.");
                }}
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
              placeholder={isLogin ? "Enter your password" : "At least 8 characters"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {!isLogin && password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= strength.score ? strength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs ${strength.score <= 2 ? "text-red-500" : "text-green-600"}`}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {!isLogin && (
          <>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-300 focus:border-red-500"
                    : "border-brand-border focus:border-brand-primary"
                }`}
                placeholder="Re-enter your password"
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20"
              />
              <span className="text-xs text-brand-muted leading-relaxed">
                I agree to the{" "}
                <a href="/terms" target="_blank" className="text-brand-primary hover:underline">Terms of Service</a>,{" "}
                <a href="/privacy" target="_blank" className="text-brand-primary hover:underline">Privacy Policy</a>, and{" "}
                <a href="/acceptable-use" target="_blank" className="text-brand-primary hover:underline">Acceptable Use Policy</a>
              </span>
            </label>
          </>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!isLogin && !agreeToTerms)}
          className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isLogin ? "Signing in..." : "Creating account..."}
            </span>
          ) : isLogin ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-brand-muted mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setSuccess("");
          }}
          className="text-brand-primary font-medium hover:underline"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
