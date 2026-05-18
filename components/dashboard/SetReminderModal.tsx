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

interface SetReminderModalProps {
  clientId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

import { useUser } from "@/hooks/use-user";
import { scheduleReminderAction } from "@/app/actions/reminders";
import { addReminder } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import posthog from "posthog-js";
import * as Sentry from "@sentry/nextjs";

export function SetReminderModal({ clientId, clientName, isOpen, onClose, onSuccess }: SetReminderModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !message.trim()) return;
    
    setLoading(true);
    try {
      const idToken = await user.getIdToken();

      // 1. Save to Firestore from CLIENT (where auth works!)
      await addReminder(clientId, user.uid, date, message.trim());

      // 2. Schedule the email from SERVER
      const result = await scheduleReminderAction({
        token: idToken,
        clientId,
        clientName,
        remindAt: date.toISOString(),
        message: message.trim()
      });

      if (result.success) {
        posthog.capture("reminder_set", { client_id: clientId });
        toast.success("Reminder scheduled successfully!");
        onSuccess();
        setDate(undefined);
        setMessage("");
        onClose();
      } else {
        toast.error(`Failed to schedule email: ${result.error}`);
      }
    } catch (error: unknown) {
      Sentry.captureException(error);
      console.error("Error adding reminder:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Set Reminder</DialogTitle>
            <DialogDescription>
              We&apos;ll send you an email when it&apos;s time to follow up with this client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label>Follow-up Date & Time</Label>
              <Input
                type="datetime-local"
                required
                onChange={(e) => setDate(new Date(e.target.value))}
                className="bg-secondary/30 h-12"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Reminder Message</Label>
              <Input
                id="message"
                required
                placeholder="Follow up about the contract..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-secondary/30 h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !date || !message.trim()} className="shadow-brand">
              {loading ? "Setting..." : "Set Reminder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
