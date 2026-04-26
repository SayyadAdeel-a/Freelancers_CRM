"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { Check, Zap, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProCheckout } from "@/app/actions/payments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user || !user.email) {
      toast.error("You must be logged in to upgrade.");
      return;
    }

    setLoading(true);
    try {
      const response = await createProCheckout(user.uid, user.email);
      
      if (response.error) {
        toast.error(`Checkout Failed: ${response.error}`);
        return;
      }

      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-black text-white border-white/10 rounded-none p-0 overflow-hidden">
        <div className="relative p-8 space-y-8">
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold font-mono uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-current" />
              Limited Offer
            </div>
            <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              Level Up to Pro
            </DialogTitle>
            <DialogDescription className="text-white/60 font-mono text-xs uppercase tracking-wider">
              Remove all limits and scale your business.
            </DialogDescription>
          </div>

          <div className="space-y-4">
            {[
              "Unlimited clients (no more 5-client limit)",
              "Stunning industrial invoice templates",
              "Priority email follow-up reminders",
              "Advanced analytics and tracking",
              "Zero platform fees",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-5 h-5 rounded-none border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-red-600/50 transition-colors">
                  <Check className="w-3 h-3 text-red-500" />
                </div>
                <span className="text-xs font-mono text-white/80">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter text-white italic">$9</span>
              <span className="text-white/40 font-mono text-sm uppercase tracking-widest">/ Month</span>
            </div>

            <Button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full h-14 bg-white text-black hover:bg-red-600 hover:text-white rounded-none font-black italic uppercase tracking-tighter text-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Upgrade Now <Sparkles className="ml-2 w-5 h-5 group-hover:animate-bounce" />
                </>
              )}
            </Button>
            
            <p className="text-[10px] text-center text-white/30 font-mono uppercase tracking-[0.2em]">
              Secure checkout via Lemon Squeezy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
