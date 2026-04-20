"use client";

import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-secondary/20 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground">No clients yet</h3>
      <p className="text-muted-foreground mt-2 max-w-sm">
        Start by adding your first client to track notes and set reminders.
      </p>
      <Button 
        onClick={onAddClick}
        className="mt-6 shadow-brand"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Client
      </Button>
    </div>
  );
}
