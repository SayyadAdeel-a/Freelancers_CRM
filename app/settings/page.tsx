"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { useProfile } from "@/hooks/use-profile";
import { logout } from "@/lib/firebase/auth";
import { updateUserProfile, getClients, UserProfile } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
  className,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between py-5 group transition-all", className)}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors border border-border/50">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-1 font-medium">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading: authLoading } = useUser();
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const router = useRouter();
  const [clientCount, setClientCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const clients = await getClients(user.uid);
      setClientCount(clients.length);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  const handleToggleNotifications = async () => {
    if (!user || !profile || saving) return;
    setSaving(true);
    try {
      const newVal = !profile.notifications;
      await updateUserProfile(user.uid, { notifications: newVal });
      refreshProfile();
      toast.success(newVal ? "Reminders enabled" : "Reminders disabled");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

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

  if (authLoading || profileLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-secondary rounded-xl" />
          <div className="h-4 w-72 bg-secondary rounded-lg" />
        </div>
        <div className="h-32 bg-secondary rounded-3xl" />
        <div className="h-64 bg-secondary rounded-3xl" />
      </div>
    );
  }

  const displayName = user?.email?.split("@")[0] || "User";
  const initials = displayName[0]?.toUpperCase() || "U";

  return (
    <div className="space-y-10 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1.5 font-medium">
          Personalize your experience and manage your account.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-inner">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="font-extrabold text-2xl capitalize tracking-tight">{displayName}</h2>
            <p className="text-muted-foreground font-medium truncate mb-3">{user?.email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              <div className={cn(
                "w-2 h-2 rounded-full",
                profile?.plan === "pro" ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
              )} />
              {profile?.plan || "Free"} Plan
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl font-bold text-xs border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            {loggingOut ? "Signing out…" : "Sign Out"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-8">
        {/* Account & Preferences */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="px-6 py-5 border-b border-border/40 bg-secondary/20">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">
              Preferences & Account
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 divide-y divide-border/30">
            <SettingRow
              icon={Mail}
              label="Contact Email"
              description="Primary address for reminders"
            >
              <span className="text-xs font-bold text-muted-foreground">{user?.email}</span>
            </SettingRow>
            
            <SettingRow
              icon={Bell}
              label="Email Reminders"
              description="Automated nudges for follow-ups"
            >
              <button
                onClick={handleToggleNotifications}
                disabled={saving}
                className={cn(
                  "relative w-12 h-6.5 rounded-full transition-all duration-300 shadow-inner",
                  profile?.notifications ? "bg-primary" : "bg-muted",
                  saving && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white shadow-md transition-all duration-300 ease-spring",
                    profile?.notifications ? "translate-x-[22px]" : "translate-x-0"
                  )}
                />
              </button>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Plan & Usage */}
        <Card className={cn(
          "border-border/50 shadow-sm relative overflow-hidden",
          profile?.plan === "pro" ? "border-indigo-500/20" : ""
        )}>
          {profile?.plan === "pro" && (
            <div className="absolute top-0 right-0 p-1">
              <div className="bg-indigo-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-tighter">Pro</div>
            </div>
          )}
          <CardHeader className="px-6 py-5 border-b border-border/40 bg-secondary/20">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70">
              Subscription & Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">
                    {profile?.plan === 'pro' ? 'Pro Unlimited' : 'Free Starter'}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {profile?.plan === 'pro' ? 'Full features unlocked' : 'Standard limitations apply'}
                  </p>
                </div>
              </div>
              {profile?.plan !== 'pro' && (
                <Button 
                  size="sm" 
                  className="shadow-brand h-9 rounded-xl font-bold px-5"
                  onClick={() => router.push("/dashboard?upgrade=true")}
                >
                  Upgrade
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {[
                { 
                  label: "Client Limit", 
                  value: clientCount, 
                  max: profile?.plan === 'pro' ? Infinity : 25,
                  percentage: Math.min((clientCount / (profile?.plan === 'pro' ? clientCount : 25)) * 100, 100)
                },
                { 
                  label: "Follow-up Priority", 
                  status: profile?.plan === 'pro' ? 'Premium' : 'Standard',
                  note: profile?.plan === 'pro' ? 'Instant delivery' : 'Standard queue'
                },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground/80">{item.label}</span>
                    <span className="text-foreground">
                      {item.max ? `${item.value} / ${item.max === Infinity ? '∞' : item.max}` : item.status}
                    </span>
                  </div>
                  {item.max && (
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000 ease-out rounded-full",
                          item.percentage > 90 ? "bg-destructive" : "bg-primary"
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  )}
                  {item.note && <p className="text-[10px] text-muted-foreground/60 font-medium italic">{item.note}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
