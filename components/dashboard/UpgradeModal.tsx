"use client";

import {
  Dialog,
  DialogContent,

  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Star, Infinity, Mail } from "lucide-react";
import { toast } from "sonner";
import posthog from "posthog-js";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: Infinity,
    label: "Unlimited Clients",
    desc: "No more 25-client ceiling. Grow as big as you want.",
  },
  {
    icon: Mail,
    label: "Automated Email Reminders",
    desc: "Set it and forget it — we email you when it's time to follow up.",
  },
  {
    icon: Star,
    label: "Priority Support",
    desc: "Get help within 24 hours from a real human.",
  },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] overflow-hidden p-0 border border-border bg-background rounded-sm animate-in zoom-in-95 duration-200">
        {/* Header banner */}
        <div className="bg-primary p-10 text-primary-foreground text-left relative overflow-hidden">
          {/* Industrial patterns */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-grid-pattern pointer-events-none" />
          
          <div className="relative">
            <div className="w-12 h-12 rounded-sm bg-background flex items-center justify-center mb-6 border border-primary-foreground/20">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-2 font-sans uppercase">Pro Access</h2>
            <p className="text-primary-foreground/80 text-xs font-mono uppercase tracking-widest leading-relaxed">
              Scale your business beyond the basic limits.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-8 py-8 space-y-4 font-mono">
          <div className="grid gap-3">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="flex items-start gap-4 p-4 rounded-sm bg-secondary/20 hover:bg-secondary/40 transition-all border border-border/50 group"
              >
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <feat.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider">{feat.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight uppercase tracking-tight">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing footer */}
        <div className="px-8 pb-8">
          <div className="rounded-sm bg-secondary/10 border border-border p-6 text-center mb-6">
            <div className="flex items-baseline justify-center gap-1.5 mb-1">
              <span className="text-sm font-bold text-muted-foreground font-mono">$</span>
              <span className="text-5xl font-black text-foreground tracking-tighter font-sans">9</span>
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">/mo</span>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Billed monthly • Cancel anytime</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-primary text-primary-foreground font-black h-12 rounded-sm text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-brand font-mono"
              onClick={() => {
                posthog.capture("upgrade_cta_clicked", { plan: "pro", price_monthly: 9 });
                toast.success("Pro coming soon!");
                onClose();
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Activate Subscription
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm h-10 font-mono"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

