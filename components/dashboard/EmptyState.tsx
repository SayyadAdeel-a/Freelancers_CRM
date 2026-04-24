"use client";

import { Users, Plus, MessageSquare, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  const steps = [
    {
      icon: <Plus className="w-4 h-4 text-foreground" />,
      label: "Add your first client",
      desc: "Name, email, and company — done in 5 seconds.",
      color: "bg-accent",
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-foreground" />,
      label: "Log notes after calls",
      desc: "Keep a running history of every conversation.",
      color: "bg-accent",
    },
    {
      icon: <Bell className="w-4 h-4 text-primary" />,
      label: "Set reminders",
      desc: "Never forget to follow up with a lead.",
      color: "bg-primary/10",
    },
  ];

  return (
    <div className="animate-in fade-in zoom-in duration-400">
      {/* Illustration */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Background glow removed for Nothing aesthetic */}
          {/* Circle */}
          <div className="relative w-24 h-24 rounded-sm bg-foreground border border-border flex items-center justify-center animate-bounce-slow">
            <Users className="w-10 h-10 text-background" />
          </div>
          {/* Floating badge */}
          <div className="absolute -top-2 -right-2 w-9 h-9 rounded-sm bg-primary border border-primary flex items-center justify-center shadow-brand">
            <Plus className="w-5 h-5 text-primary-foreground font-bold" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold tracking-tight text-foreground font-sans uppercase">No clients yet</h3>
        <p className="text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed text-sm font-mono">
          Start adding clients to track projects, log notes, and set follow-up reminders — all in one place.
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-5 mb-12 max-w-2xl mx-auto">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="group bg-card border border-border rounded-sm p-5 text-center hover:border-foreground transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
          >
            <div className={cn("w-10 h-10 rounded-sm flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform", step.color)}>
              {step.icon}
            </div>
            <p className="text-sm font-bold mb-1.5 font-sans tracking-tight">{step.label}</p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed font-mono">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onAddClick}
          className="bg-primary text-primary-foreground h-12 px-10 rounded-sm font-mono tracking-widest text-xs uppercase gap-2 hover:bg-primary/90 transition-transform shadow-brand"
        >
          Add your first client
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground bg-accent border border-border px-3 py-1 rounded-sm font-mono uppercase">Free forever — up to 5 clients on the free plan</p>
      </div>
    </div>
  );
}
