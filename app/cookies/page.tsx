import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function CookiePolicyPage() {
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Cookies.</h1>
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
            Last updated: April 21, 2026
          </p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed">
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">1. What Are Cookies?</h2>
            <p className="text-muted-foreground font-medium">
              Cookies are small text files that are placed on your device. They help us understand how you use Nudge CRM and keep your session secure.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">2. How We Use Them</h2>
            <ul className="grid gap-4 text-muted-foreground font-medium">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>Essential:</strong> Required for authentication and security.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>Analytics:</strong> We use PostHog to improve our features.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong>Performance:</strong> Sentry helps us catch and fix bugs.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">3. Managing Preferences</h2>
            <p className="text-muted-foreground font-medium">
              You can control cookies through your browser settings. Note that disabling essential cookies will prevent you from logging in.
            </p>
          </section>

          <section className="pt-10 border-t border-border/50 text-center">
            <p className="text-muted-foreground font-medium mb-4">Questions about our tech stack?</p>
            <a 
              href="mailto:support@nudgecrm.com" 
              className="inline-block px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-black tracking-tight shadow-brand hover:scale-105 transition-transform"
            >
              Contact Support
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
