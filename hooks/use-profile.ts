"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./use-user";
import { getUserProfile, createUserProfile, UserProfile } from "@/lib/firebase/firestore";

export function useProfile() {
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let data = await getUserProfile(user.uid);
      if (!data) {
        await createUserProfile(user.uid);
        data = await getUserProfile(user.uid);
      }
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading, fetchProfile]);

  return { profile, loading, refreshProfile: fetchProfile };
}
