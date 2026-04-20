"use client";

import { useAuth } from "@/lib/firebase/auth-context";

export const useUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};
