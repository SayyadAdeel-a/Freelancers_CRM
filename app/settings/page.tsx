"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { logout } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      {children && <div className="ml-4">{children}</div>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border/60 bg-secondary/20">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
      </div>
      <div className="px-5 divide-y divide-border/50">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch {
      toast.error("Failed to log out");
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-secondary rounded-lg" />
          <div className="h-4 w-64 bg-secondary rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-secondary rounded-2xl" />
        ))}
      </div>
    );
  }

  const displayName = user?.email?.split("@")[0] || "User";
  const initials = displayName[0]?.toUpperCase() || "U";

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in duration-500">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg capitalize">{displayName}</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <div className="inline-flex items-center gap-1.5 mt-2 bg-secondary px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Free Plan
          </div>
        </div>
      </div>

      {/* Account section */}
      <SectionCard title="Account">
        <SettingRow
          icon={User}
          label="Display Name"
          description={displayName}
        >
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground" disabled>
            Edit
          </Button>
        </SettingRow>
        <SettingRow
          icon={Mail}
          label="Email Address"
          description={user?.email || "Not set"}
        >
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground" disabled>
            Edit
          </Button>
        </SettingRow>
        <SettingRow
          icon={Shield}
          label="Password"
          description="Last changed: never"
        >
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground" disabled>
            Change
          </Button>
        </SettingRow>
      </SectionCard>

      {/* Preferences */}
      <SectionCard title="Preferences">
        <SettingRow
          icon={Bell}
          label="Email Reminders"
          description="Get notified when a follow-up is due"
        >
          <button
            onClick={() => setNotifications(!notifications)}
            className={cn(
              "relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0",
              notifications ? "bg-primary" : "bg-secondary"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200",
                notifications ? "translate-x-[18px]" : "translate-x-0"
              )}
            />
          </button>
        </SettingRow>
      </SectionCard>

      {/* Plan section */}
      <SectionCard title="Plan">
        <SettingRow
          icon={CreditCard}
          label="Free Plan"
          description="Up to 5 clients, basic features"
        >
          <Button size="sm" className="shadow-brand text-xs">
            Upgrade to Pro
          </Button>
        </SettingRow>
        <div className="py-4 space-y-2.5">
          {[
            { label: "Clients", used: "0/5", note: "Free plan limit" },
            { label: "Email reminders", used: "Unavailable", note: "Pro feature" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.used}</span>
                <span className="text-xs text-muted-foreground">({item.note})</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Session */}
      <SectionCard title="Session">
        <SettingRow
          icon={LogOut}
          label="Sign Out"
          description="End your current session"
        >
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs"
          >
            {loggingOut ? "Signing out…" : "Sign Out"}
          </Button>
        </SettingRow>
      </SectionCard>
    </div>
  );
}
