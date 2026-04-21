"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Alert } from "@/components/Alert";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company || !password) {
      setError("Please fill in all fields");
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
            Create your account in seconds
          </p>
        </div>

        {/* Signup Card */}
        <Card className="p-8">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 font-mono">
                Create your account
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">
                    Get started with Nudge CRM
              </p>
            </div>

            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Company"
                placeholder="Acme Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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
              Create Account
            </Button>
          </form>
        </Card>

        {/* Login link */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm font-mono">
          Already have an account?{" "}
          <a href="/login" className="text-gray-900 dark:text-gray-100 hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}