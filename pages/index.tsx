import { useState } from "react";
import { Button } from "@/components/Button";
import { Card, CardTitle, CardDescription } from "@/components/Card";

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl text-center space-y-8">
          {/* Logo/Emoji - ONE moment of surprise */}
          <div className="flex justify-center">
            <span className="text-8xl font-light">🚀</span>
          </div>

          {/* Doto headline - ONE per screen */}
          <h1 className="text-display font-mono font-light">
            The CRM for people who hate CRMs
          </h1>

          {/* Secondary hierarchy - Space Grotesk */}
          <p className="text-primary font-body text-xl max-w-2xl mx-auto px-4">
            Radical simplicity for freelancers who value their time. Track clients,
            log notes, and set reminders without the friction.
          </p>

          {/* Tertiary - All caps, Space Mono */}
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">
              Start Free
            </Button>
            <Button variant="ghost" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-16 text-gray-900 dark:text-gray-100">
Designed for Freelancers
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-light">⚡️ Fast Setup</CardTitle>
                <CardDescription>
                  Get started in under 60 seconds. No complex configuration required.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-light">📝 Simple Notes</CardTitle>
                <CardDescription>
                  Log client interactions in seconds with a clean, distraction-free interface.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-light">🔔 Smart Reminders</CardTitle>
                <CardDescription>
                  Never miss a follow-up again with intelligent email reminders.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-light mb-4">
              Ready to simplify your client management?
            </h2>
            <p className="text-gray-400 font-mono text-sm mb-8 max-w-md mx-auto">
              Join thousands of freelancers who ditched the bloated CRMs for something
              that actually works.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg" className="px-8">
                Create Free Account
              </Button>
              <Button variant="ghost" size="lg" className="text-white border-white">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}