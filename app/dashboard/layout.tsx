"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import { DashboardProvider, useDashboardContext } from "@/components/dashboard/DashboardContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAddClientModalOpen, setIsAddClientModalOpen, refreshClients } =
    useDashboardContext();

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
        <MobileNav />
      </div>

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSuccess={refreshClients}
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
