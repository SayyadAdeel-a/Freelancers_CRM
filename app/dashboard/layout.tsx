"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import { DashboardProvider, useDashboardContext } from "@/components/dashboard/DashboardContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAddClientModalOpen, setIsAddClientModalOpen, triggerRefresh } =
    useDashboardContext();

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0 relative z-10">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-dots relative overflow-x-hidden">
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
