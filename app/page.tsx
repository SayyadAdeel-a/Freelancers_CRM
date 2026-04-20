import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  ArrowRight, 
  Users, 
  FileText, 
  Bell, 
  Zap, 
  X
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#262626] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF4C00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF4C00]/20">
              <span className="text-white font-bold text-2xl italic">N</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">Nudge</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-[#FF4C00] transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-[#FF4C00] transition-colors">Pricing</a>
            <Link href="/login" className="text-sm font-medium hover:text-[#FF4C00] transition-colors">Log In</Link>
            <Link href="/signup">
              <Button className="shadow-brand">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] text-sm font-bold">
            <Zap className="w-4 h-4 fill-current" />
            <span>Built for solo freelancers</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
            The CRM for people <br />
            <span className="text-[#FF4C00]">who hate CRMs.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Manage your clients without the 747 cockpit. A dead-simple way to track leads, log notes, and never forget a follow-up.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-8 text-lg shadow-brand rounded-xl">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">No credit card required • Up to 5 clients</p>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section id="features" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Ditch the "Boeing 747" complexity.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most CRMs are built for sales teams with complex pipelines and lead scoring. 
                You're a freelancer. You don't need a cockpit; you need a bicycle.
              </p>
              
              <ul className="space-y-4 pt-4">
                {[
                  "Add a client in under 5 seconds",
                  "Log quick notes after every call",
                  "Get email reminders to follow up",
                  "Minimalist, zero-friction interface"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="bg-[#FF4C00]/10 p-1 rounded-full">
                      <Check className="w-4 h-4 text-[#FF4C00]" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="bg-[#F9F9F9] p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
                  <Users className="w-10 h-10 text-[#FF4C00]" />
                  <h3 className="font-bold text-xl">Client Directory</h3>
                  <p className="text-sm text-muted-foreground">Keep all your contacts in one clean, scannable list.</p>
                </div>
                <div className="bg-[#F9F9F9] p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
                  <FileText className="w-10 h-10 text-[#FF4C00]" />
                  <h3 className="font-bold text-xl">Activity Notes</h3>
                  <p className="text-sm text-muted-foreground">Chronological logs of every interaction you have.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-[#F9F9F9] p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
                  <Bell className="w-10 h-10 text-[#FF4C00]" />
                  <h3 className="font-bold text-xl">Reminders</h3>
                  <p className="text-sm text-muted-foreground">Never drop a lead again with smart email follow-ups.</p>
                </div>
                <div className="bg-[#F9F9F9] p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
                  <Check className="w-10 h-10 text-[#FF4C00]" />
                  <h3 className="font-bold text-xl">Simplicity</h3>
                  <p className="text-sm text-muted-foreground">No pipelines. No dashboards. No noise. Just work.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Simple pricing for solo pros.</h2>
            <p className="text-lg text-muted-foreground">Start for free, upgrade when you grow.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-left flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-muted-foreground">For getting started.</p>
                </div>
                <div className="text-5xl font-bold">$0</div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Up to 5 clients</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Basic note taking</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <X className="w-5 h-5" />
                    <span className="line-through">Email reminders</span>
                  </li>
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button variant="secondary" className="w-full h-12 rounded-xl text-lg font-bold">Get Started</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-10 rounded-3xl border-2 border-[#FF4C00] shadow-xl text-left flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#FF4C00] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Popular
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">For active freelancers.</p>
                </div>
                <div className="text-5xl font-bold">$9<span className="text-xl text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 font-bold">
                    <Check className="w-5 h-5 text-[#FF4C00]" />
                    <span>Unlimited clients</span>
                  </li>
                  <li className="flex items-center gap-3 font-bold">
                    <Check className="w-5 h-5 text-[#FF4C00]" />
                    <span>Email reminders</span>
                  </li>
                  <li className="flex items-center gap-3 font-bold">
                    <Check className="w-5 h-5 text-[#FF4C00]" />
                    <span>Notes history</span>
                  </li>
                  <li className="flex items-center gap-3 font-bold">
                    <Check className="w-5 h-5 text-[#FF4C00]" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button className="w-full h-12 rounded-xl text-lg font-bold shadow-brand">Go Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Questions? Answers.</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about Nudge.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I receive payments through Payoneer?",
                a: "Nudge is a CRM, not a payment processor. Track your client relationships here, but handle payments via Payoneer, Wise, or your preferred platform."
              },
              {
                q: "Why is it so simple compared to other CRMs?",
                a: "We believe freelancers don't need enterprise complexity. No pipelines, no lead scoring, no bloat—just the essentials to manage your client relationships."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. Your data is stored with Firebase (Google Cloud) and protected with industry-standard encryption. We never sell or share your information."
              },
              {
                q: "What happens when I hit 5 clients on the Free plan?",
                a: "You'll need to upgrade to Pro to add more clients. Your existing clients and data remain accessible—you just can't add new ones until you upgrade."
              },
              {
                q: "Can I cancel my Pro subscription anytime?",
                a: "Yes, cancel anytime with no questions asked. You'll keep Pro features until the end of your billing period, then automatically down to Free."
              },
              {
                q: "Is there a mobile app?",
                a: "Not yet, but Nudge is fully responsive and works great on mobile browsers. A native app is on our roadmap for late 2025."
              }
            ].map(({ q, a }) => (
              <div key={q} className="bg-[#F9F9F9] p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2">{q}</h3>
                <p className="text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-[#FF4C00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold italic">N</span>
            </div>
            <span className="font-bold tracking-tight">Nudge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built by solo freelancers, for solo freelancers. © 2024 Nudge.
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-[#FF4C00]">Login</Link>
            <Link href="/signup" className="hover:text-[#FF4C00]">Signup</Link>
            <a href="#" className="hover:text-[#FF4C00]">Terms</a>
            <a href="#" className="hover:text-[#FF4C00]">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
