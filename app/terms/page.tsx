import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function TermsOfServicePage() {
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Terms.</h1>
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
            Last updated: April 21, 2026
          </p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed">
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">1. Acceptance</h2>
            <p className="text-muted-foreground font-medium">
              By accessing or using Nudge CRM, you agree to be bound by these Terms. If you do not agree, you may not use our services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">2. Description of Service</h2>
            <p className="text-muted-foreground font-medium">
              Nudge CRM provides a client management platform specifically designed for freelancers. We reserve the right to modify or discontinue any part of the service at any time.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">3. User Accounts</h2>
            <p className="text-muted-foreground font-medium">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">4. Intellectual Property</h2>
            <p className="text-muted-foreground font-medium">
              The service and its original content, features, and functionality are owned by Nudge CRM and are protected by international copyright and trademark laws.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground font-medium italic">
              In no event shall Nudge CRM be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
            </p>
          </section>

          <section className="pt-10 border-t border-border/50">
            <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50 space-y-4 text-center">
              <p className="font-black text-xs uppercase tracking-widest text-muted-foreground">Legal Contact</p>
              <a 
                href="mailto:support@nudgecrm.com" 
                className="inline-block font-black text-2xl text-primary hover:scale-105 transition-transform"
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
