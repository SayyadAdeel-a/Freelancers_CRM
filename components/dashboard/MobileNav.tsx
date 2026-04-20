"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: LayoutGrid, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Clients", href: "/dashboard/clients" },
  { icon: FileText, label: "Notes", href: "/dashboard/notes" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-4 z-50 pb-safe">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive && "animate-in zoom-in duration-300")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
