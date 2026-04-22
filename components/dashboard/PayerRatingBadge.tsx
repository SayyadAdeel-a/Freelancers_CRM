"use client";

import { useMemo } from "react";

export type PayerRating = "fast" | "average" | "slow" | "difficult" | null | undefined;

const RATING_CONFIG = {
  fast: {
    label: "⚡ Fast Payer",
    classes: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800/50",
  },
  average: {
    label: "✅ Average Payer",
    classes: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50",
  },
  slow: {
    label: "🐢 Slow Payer",
    classes: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800/50",
  },
  difficult: {
    label: "⚠️ Difficult",
    classes: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/50",
  },
};

interface PayerRatingBadgeProps {
  rating: PayerRating;
  size?: "sm" | "md";
  className?: string;
}

export function PayerRatingBadge({ rating, size = "sm", className = "" }: PayerRatingBadgeProps) {
  const config = useMemo(() => (rating ? RATING_CONFIG[rating as keyof typeof RATING_CONFIG] : null), [rating]);

  if (!config) return null;

  const sizeClass = size === "md" ? "px-2.5 py-0.5 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <span className={`inline-flex items-center border rounded-sm font-mono font-bold uppercase tracking-wider ${sizeClass} ${config.classes} ${className}`}>
      {config.label}
    </span>
  );
}
