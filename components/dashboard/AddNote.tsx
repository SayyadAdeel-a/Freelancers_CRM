"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addNote } from "@/lib/firebase/firestore";
import { toast } from "sonner";

interface AddNoteProps {
  clientId: string;
  onSuccess: () => void;
}

export function AddNote({ clientId, onSuccess }: AddNoteProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addNote(clientId, content);
      setContent("");
      onSuccess();
      toast.success("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Write a note about this client..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] bg-white border-border focus-visible:ring-primary/20 resize-none p-4 rounded-xl shadow-sm"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading || !content.trim()} 
          className="shadow-brand"
        >
          {loading ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </form>
  );
}
