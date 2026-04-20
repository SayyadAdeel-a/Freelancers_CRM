"use client";

import { useUser } from "@/hooks/use-user";
import { logout } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p>Email: {user?.email}</p>
      <Button onClick={async () => { await logout(); router.push("/login"); }} variant="destructive">Log Out</Button>
    </div>
  );
}