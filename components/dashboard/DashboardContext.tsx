"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface DashboardContextValue {
  isAddClientModalOpen: boolean;
  setIsAddClientModalOpen: (open: boolean) => void;
  refreshClients: () => void;
  setRefreshClients: (fn: () => void) => void;
}

export const DashboardContext = createContext<DashboardContextValue>({
  isAddClientModalOpen: false,
  setIsAddClientModalOpen: () => {},
  refreshClients: () => {},
  setRefreshClients: () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [refreshClients, setRefreshClientsState] = useState<() => void>(() => () => {});

  const setRefreshClients = useCallback((fn: () => void) => {
    setRefreshClientsState(() => fn);
  }, []);

  return (
    <DashboardContext.Provider
      value={{ isAddClientModalOpen, setIsAddClientModalOpen, refreshClients, setRefreshClients }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}
