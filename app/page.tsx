import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  ArrowRight,
  Users,
  FileText,
  Bell,
  Zap,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* Top accent rule */}
      <div className="fixed top-0 left-0 right-0 h-px bg-primary z-50" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
            <span className="font-bold text-xl tracking-tight">Nudge</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <Link href="/login" className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
            <Link href="/signup">
              <Button className="rounded-sm font-mono uppercase tracking-wider text-xs h-9 px-5">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 bg-dot-pattern border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Built for solo freelancers</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05]">
            The CRM for people<br />
            <span className="text-primary">who hate CRMs.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono">
            Manage clients without the 747 cockpit. Track leads, log notes, never forget a follow-up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 px-8 rounded-sm font-mono uppercase tracking-widest text-xs shadow-brand">
                Start for free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">No credit card · Up to 25 clients free</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">Why Nudge</p>
                <h2 className="text-4xl font-bold tracking-tight">Ditch the &quot;Boeing 747&quot; complexity.</h2>
                <p className="text-muted-foreground leading-relaxed mt-4 font-mono text-sm">
                  You&apos;re a freelancer. You don&apos;t need a cockpit; you need a bicycle.
                </p>
              </div>

              <ul className="space-y-3">
                {[
                  "Add a client in under 5 seconds",
                  "Log quick notes after every call",
                  "Get email reminders to follow up",
                  "Minimalist, zero-friction interface",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-mono">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, title: "Client Directory", desc: "All your contacts in one clean, scannable list.", delay: "200ms" },
                { icon: FileText, title: "Activity Notes", desc: "Chronological logs of every interaction.", delay: "300ms" },
                { icon: Bell, title: "Reminders", desc: "Never drop a lead with smart email follow-ups.", delay: "400ms" },
                { icon: Check, title: "Simplicity", desc: "No pipelines. No dashboards. No noise.", delay: "500ms" },
              ].map(({ icon: Icon, title, desc, delay }, i) => (
                <div
                  key={title}
                  className={`bg-card border border-border rounded-sm p-6 space-y-3 hover:border-foreground transition-all animate-in fade-in slide-in-from-bottom-4 ${i % 2 === 0 ? "mt-8" : ""}`}
                  style={{ animationDelay: delay, animationFillMode: "both" }}
                >
                  <Icon className="w-8 h-8 text-primary" />
                  <h3 className="font-bold text-sm tracking-tight">{title}</h3>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-b border-border bg-card/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-3">
            <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Simple pricing for solo pros.</h2>
            <p className="text-muted-foreground font-mono text-sm">Start for free, upgrade when you grow.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Free Plan */}
            <div className="bg-card border border-border rounded-sm p-10 flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Free</h3>
                  <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider mt-1">For getting started.</p>
                </div>
                <div className="text-6xl font-bold tracking-tight">$0</div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-mono">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    Up to 25 clients
                  </li>
                  <li className="flex items-center gap-3 text-sm font-mono">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    Basic note taking
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
                    <X className="w-4 h-4 shrink-0" />
                    <span className="line-through">Email reminders</span>
                  </li>
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button variant="outline" className="w-full h-11 rounded-sm font-mono uppercase tracking-widest text-xs">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-card border-2 border-primary rounded-sm p-10 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest font-mono">
                Popular
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Pro</h3>
                  <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider mt-1">For active freelancers.</p>
                </div>
                <div className="text-6xl font-bold tracking-tight">$9<span className="text-xl text-muted-foreground font-normal font-mono">/mo</span></div>
                <ul className="space-y-3">
                  {["Unlimited clients", "Email reminders", "Notes history", "Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold font-mono">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button className="w-full h-11 rounded-sm font-mono uppercase tracking-widest text-xs shadow-brand">
                  Go Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary">FAQ</p>
            <h2 className="text-4xl font-bold tracking-tight">Questions? Answers.</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Can I receive payments through Payoneer?",
                a: "Nudge is a CRM, not a payment processor. Track your client relationships here, but handle payments via Payoneer, Wise, or your preferred platform.",
              },
              {
                q: "Why is it so simple compared to other CRMs?",
                a: "We believe freelancers don't need enterprise complexity. No pipelines, no lead scoring, no bloat — just the essentials to manage your client relationships.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. Your data is stored with Firebase (Google Cloud) and protected with industry-standard encryption. We never sell or share your information.",
              },
              {
                q: "What happens when I hit 25 clients on the Free plan?",
                a: "You'll need to upgrade to Pro to add more clients. Your existing clients and data remain accessible — you just can't add new ones until you upgrade.",
              },
              {
                q: "Can I cancel my Pro subscription anytime?",
                a: "Yes, cancel anytime with no questions asked. You'll keep Pro features until the end of your billing period, then automatically drop to Free.",
              },
              {
                q: "Is there a mobile app?",
                a: "Not yet, but Nudge is fully responsive and works great on mobile browsers. A native app is on the roadmap.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-card border border-border rounded-sm p-6 hover:border-foreground transition-all">
                <h3 className="font-bold text-sm tracking-tight mb-2">{q}</h3>
                <p className="text-muted-foreground text-xs font-mono leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
                <span className="font-black text-xl tracking-tight uppercase">Nudge.</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono max-w-xs leading-relaxed">
                The minimalist CRM for solo freelancers who hate complexity.<br />Focus on your craft, not your tools.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-12">
              {[
                { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }] },
                { title: "Account", links: [{ label: "Login", href: "/login" }, { label: "Sign Up", href: "/signup" }] },
                { title: "Legal", links: [{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }, { label: "Cookies", href: "/cookies" }] },
              ].map((col) => (
                <div key={col.title} className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
              © 2026 Nudge CRM. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-sm bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono">System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
