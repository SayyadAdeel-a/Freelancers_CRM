"use client";

import { Note } from "@/lib/firebase/firestore";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
        <Clock className="w-3.5 h-3.5" />
        {formatDate(note.createdAt)}
      </div>
      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
        {note.content}
      </p>
    </div>
  );
}
