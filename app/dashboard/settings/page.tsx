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
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Hero Header */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-border/40 p-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <Logo size="xl" className="scale-150 rotate-12" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <User className="w-3 h-3" />
            Account Overview
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-md">
            Personalize your Nudge CRM experience and manage your workspace configuration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Preferences */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/40 overflow-hidden shadow-xl bg-card/30 backdrop-blur-md rounded-[2rem]">
            <div className="p-8 sm:p-10 space-y-10">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center text-4xl font-black text-primary shadow-2xl transition-all group-hover:scale-105 duration-500">
                    {initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-background border border-border shadow-xl flex items-center justify-center text-primary">
                    <ShieldCheck className="w-4 h-4" />
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
                    <Label htmlFor="displayName" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">
                      Display Name
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                        className="h-14 pl-12 rounded-2xl bg-secondary/30 border-border/40 focus:ring-primary/20 focus:bg-background transition-all font-semibold text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">
                      Company / Studio
                    </Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company name"
                        className="h-14 pl-12 rounded-2xl bg-secondary/30 border-border/40 focus:ring-primary/20 focus:bg-background transition-all font-semibold text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-3xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                      <Bell className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-black uppercase tracking-tight">Notification System</p>
                      <p className="text-xs text-muted-foreground font-medium">Smart email nudges for client follow-ups</p>
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
                    className="h-14 rounded-2xl px-10 font-black shadow-brand bg-primary hover:bg-primary/90 text-base"
                  >
                    {updatingProfile ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    Synchronize Profile
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Right Column: Billing & Plan */}
        <div className="space-y-8">
          <Card className={cn(
            "border-border/40 shadow-2xl relative overflow-hidden bg-card/40 backdrop-blur-xl rounded-[2rem]",
            isPro ? "border-indigo-500/30" : "border-primary/10"
          )}>
            {isPro && (
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-tighter flex items-center gap-1.5 shadow-lg shadow-indigo-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" /> PRO ACTIVE
                </div>
              </div>
            )}
            
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  Your Ecosystem
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-5 p-4 rounded-3xl bg-secondary/40 border border-border/20 backdrop-blur-sm">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden",
                      isPro ? "bg-indigo-600 shadow-indigo-500/20" : "bg-primary shadow-primary/20"
                    )}>
                      <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Zap className="w-8 h-8 text-white relative z-10" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-black text-lg leading-tight">
                        {isPro ? 'Pro Elite' : 'Free Tier'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                        Current Membership
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6 rounded-3xl bg-background/50 border border-border/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Network Load</span>
                      <span className="text-sm font-black">
                        {clientCount} <span className="text-muted-foreground/60 mx-1">/</span> {isPro ? '∞' : FREE_PLAN_CLIENT_LIMIT}
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
                      <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                        {clientCount >= FREE_PLAN_CLIENT_LIMIT 
                          ? "Limit reached. Upgrade to scale your client network."
                          : `${FREE_PLAN_CLIENT_LIMIT - clientCount} slots remaining in your free workspace.`}
                      </p>
                    )}
                  </div>

                  {!isPro && (
                    <Button 
                      type="button"
                      className="w-full h-14 rounded-2xl font-black text-base shadow-brand bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => router.push("/dashboard?upgrade=true")}
                    >
                      <Zap className="w-5 h-5 mr-2 fill-white" />
                      Upgrade Workspace
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone / Logout */}
          <div className="p-8 space-y-6 rounded-[2.5rem] bg-destructive/5 border border-destructive/10 backdrop-blur-sm">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Security
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium">Terminate your active session safely.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full h-12 rounded-2xl font-black border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all duration-300"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              {loggingOut ? "De-authenticating..." : "Sign Out Everywhere"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
