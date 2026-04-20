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
      <Card className="w-full max-w-md shadow-brand transition-all hover:shadow-xl animate-in zoom-in duration-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">We'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/50 backdrop-blur-sm" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}
            <Button type="submit" className="w-full shadow-brand font-semibold" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
          </form>
          <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={16} /> Back to Login</Link>
        </CardContent>
      </Card>
    </div>
  );
}