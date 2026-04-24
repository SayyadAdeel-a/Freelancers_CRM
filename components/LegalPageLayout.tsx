import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface LegalSection {
  title: string;
  content: (string | string[])[];
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPageLayout({ title, lastUpdated, intro, sections }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top accent rule */}
      <div className="fixed top-0 left-0 right-0 h-px bg-primary z-50" />

      {/* Nav bar */}
      <nav className="border-b border-border bg-background/95 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
            <span className="font-bold text-lg tracking-tight">Nudge</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-16">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-10">
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary">Legal</p>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter">{title}</h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            Last updated: {lastUpdated}
          </p>
          <p className="text-muted-foreground leading-relaxed font-mono text-sm border-l-2 border-primary pl-4 mt-6">
            {intro}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
                <span className="text-[10px] font-mono text-primary border border-primary/30 rounded-sm px-2 py-1 bg-primary/5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed font-mono pl-4 border-l border-border">
                {section.content.map((block, j) => {
                  if (Array.isArray(block)) {
                    return (
                      <ul key={j} className="space-y-2">
                        {block.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="w-1 h-1 rounded-sm bg-primary mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={j}>{block}</p>;
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground">
              Questions about this policy?
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Contact us at{" "}
              <a href="mailto:hello@nudgecrm.app" className="text-primary hover:underline">
                hello@nudgecrm.app
              </a>
            </p>
          </div>
          <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link href="/refund" className="text-muted-foreground hover:text-primary transition-colors">Refunds</Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
