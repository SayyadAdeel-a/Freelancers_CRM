"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  /** Use 'light' variant on dark backgrounds (e.g. left panel of auth pages) */
  variant?: "default" | "inverted";
  className?: string;
}

export function ThemeToggle({ variant = "default", className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a same-sized placeholder so layout doesn't shift
    return (
      <div
        className={`w-9 h-9 rounded-sm border border-border ${className}`}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        "w-9 h-9 rounded-sm border flex items-center justify-center",
        "transition-all duration-150 ease-out",
        "hover:scale-105 active:scale-95",
        variant === "inverted"
          ? "border-white/20 text-white/60 hover:text-white hover:bg-white/10"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-accent",
        className,
      ].join(" ")}
    >
      {isDark ? (
        <Sun className="w-4 h-4" strokeWidth={2} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={2} />
      )}
    </button>
  );
}
