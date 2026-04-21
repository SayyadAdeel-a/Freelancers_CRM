"use client";

import { useState, useEffect } from "react";

import { useUser } from "@/hooks/use-user";
import {
  Bell,
  Search,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const { user } = useUser();
  const { setIsAddClientModalOpen, profile } = useDashboardContext();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);


  useEffect(() => {
    // Avoid synchronous setState in effect
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Use profile displayName if available
  const displayName = profile?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <header className="h-16 border-b border-border/40 glass flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 backdrop-blur-md bg-card/70">
      <div className="flex lg:hidden items-center gap-2 mr-4">
        <Logo size="sm" />
        <span className="font-bold text-xl tracking-tight text-gradient">Nudge</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden xs:block group">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200",
            isSearchFocused ? "text-primary" : "text-muted-foreground"
          )}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Search clients…"
          className={cn(
            "w-full pl-10 pr-4 py-2 text-sm rounded-xl border outline-none transition-all duration-300 bg-secondary/30",
            "border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:bg-background",
            "placeholder:text-muted-foreground/60"
          )}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300 transform hover:rotate-12"
          aria-label="Toggle theme"
        >
          {mounted && (theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          ))}
          {!mounted && <div className="w-4 h-4" />}
        </button>

        {/* Add Client */}
        <Button
          size="sm"
          className="hidden sm:flex items-center gap-2 bg-gradient-brand text-white shadow-brand hover:scale-105 transition-transform"
          onClick={() => setIsAddClientModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Button>

        {/* Notifications bell */}
        <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors relative group">
          <Bell className="w-4 h-4 group-hover:animate-bounce" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-brand rounded-full border-2 border-background animate-pulse"></span>
        </button>

        <div className="h-6 w-[1px] bg-border/60 hidden sm:block"></div>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none">{displayName}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 capitalize bg-primary/10 text-primary px-1.5 py-0.5 rounded-full inline-block">{profile?.plan || 'Free'} Plan</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-brand p-[2px] shadow-sm">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-primary font-bold text-sm">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
