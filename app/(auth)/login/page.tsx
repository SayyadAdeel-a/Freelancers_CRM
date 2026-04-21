"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast.error("Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Add a client in under 5 seconds",
    "Log notes after every call",
    "Never forget a follow-up",
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel — full height, hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1A1A1A] text-white p-12 relative overflow-hidden">
        {/* Decorative orb */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#FF4C00] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#FF4C00] opacity-10 blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <Logo size="md" />
          <span className="font-bold text-2xl tracking-tight">Nudge</span>
        </div>

        {/* Tagline */}
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-600" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
          <h1 className="text-4xl font-bold leading-tight">
            Your clients,<br />
            <span className="text-[#FF4C00]">organized.</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            The dead-simple CRM for freelancers who hate complexity. No pipelines, no bloat — just clients and notes.
          </p>

          {/* Feature list */}
          <ul className="space-y-4 pt-2">
            {features.map((feat, i) => (
              <li
                key={feat}
                className="flex items-center gap-3 text-sm text-white/80 animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${250 + i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="w-5 h-5 rounded-full bg-[#FF4C00]/20 border border-[#FF4C00]/40 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#FF4C00]" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div
          className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm animate-in fade-in slide-in-from-left-4"
          style={{ animationDelay: "520ms", animationFillMode: "both" }}
        >
          <p className="text-white/70 text-sm italic leading-relaxed">
            &ldquo;Finally, a CRM that doesn&rsquo;t make me feel like I need a manual to send an email.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-7 h-7 rounded-full bg-[#FF4C00]/30 flex items-center justify-center text-xs font-bold text-white">
              S
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Sarah Chen</p>
              <p className="text-white/40 text-[11px]">Freelance Brand Designer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-4">
            <Logo size="md" />
            <span className="font-bold text-2xl tracking-tight">Nudge</span>
          </div>

          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div
              className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: "100ms", animationFillMode: "both" }}
            >
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-xl outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {focusedField === "email" && email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 animate-in fade-in" />
                )}
              </div>
            </div>

            <div
              className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: "160ms", animationFillMode: "both" }}
            >
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-xl outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {error && (
              <p
                className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-2.5 animate-in fade-in"
                style={{ animationDelay: "200ms" }}
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full shadow-brand font-semibold h-11 rounded-xl text-sm animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: "220ms", animationFillMode: "both" }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div
            className="relative animate-in fade-in"
            style={{ animationDelay: "280ms", animationFillMode: "both" }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs text-muted-foreground">or continue with</span>
            </div>
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-11 rounded-xl text-sm font-medium transition-all hover:bg-secondary animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: "340ms", animationFillMode: "both" }}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          {/* Footer link */}
          <p
            className="text-center text-sm text-muted-foreground animate-in fade-in"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            Don&rsquo;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
