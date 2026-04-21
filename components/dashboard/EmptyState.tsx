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
      icon: <Plus className="w-4 h-4 text-orange-500" />,
      label: "Add your first client",
      desc: "Name, email, and company — done in 5 seconds.",
      color: "bg-orange-500/10",
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-pink-500" />,
      label: "Log notes after calls",
      desc: "Keep a running history of every conversation.",
      color: "bg-pink-500/10",
    },
    {
      icon: <Bell className="w-4 h-4 text-indigo-500" />,
      label: "Set reminders",
      desc: "Never forget to follow up with a lead.",
      color: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="animate-in fade-in zoom-in duration-400">
      {/* Illustration */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150 animate-pulse" />
          {/* Circle */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-brand border-4 border-background/50 flex items-center justify-center shadow-brand animate-bounce-slow">
            <Users className="w-10 h-10 text-white" />
          </div>
          {/* Floating badge */}
          <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg transform rotate-12">
            <Plus className="w-5 h-5 text-primary font-bold" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black tracking-tight text-gradient">No clients yet</h3>
        <p className="text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed text-sm">
          Start adding clients to track projects, log notes, and set follow-up reminders — all in one place.
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-5 mb-12 max-w-2xl mx-auto">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="group glass border border-border/40 rounded-2xl p-5 text-center hover:border-primary/50 hover:shadow-brand transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform", step.color)}>
              {step.icon}
            </div>
            <p className="text-sm font-black mb-1.5">{step.label}</p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onAddClick}
          className="bg-gradient-brand text-white shadow-brand h-12 px-10 rounded-xl font-black text-base gap-2 hover:scale-105 transition-transform"
        >
          Add your first client
          <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="text-xs font-medium text-muted-foreground/60 bg-secondary/50 px-3 py-1 rounded-full">Free forever — up to 25 clients on the free plan</p>
      </div>
    </div>
  );
}
