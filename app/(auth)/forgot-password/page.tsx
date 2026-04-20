"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(email);
      setMessage("Check your email for the password reset link.");
      toast.success("Reset link sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1A1A1A] text-white p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#FF4C00] opacity-15 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="w-10 h-10 bg-[#FF4C00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF4C00]/30">
            <span className="text-white font-bold text-2xl italic">N</span>
          </div>
          <span className="font-bold text-2xl tracking-tight">Nudge</span>
        </div>

        {/* Message */}
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-600" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
          <div className="w-14 h-14 rounded-2xl bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-[#FF4C00]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Lost your<br />
              <span className="text-[#FF4C00]">password?</span>
            </h1>
            <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-xs">
              No worries. Enter your email and we&rsquo;ll send you a link to reset it — no judgment.
            </p>
          </div>
        </div>

        <p className="text-white/30 text-xs animate-in fade-in" style={{ animationDelay: "400ms" }}>
          Still need help? Email us at hello@nudgecrm.com
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl italic">N</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">Nudge</span>
          </div>

          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">Reset password</h2>
            <p className="text-muted-foreground text-sm">
              We&rsquo;ll send a reset link to your email
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-4">
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
                required
                className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-xl outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {error && (
              <p
                className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-2.5 animate-in fade-in"
                style={{ animationDelay: "160ms" }}
              >
                {error}
              </p>
            )}

            {message && (
              <div
                className="flex items-start gap-3 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-600 animate-in fade-in"
                style={{ animationDelay: "160ms" }}
              >
                <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>{message}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full shadow-brand font-semibold h-11 rounded-xl text-sm animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: "220ms", animationFillMode: "both" }}
              disabled={loading || !!message}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending…
                </span>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          {/* Back link */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors animate-in fade-in"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
