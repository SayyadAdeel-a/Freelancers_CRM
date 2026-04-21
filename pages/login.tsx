"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <span className="text-5xl font-light mb-4 block">📊</span>
          <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 font-mono">
            Nudge CRM
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-mono">
            Freelancer client management, simplified
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 font-mono">
                Sign in to your account
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">
                Enter your email to continue
              </p>
            </div>

            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Card>

        {/* Signup link */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm font-mono">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-gray-900 dark:text-gray-100 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}