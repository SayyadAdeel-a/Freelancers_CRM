"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useProfile } from "@/hooks/use-profile";
import { UserProfile } from "@/lib/firebase/firestore";

interface DashboardContextValue {
  isAddClientModalOpen: boolean;
  setIsAddClientModalOpen: (open: boolean) => void;
  refreshClients: () => void;
  setRefreshClients: (fn: () => void) => void;
  profile: UserProfile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextValue>({
  isAddClientModalOpen: false,
  setIsAddClientModalOpen: () => {},
  refreshClients: () => {},
  setRefreshClients: () => {},
  profile: null,
  profileLoading: true,
  refreshProfile: async () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [refreshClients, setRefreshClientsState] = useState<() => void>(() => () => {});
  const { profile, loading: profileLoading, refreshProfile } = useProfile();

  const setRefreshClients = useCallback((fn: () => void) => {
    setRefreshClientsState(() => fn);
  }, []);

  return (
    <DashboardContext.Provider
      value={{ 
        isAddClientModalOpen, 
        setIsAddClientModalOpen, 
        refreshClients, 
        setRefreshClients,
        profile,
        profileLoading,
        refreshProfile
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}
