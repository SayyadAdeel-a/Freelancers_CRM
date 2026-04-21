"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use profile displayName if available
  const displayName = profile?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex lg:hidden items-center gap-2 mr-4">
        <Logo size="sm" />
        <span className="font-bold text-xl tracking-tight">Nudge</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden xs:block">
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
            "w-full pl-10 pr-4 py-2 text-sm rounded-xl border outline-none transition-all duration-200 bg-secondary/50",
            "border-transparent focus:border-primary/30 focus:ring-2 focus:ring-primary/10",
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
          className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
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
          className="hidden sm:flex items-center gap-2 shadow-brand"
          onClick={() => setIsAddClientModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Button>

        {/* Notifications bell */}
        <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
        </button>

        <div className="h-6 w-[1px] bg-border hidden sm:block"></div>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold leading-none">{displayName}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{profile?.plan || 'Free'} Plan</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.email?.[0].toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
