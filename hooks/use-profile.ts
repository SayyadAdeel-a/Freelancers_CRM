"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "./use-user";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { createUserProfile, UserProfile, getUserProfile } from "@/lib/firebase/firestore";

export function useProfile() {
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Set up real-time listener for the user profile
    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as unknown as UserProfile);
        setLoading(false);
      } else {
        // Profile doesn't exist yet, create it and then the snapshot will trigger again
        await createUserProfile(user.uid);
      }
    }, (error) => {
      console.error("Profile Listener Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // Compatibility with old refreshProfile call (though no longer needed for data freshness)
  const refreshProfile = useCallback(async () => {
    if (user) {
      const data = await getUserProfile(user.uid);
      setProfile(data);
    }
  }, [user]);

  return { profile, loading, refreshProfile };
}
