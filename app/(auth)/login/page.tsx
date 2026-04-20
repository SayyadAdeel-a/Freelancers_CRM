"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Log in to your Nudge account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: "160ms", animationFillMode: "both" }}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive animate-in fade-in" style={{ animationDelay: "200ms" }}>
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full shadow-brand font-semibold animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: "220ms", animationFillMode: "both" }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="relative animate-in fade-in" style={{ animationDelay: "280ms", animationFillMode: "both" }}>
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full transition-colors hover:bg-secondary animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: "320ms", animationFillMode: "both" }}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>

            <p className="text-center text-sm text-muted-foreground animate-in fade-in" style={{ animationDelay: "380ms", animationFillMode: "both" }}>
              Don&rsquo;t have an account?{" "}
              <a href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </a>
            </p>
            <p className="text-center text-sm animate-in fade-in" style={{ animationDelay: "420ms", animationFillMode: "both" }}>
              <a href="/forgot-password" className="font-semibold text-muted-foreground hover:text-primary hover:underline">
                Forgot your password?
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
