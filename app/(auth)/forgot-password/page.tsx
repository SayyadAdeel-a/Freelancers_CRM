"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-2xl italic">N</span>
          </div>
          <span className="font-bold text-3xl tracking-tight">Nudge</span>
        </div>

        <Card className="w-full shadow-brand transition-all hover:shadow-xl">
          <CardHeader className="space-y-1 text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              We&rsquo;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive animate-in fade-in" style={{ animationDelay: "150ms" }}>
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-green-600 animate-in fade-in" style={{ animationDelay: "150ms" }}>
                  {message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full shadow-brand font-semibold animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: "200ms", animationFillMode: "both" }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors animate-in fade-in"
              style={{ animationDelay: "280ms", animationFillMode: "both" }}
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
