"use client";

import { Users, Plus, MessageSquare, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  const steps = [
    {
      icon: <Plus className="w-4 h-4 text-primary" />,
      label: "Add your first client",
      desc: "Name, email, and company — done in 5 seconds.",
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-primary" />,
      label: "Log notes after calls",
      desc: "Keep a running history of every conversation.",
    },
    {
      icon: <Bell className="w-4 h-4 text-primary" />,
      label: "Set reminders",
      desc: "Never forget to follow up with a lead.",
    },
  ];

  return (
    <div className="animate-in fade-in zoom-in duration-400">
      {/* Illustration */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-125" />
          {/* Circle */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center">
            <Users className="w-9 h-9 text-primary" />
          </div>
          {/* Floating badge */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Plus className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="text-center mb-10">
        <h3 className="text-2xl font-extrabold tracking-tight">No clients yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Start adding clients to track projects, log notes, and set follow-up reminders — all in one place.
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="bg-card border border-border/60 rounded-2xl p-4 text-center hover:border-primary/30 hover:shadow-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2.5">
              {step.icon}
            </div>
            <p className="text-xs font-bold mb-1">{step.label}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={onAddClick}
          className="shadow-brand h-11 px-8 rounded-xl font-bold text-sm gap-2"
        >
          Add your first client
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-xs text-muted-foreground">Free forever — up to 25 clients on the free plan</p>
      </div>
    </div>
  );
}
