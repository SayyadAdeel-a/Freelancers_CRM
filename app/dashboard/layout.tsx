"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import { PricingModal } from "@/components/dashboard/PricingModal";
import { DashboardProvider, useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { 
    isAddClientModalOpen, setIsAddClientModalOpen, 
    isPricingModalOpen, setIsPricingModalOpen,
    triggerRefresh 
  } = useDashboardContext();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("payment") === "success") {
      toast.success("Welcome to Pro!", {
        description: "Your account has been successfully upgraded.",
      });
      triggerRefresh();
      // Clean the URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams, triggerRefresh]);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background relative">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0 relative z-10">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-dot-pattern relative overflow-x-hidden">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
        <MobileNav />
      </div>

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSuccess={triggerRefresh}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
