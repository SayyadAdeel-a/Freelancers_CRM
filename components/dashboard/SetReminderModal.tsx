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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addReminder } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/use-user";

interface SetReminderModalProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SetReminderModal({ clientId, isOpen, onClose, onSuccess }: SetReminderModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !message.trim()) return;
    
    setLoading(true);
    try {
      await addReminder(clientId, user.uid, date, message);
      onSuccess();
      setDate(undefined);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error adding reminder:", error);
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
              <Label>Follow-up Date</Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    "w-full flex items-center justify-start text-left font-normal bg-secondary/30 border border-input rounded-md h-12 px-4 cursor-pointer",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <input
                    type="date"
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="w-full p-2 border rounded"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </PopoverContent>
              </Popover>
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
