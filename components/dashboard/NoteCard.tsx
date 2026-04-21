"use client";

import { Note } from "@/lib/firebase/firestore";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-sm hover:border-foreground transition-all animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold font-mono">
        <Clock className="w-3 h-3" />
        {formatDate(note.createdAt)}
      </div>
      <p className="text-foreground whitespace-pre-wrap leading-relaxed font-sans text-sm">
        {note.content}
      </p>
    </div>
  );
}
