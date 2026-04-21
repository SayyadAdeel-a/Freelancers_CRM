"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Zap, Star, Infinity, Mail } from "lucide-react";
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
      <DialogContent className="sm:max-w-[460px] overflow-hidden p-0 border-none glass shadow-2xl">
        {/* Header banner */}
        <div className="bg-gradient-brand p-8 pb-10 text-white text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4 blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-amber-400/20 translate-y-1/2 -translate-x-1/4 blur-xl" />
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white/40 animate-ping" />

          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-5 shadow-xl backdrop-blur-md transform hover:rotate-6 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Go Pro</h2>
            <p className="text-white/90 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">
              Unlock the full power of Nudge and take your freelance business to the next level.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-8 py-8 space-y-4">
          <div className="grid gap-4">
            {features.map((feat, i) => (
              <div
                key={feat.label}
                className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-all duration-300 border border-border/20 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-brand/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black">{feat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing footer */}
        <div className="px-8 pb-4">
          <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6 text-center mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
              <span className="text-sm font-bold text-muted-foreground">$</span>
              <span className="text-5xl font-black text-primary tracking-tighter">9</span>
              <span className="text-sm text-muted-foreground font-bold">/month</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Cancel anytime • No commitments</p>
          </div>

          <DialogFooter className="flex-col gap-3 sm:flex-col pb-8 px-0">
            <Button
              className="w-full bg-gradient-brand text-white shadow-brand font-black h-14 rounded-2xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                posthog.capture("upgrade_cta_clicked", { plan: "pro", price_monthly: 9 });
                toast.success("Pro coming soon!");
                onClose();
              }}
            >
              <Zap className="w-5 h-5 mr-2 fill-current" />
              Get Pro Now
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-muted-foreground hover:text-foreground text-sm font-bold rounded-xl"
            >
              Maybe later
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

