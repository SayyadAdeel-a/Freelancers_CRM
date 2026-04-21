import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-20 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto space-y-12 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Privacy.</h1>
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
            Last updated: April 21, 2026
          </p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed">
          <section className="space-y-4">
            <p className="text-xl font-medium text-foreground/80">
              At Nudge CRM, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">1. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground font-medium">
              <p>
                We collect information that you provide directly to us when you register for an account, use the application, or communicate with us.
              </p>
              <ul className="grid gap-3">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>Personal identification information (Name, email address)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>Authentication data provided by third-party identity providers (e.g., Google)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>Client data that you enter into the CRM application</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">2. Data Security</h2>
            <p className="text-muted-foreground font-medium">
              Your data is stored securely using Google Cloud (Firebase) infrastructure. We implement appropriate technical and organizational measures to protect your personal data and the client data you store in our CRM.
            </p>
            <p className="text-muted-foreground font-medium">
              We do not sell, trade, or rent your personal identification information to others.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">3. Third-Party Services</h2>
            <p className="text-muted-foreground font-medium">
              We use trusted partners to help us operate:
            </p>
            <ul className="grid gap-3 text-muted-foreground font-medium">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>Lemon Squeezy</strong> for secure payment processing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>PostHog</strong> for product analytics and improvement.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>Sentry</strong> for real-time error tracking and stability.</span>
              </li>
            </ul>
          </section>

          <section className="pt-10 border-t border-border/50">
            <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50 space-y-4">
              <h3 className="font-black uppercase tracking-widest text-xs text-primary">Questions?</h3>
              <p className="font-bold text-xl">Reach out to our privacy team.</p>
              <a 
                href="mailto:support@nudgecrm.com" 
                className="inline-block font-black text-primary hover:underline decoration-2 underline-offset-4"
              >
                support@nudgecrm.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
