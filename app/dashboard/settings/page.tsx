"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { logout } from "@/lib/firebase/auth";
import { updateUserProfile, getClients } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      // Defer state updates to avoid synchronous setState in effect
      const initForm = () => {
        setDisplayName(profile.displayName || "");
        setCompanyName(profile.companyName || "");
      };
      void Promise.resolve().then(initForm);
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
      // Defer execution to avoid synchronous setState in effect body
      void Promise.resolve().then(() => fetchStats());
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
    } catch {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Logo size="lg" className="rounded-2xl" />
            <h1 className="text-4xl font-black tracking-tighter">Settings</h1>
          </div>
          <p className="text-muted-foreground font-medium">
            Personalize your workspace and manage your solo operation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Preferences */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-border/40 shadow-sm">
            <div className="p-6 sm:p-10 space-y-10">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[2rem] bg-primary/5 border-2 border-primary/10 flex items-center justify-center text-4xl font-black text-primary shadow-inner">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h2 className="font-black text-3xl tracking-tight leading-tight">
                    {displayName || user?.email?.split("@")[0]}
                  </h2>
                  <p className="text-muted-foreground font-bold flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    {user?.email}
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Public Display Name
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-11 h-12 bg-secondary/30 border-border/50 focus:border-primary/50 transition-all rounded-xl font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Company / Brand Name
                    </Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company name"
                        className="pl-11 h-12 bg-secondary/30 border-border/50 focus:border-primary/50 transition-all rounded-xl font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-1 rounded-2xl bg-secondary/20 border border-border/50">
                  <div className="flex items-center justify-between p-5 rounded-xl bg-background shadow-sm border border-border/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Bell className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-black text-sm uppercase tracking-tight">Email Nudges</p>
                        <p className="text-xs text-muted-foreground font-medium">Smart follow-up reminders via email</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleNotifications}
                      disabled={savingPreferences}
                      className={cn(
                        "relative w-16 h-8 rounded-full transition-all duration-500",
                        profile?.notifications ? "bg-primary" : "bg-muted",
                        savingPreferences && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-500 flex items-center justify-center",
                          profile?.notifications ? "translate-x-8" : "translate-x-0"
                        )}
                      >
                        <Zap className={cn("w-3 h-3", profile?.notifications ? "text-primary fill-primary" : "text-muted-foreground")} />
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={updatingProfile}
                    className="h-12 px-8 rounded-xl font-bold shadow-brand text-base"
                  >
                    {updatingProfile ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    Save Profile
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Right Column: Billing & Plan */}
        <div className="space-y-8">
          <Card className={cn(
            "overflow-hidden border-border/40 shadow-sm",
            isPro && "border-primary/30 ring-1 ring-primary/10"
          )}>
            <div className="p-6 sm:p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Your Subscription
                </h3>

                <div className="space-y-8">
                  <div className="flex items-center gap-5 p-5 rounded-2xl bg-secondary/30 border border-border/40">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center border",
                      isPro ? "bg-primary text-primary-foreground border-primary" : "bg-primary/5 text-primary border-primary/10"
                    )}>
                      <Zap className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-black text-xl tracking-tight">
                        {isPro ? 'Pro Member' : 'Free Tier'}
                      </h4>
                      <p className="text-xs text-muted-foreground font-bold">
                        {isPro ? 'Unlimited Access' : 'Core Features'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-5 rounded-2xl bg-background border border-border/40 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Client Capacity</span>
                      <span className="font-black text-sm">
                        {clientCount} <span className="text-muted-foreground/50 mx-0.5">/</span> {isPro ? '∞' : FREE_PLAN_CLIENT_LIMIT}
                      </span>
                    </div>
                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden p-1 border border-border/10">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000 ease-out rounded-full",
                          (clientCount / FREE_PLAN_CLIENT_LIMIT) > 0.9 && !isPro ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]" : isPro ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "bg-primary shadow-[0_0_8px_rgba(244,81,30,0.4)]"
                        )}
                        style={{ width: `${isPro ? (clientCount > 0 ? 100 : 0) : Math.min((clientCount / FREE_PLAN_CLIENT_LIMIT) * 100, 100)}%` }}
                      />
                    </div>
                    {!isPro && (
                      <p className="text-[10px] text-muted-foreground font-bold text-center uppercase tracking-wider">
                        {clientCount >= FREE_PLAN_CLIENT_LIMIT 
                          ? "Capacity Reached"
                          : `${FREE_PLAN_CLIENT_LIMIT - clientCount} spots remaining`}
                      </p>
                    )}
                  </div>

                  {!isPro && (
                    <Button 
                      type="button"
                      className="w-full h-14 rounded-2xl font-black shadow-brand text-lg group"
                      onClick={() => router.push("/dashboard?upgrade=true")}
                    >
                      <Zap className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone / Logout */}
          <div className="p-1 rounded-2xl bg-destructive/5 border border-destructive/10">
            <div className="p-6 space-y-4 bg-background rounded-xl border border-destructive/20 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Account Session
                </h4>
                <p className="text-xs text-muted-foreground font-medium">Securely sign out of your dashboard.</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full h-11 rounded-xl font-bold"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
