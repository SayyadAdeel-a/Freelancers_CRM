"use client";

import { useUser } from "@/hooks/use-user";
import {
  Bell,
  Search,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "./DashboardContext";

export function Navbar() {
  const { user } = useUser();
  const { setIsAddClientModalOpen } = useDashboardContext();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex lg:hidden items-center gap-2 mr-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg italic">N</span>
        </div>
      </div>

      <div className="flex-1 max-w-md relative hidden xs:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          className="pl-10 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-9"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="sm"
          className="hidden sm:flex items-center gap-2 shadow-brand"
          onClick={() => setIsAddClientModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Button>

        <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
        </button>

        <div className="h-8 w-[1px] bg-border mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Free Plan</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.email?.[0].toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
