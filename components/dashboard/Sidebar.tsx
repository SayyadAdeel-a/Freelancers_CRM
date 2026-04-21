"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/ui/Logo";

const menuItems = [
  { icon: LayoutGrid, label: "Overview", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/dashboard/clients" },
  { icon: FileText, label: "Notes", href: "/dashboard/notes" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside 
      className={cn(
        "relative h-screen bg-sidebar border-r border-border hidden lg:flex flex-col transition-all duration-300 ease-in-out z-20 font-sans",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-sm bg-primary inline-block"></span>
            <span className="font-bold text-xl tracking-tight text-foreground">Nudge</span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto">
            <span className="w-3 h-3 rounded-sm bg-primary inline-block"></span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all group relative border",
                isActive 
                  ? "bg-accent text-foreground border-border" 
                  : "text-muted-foreground border-transparent hover:bg-accent/50 hover:text-foreground hover:border-border/50"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-foreground" : "group-hover:text-primary")} />
              {!isCollapsed && <span className="font-medium tracking-wide uppercase text-xs">{item.label}</span>}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all border border-transparent hover:border-destructive uppercase tracking-wide text-xs",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium">Log Out</span>}
        </Button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-background border border-border rounded-sm flex items-center justify-center hover:bg-accent hover:text-primary transition-colors z-30"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
