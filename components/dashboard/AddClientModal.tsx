"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClient } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import posthog from "posthog-js";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    payerRating: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await addClient(user.uid, {
        ...formData,
        payerRating: (formData.payerRating || null) as any
      });
      posthog.capture("client_added", { has_company: !!formData.company, payer_rating: formData.payerRating });
      onSuccess();
      setFormData({ name: "", email: "", company: "", payerRating: "" });
      onClose();
      toast.success("Client added successfully!");
    } catch (error) {
      posthog.captureException(error);
      console.error("Error adding client:", error);
      toast.error("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background border border-border overflow-hidden p-0 animate-in zoom-in-95 duration-200 rounded-sm">
        <form onSubmit={handleSubmit}>
          <div className="bg-primary h-1 w-full" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold tracking-tight text-foreground font-sans">Add New Client</DialogTitle>
              <DialogDescription className="mt-2 text-muted-foreground font-mono uppercase tracking-wider text-xs">
                Enter the details of your new client. You can add notes and reminders later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-8">
              <div className="grid gap-2.5">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Full Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="company" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Company</Label>
                <Input
                  id="company"
                  required
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="payerRating" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Payer Rating</Label>
                <select
                  id="payerRating"
                  value={formData.payerRating}
                  onChange={(e) => setFormData({ ...formData, payerRating: e.target.value })}
                  className="flex h-11 w-full rounded-sm border border-border/40 bg-secondary/40 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">— Not set —</option>
                  <option value="fast">⚡ Fast Payer — within a week</option>
                  <option value="average">✅ Average Payer — 2-3 weeks</option>
                  <option value="slow">🐢 Slow Payer — takes a month+</option>
                  <option value="difficult">⚠️ Difficult — disputes/delays</option>
                </select>
              </div>
            </div>
            <DialogFooter className="gap-3 sm:gap-0 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="rounded-sm font-mono tracking-wider h-11 px-6 uppercase text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground rounded-sm font-mono tracking-wider uppercase text-xs h-11 px-8 hover:bg-primary/90 active:scale-95 transition-all">
                {loading ? "Adding..." : "Add Client"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
