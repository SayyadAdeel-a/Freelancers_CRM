"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-base">
            You&apos;ve reached the limit of 25 clients on the free plan. Upgrade to Pro for unlimited clients and more.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Unlimited Clients</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Automated Email Reminders</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Custom Branding</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button className="w-full shadow-brand text-lg py-6">
            Get Pro for $9/mo
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
