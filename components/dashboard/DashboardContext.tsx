"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { useProfile } from "@/hooks/use-profile";
import { UserProfile } from "@/lib/firebase/firestore";

interface DashboardContextValue {
  isAddClientModalOpen: boolean;
  setIsAddClientModalOpen: (open: boolean) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  profile: UserProfile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextValue>({
  isAddClientModalOpen: false,
  setIsAddClientModalOpen: () => {},
  refreshTrigger: 0,
  triggerRefresh: () => {},
  profile: null,
  profileLoading: true,
  refreshProfile: async () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { profile, loading: profileLoading, refreshProfile } = useProfile();

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const value = useMemo(() => ({
    isAddClientModalOpen,
    setIsAddClientModalOpen,
    refreshTrigger,
    triggerRefresh,
    profile,
    profileLoading,
    refreshProfile
  }), [isAddClientModalOpen, refreshTrigger, profile, profileLoading, refreshProfile, triggerRefresh]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}
