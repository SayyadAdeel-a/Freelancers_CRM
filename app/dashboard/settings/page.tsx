"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { logout } from "@/lib/firebase/auth";
import { updateUserProfile, getClients } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FREE_PLAN_CLIENT_LIMIT } from "@/lib/constants";
import {
  User,
  Bell,
  CreditCard,
  LogOut,
  Building2,
  Save,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export default function SettingsPage() {
  const { user, loading: authLoading } = useUser();
  const { profile, profileLoading, refreshProfile } = useDashboardContext();
  const router = useRouter();
  const [clientCount, setClientCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setCompanyName(profile.companyName || "");
    }
  }, [profile]);

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
    if (!user || !profile || savingPreferences) return;
    setSavingPreferences(true);
    try {
      const newVal = !profile.notifications;
      await updateUserProfile(user.uid, { notifications: newVal });
      await refreshProfile();
      toast.success(newVal ? "Reminders enabled" : "Reminders disabled");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || updatingProfile) return;
    
    setUpdatingProfile(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        companyName
      });
      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
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
        <div className="h-64 bg-secondary rounded-3xl" />
        <div className="h-48 bg-secondary rounded-3xl" />
      </div>
    );
  }

  const initials = (displayName || user?.email?.split("@")[0] || "U")[0].toUpperCase();
  const plan = profile?.plan || "free";
  const isPro = plan === "pro";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Personalize your experience and manage your workspace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Preferences */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="p-6 sm:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                    {initials}
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h2 className="font-black text-3xl tracking-tight">
                    {displayName || user?.email?.split("@")[0]}
                  </h2>
                  <p className="text-muted-foreground font-semibold flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {user?.email}
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="displayName">
                      Display Name
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="companyName">
                      Company / Studio
                    </Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">Notification System</p>
                      <p className="text-xs text-muted-foreground">Smart email nudges for client follow-ups</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleNotifications}
                    disabled={savingPreferences}
                    className={cn(
                      "relative w-14 h-7 rounded-full transition-all duration-500 shadow-inner",
                      profile?.notifications ? "bg-primary shadow-[0_0_15px_rgba(244,81,30,0.4)]" : "bg-muted",
                      savingPreferences && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500 flex items-center justify-center",
                        profile?.notifications ? "translate-x-7 rotate-0" : "translate-x-0 -rotate-90"
                      )}
                    >
                      <Zap className={cn("w-2.5 h-2.5", profile?.notifications ? "text-primary fill-primary" : "text-muted-foreground")} />
                    </div>
                  </button>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={updatingProfile}
                    className="shadow-brand"
                  >
                    {updatingProfile ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Right Column: Billing & Plan */}
        <div className="space-y-6">
          <Card className={cn(
            isPro && "border-primary/50"
          )}>
            {isPro && (
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" /> PRO
                </div>
              </div>
            )}
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  Subscription Plan
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isPro ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    )}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold">
                        {isPro ? 'Pro Plan' : 'Free Plan'}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Current Membership
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Clients</span>
                      <span className="font-semibold">
                        {clientCount} <span className="text-muted-foreground mx-0.5">/</span> {isPro ? '∞' : FREE_PLAN_CLIENT_LIMIT}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden p-0.5 border border-border/10">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000 ease-out rounded-full",
                          (clientCount / FREE_PLAN_CLIENT_LIMIT) > 0.9 && !isPro ? "bg-destructive animate-pulse" : isPro ? "bg-indigo-500" : "bg-primary"
                        )}
                        style={{ width: `${isPro ? (clientCount > 0 ? 100 : 0) : Math.min((clientCount / FREE_PLAN_CLIENT_LIMIT) * 100, 100)}%` }}
                      />
                    </div>
                    {!isPro && (
                      <p className="text-xs text-muted-foreground">
                        {clientCount >= FREE_PLAN_CLIENT_LIMIT 
                          ? "Limit reached. Upgrade to add more clients."
                          : `${FREE_PLAN_CLIENT_LIMIT - clientCount} slots remaining in your free plan.`}
                      </p>
                    )}
                  </div>

                  {!isPro && (
                    <Button 
                      type="button"
                      className="w-full shadow-brand"
                      onClick={() => router.push("/dashboard?upgrade=true")}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone / Logout */}
          <Card className="border-destructive/20 bg-destructive/5">
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </h4>
                <p className="text-xs text-muted-foreground">Sign out of your account on this device.</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
