"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { Bell, Search, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const { user } = useUser();
  const { setIsAddClientModalOpen, setIsPricingModalOpen, profile } = useDashboardContext();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const displayName = profile?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 bg-background">
      <div className="flex lg:hidden items-center gap-2 mr-4">
        <span className="w-3 h-3 rounded-sm bg-primary inline-block"></span>
        <span className="font-bold text-xl tracking-tight text-foreground font-sans">Nudge</span>
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
            "w-full pl-10 pr-4 py-2 text-sm rounded-sm border outline-none transition-all duration-300 bg-secondary/30",
            "border-transparent focus:border-foreground focus:ring-1 focus:ring-foreground focus:bg-background",
            "placeholder:text-muted-foreground/60"
          )}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-mono uppercase"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Upgrade Button */}
        {profile?.plan === 'free' && (
          <Button
            size="sm"
            variant="outline"
            className="hidden xs:flex items-center gap-2 border-red-600/30 text-red-600 hover:bg-red-600/10 hover:text-red-500 transition-all font-mono uppercase text-[10px] tracking-widest h-8 px-3 rounded-none bg-red-600/5 group"
            onClick={() => setIsPricingModalOpen(true)}
          >
            <Sparkles className="w-3 h-3 group-hover:animate-pulse" />
            Upgrade
          </Button>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Add Client */}
        <Button
          size="sm"
          className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-mono uppercase text-xs tracking-wider border border-border rounded-sm shadow-sm"
          onClick={() => setIsAddClientModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Button>

        {/* Notifications bell */}
        <button className="p-2 text-muted-foreground hover:bg-accent rounded-sm transition-colors relative group border border-transparent hover:border-border">
          <Bell className="w-4 h-4 group-hover:text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-sm animate-pulse"></span>
        </button>

        <div className="h-6 w-[1px] bg-border hidden sm:block"></div>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none font-sans">{displayName}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-mono">{profile?.plan || 'Free'} Plan</p>
          </div>
          <div className="w-9 h-9 rounded-sm bg-border p-[1px] shadow-sm">
            <div className="w-full h-full rounded-sm bg-background flex items-center justify-center text-foreground font-bold font-mono text-sm border border-border">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
