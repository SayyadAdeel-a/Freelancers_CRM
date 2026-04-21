"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(email, password);
      toast.success("Account created! Welcome to Nudge.");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast.error("Signup failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  const perks = [
    { label: "Up to 5 clients free", sub: "No credit card needed" },
    { label: "Notes & activity logs", sub: "Every interaction tracked" },
    { label: "Email reminders", sub: "Pro feature, never miss a follow-up" },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#FF4C00] text-white p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/10 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <Logo size="md" />
          <span className="font-bold text-2xl tracking-tight text-white">Nudge</span>
        </div>

        {/* CTA content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-600" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white/90">
              <Sparkles className="w-3 h-3" />
              Free to start. No credit card.
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Client management,<br />
              <span className="text-white/80">finally simple.</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Join thousands of freelancers who dropped the bloat and started using a CRM that actually makes sense.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-3">
            {perks.map((perk, i) => (
              <div
                key={perk.label}
                className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${250 + i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{perk.label}</p>
                  <p className="text-xs text-white/60">{perk.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div
          className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4"
          style={{ animationDelay: "520ms", animationFillMode: "both" }}
        >
          <div className="flex -space-x-2">
            {["S", "M", "A", "R"].map((initial, i) => (
              <div
                key={initial}
                className="w-8 h-8 rounded-full border-2 border-[#FF4C00] bg-[#FF4C00]/30 flex items-center justify-center text-xs font-bold text-white"
                style={{ zIndex: 4 - i }}
              >
                {initial}
              </div>
            ))}
          </div>
          <p className="text-white/70 text-xs">
            <span className="font-semibold text-white">2,400+</span> freelancers already using Nudge
          </p>
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
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground text-sm">
              Takes less than 2 minutes to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div
              className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: "100ms", animationFillMode: "both" }}
            >
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
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
            </div>

            <div
              className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: "160ms", animationFillMode: "both" }}
            >
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                minLength={6}
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
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Get started free <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline underline-offset-2 hover:text-foreground">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </a>
            </p>
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
            onClick={handleGoogleSignup}
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
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
