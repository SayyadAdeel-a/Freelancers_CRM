"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { useSearchParams } from "next/navigation";
import { getClients, deleteClient, getAllUserInvoices, Client, Invoice } from "@/lib/firebase/firestore";
import { FREE_PLAN_CLIENT_LIMIT } from "@/lib/constants";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, FileCheck, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ClientCardSkeleton } from "@/components/dashboard/Skeletons";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const { profile, setIsAddClientModalOpen, refreshTrigger } = useDashboardContext();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const plan = profile?.plan || "free";

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [clientsData, invoicesData] = await Promise.all([
        getClients(user.uid),
        getAllUserInvoices(user.uid)
      ]);
      setClients(clientsData as Client[]);
      setInvoices(invoicesData as Invoice[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      // Defer execution to avoid synchronous setState in effect body
      void Promise.resolve().then(() => fetchData());
    }
  }, [fetchData, authLoading, refreshTrigger, user]);

  useEffect(() => {
    if (searchParams.get("upgrade") === "true") {
      // Defer state update to avoid synchronous setState in effect body
      void Promise.resolve().then(() => setIsUpgradeModalOpen(true));
    }
  }, [searchParams]);

  const handleAddClick = () => {
    if (plan === "free" && clients.length >= FREE_PLAN_CLIENT_LIMIT) {
      setIsUpgradeModalOpen(true);
    } else {
      setIsAddClientModalOpen(true);
    }
  };

  const handleDelete = (clientId: string) => async (confirmed: string) => {
    if (confirmed === "true") {
      try {
        await deleteClient(clientId);
        setClients(clients.filter((c) => c.id !== clientId));
        toast.success("Client deleted successfully");
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Failed to delete client");
      }
    }
  };

  if (authLoading || (loading && clients.length === 0)) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 hidden sm:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ClientCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-sans">Your Clients</h1>
          <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-wider">
            Manage your active projects and relationships.
          </p>
        </div>
        <Button onClick={handleAddClick} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all w-full sm:w-auto font-mono uppercase tracking-wider text-xs rounded-sm">
          <Plus className="w-4 h-4 mr-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { 
            label: "Outstanding", 
            value: invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((acc, i) => acc + i.total, 0),
            icon: Wallet,
            color: "text-foreground"
          },
          { 
            label: "Paid Total", 
            value: invoices.filter(i => i.status === "paid").reduce((acc, i) => acc + i.total, 0),
            icon: FileCheck,
            color: "text-green-600 dark:text-green-400"
          },
          { 
            label: "Overdue", 
            value: invoices.filter(i => i.status === "sent" && (i.dueDate as any).toDate() < new Date()).length,
            icon: AlertTriangle,
            isCount: true,
            color: "text-red-600 dark:text-red-400"
          }
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-sm border border-border bg-card flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <h3 className={`text-xl font-black font-sans tracking-tight ${stat.color}`}>
                {stat.isCount ? stat.value : `$${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </h3>
            </div>
            <stat.icon className={`w-5 h-5 opacity-20 ${stat.color}`} />
          </div>
        ))}
      </div>

      {clients.length === 0 ? (
        <EmptyState onAddClick={handleAddClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, i) => (
            <div
              key={client.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 55}ms`, animationFillMode: "both" }}
            >
              <ClientCard client={client} onDelete={handleDelete(client.id)} />
            </div>
          ))}
        </div>
      )}

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
