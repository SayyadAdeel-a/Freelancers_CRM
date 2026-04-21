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

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: Infinity,
    label: "Unlimited Clients",
    desc: "No more 5-client ceiling. Grow as big as you want.",
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
      <DialogContent className="sm:max-w-[460px] overflow-hidden p-0">
        {/* Header banner */}
        <div className="bg-gradient-to-br from-[#FF4C00] to-[#FF7B3D] p-8 pb-10 text-white text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/4" />

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-1">Go Pro</h2>
            <p className="text-white/80 text-sm font-medium">
              Everything you need to run your freelance business, minus the complexity.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-8 py-6 space-y-0">
          <div className="grid gap-3">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">{feat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing footer */}
        <div className="px-8 pb-2">
          <div className="rounded-2xl bg-[#FF4C00]/5 border border-[#FF4C00]/20 p-5 text-center mb-5">
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-4xl font-black text-[#FF4C00]">$9</span>
              <span className="text-sm text-muted-foreground font-medium">/month</span>
            </div>
            <p className="text-xs text-muted-foreground">Cancel anytime. No questions asked.</p>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col pb-6 px-0">
            <Button
              className="w-full shadow-brand font-bold h-12 rounded-xl text-base bg-[#FF4C00] hover:bg-[#E04400]"
              onClick={() => {
                toast.success("Pro coming soon!");
                onClose();
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Get Pro — $9/month
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-muted-foreground hover:text-foreground text-sm font-medium rounded-xl"
            >
              Maybe later
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Need toast for the CTA
import { toast } from "sonner";
