"use client";

import { useUser } from "@/hooks/use-user";
import { logout } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, <span className="font-semibold text-primary">{user?.email}</span>!</p>
      <Button onClick={async () => { await logout(); router.push("/login"); }} variant="destructive">Log Out</Button>
    </div>
  );
}