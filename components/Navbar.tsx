"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/Button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold font-sans tracking-tight text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-primary inline-block"></span>
            Nudge
          </span>
          <div className="hidden md:flex items-center gap-8 ml-8">
            <a href="#dashboard" className="text-muted-foreground text-sm font-mono hover:text-foreground transition-colors uppercase tracking-widest">
              Dashboard
            </a>
            <a href="#settings" className="text-muted-foreground text-sm font-mono hover:text-foreground transition-colors uppercase tracking-widest">
              Settings
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}
          <Button variant="ghost" className="font-mono uppercase tracking-wider text-sm">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}