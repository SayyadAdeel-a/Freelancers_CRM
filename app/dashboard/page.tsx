"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { useSearchParams } from "next/navigation";
import { getClients, deleteClient, getAllUserInvoices, Client, Invoice } from "@/lib/firebase/firestore";
import { FREE_PLAN_CLIENT_LIMIT } from "@/lib/constants";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PricingModal } from "@/components/dashboard/PricingModal";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, FileCheck, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ClientCardSkeleton } from "@/components/dashboard/Skeletons";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const { profile, setIsAddClientModalOpen, setIsPricingModalOpen, refreshTrigger } = useDashboardContext();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const plan = profile?.plan || "free";

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    // Fetch clients
    try {
      const clientsData = await getClients(user.uid);
      setClients(clientsData as Client[]);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    }

    // Fetch invoices (might fail if index is missing)
    try {
      const invoicesData = await getAllUserInvoices(user.uid);
      setInvoices(invoicesData as Invoice[]);
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
      // Don't show a toast for invoices index error as it's common during initial setup
      // but log it clearly
      if (error?.message?.includes("index")) {
        console.warn("Firestore index for invoices subcollection is missing. Check the link in the console above.");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [fetchData, authLoading, refreshTrigger, user]);

  useEffect(() => {
    if (searchParams.get("upgrade") === "true") {
      setIsPricingModalOpen(true);
    }
  }, [searchParams, setIsPricingModalOpen]);

  const handleAddClick = () => {
    if (plan === "free" && clients.length >= FREE_PLAN_CLIENT_LIMIT) {
      setIsPricingModalOpen(true);
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
      <div className="relative p-8 border border-border bg-card rounded-sm overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Command Center</h1>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mt-1">Operational Overview & Asset Tracking</p>
            </div>
            <Button onClick={handleAddClick} className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest rounded-sm h-11 px-6 shadow-brand">
              <Plus className="w-4 h-4 mr-2" />
              Initialize Client
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { 
                label: "Accounts Receivable", 
                value: invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((acc, i) => acc + i.total, 0),
                icon: Wallet,
                color: "text-foreground"
              },
              { 
                label: "Settled Revenue", 
                value: invoices.filter(i => i.status === "paid").reduce((acc, i) => acc + i.total, 0),
                icon: FileCheck,
                color: "text-primary"
              },
              { 
                label: "Critical Delays", 
                value: invoices.filter(i => {
                  if (i.status !== "sent" || !i.dueDate) return false;
                  try {
                    const dueDate = (i.dueDate as any)?.toDate 
                      ? (i.dueDate as any).toDate() 
                      : (i.dueDate instanceof Date)
                        ? i.dueDate
                        : new Date(i.dueDate as any);
                    return dueDate < new Date();
                  } catch (e) {
                    return false;
                  }
                }).length,
                icon: AlertTriangle,
                isCount: true,
                color: "text-primary"
              }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-sm border border-border/60 bg-background/50 backdrop-blur-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                  <stat.icon className={`w-4 h-4 opacity-40 ${stat.color}`} />
                </div>
                <h3 className={`text-3xl font-black font-sans tracking-tight ${stat.color}`}>
                  {stat.isCount ? stat.value : `$${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </h3>
              </div>
            ))}
          </div>
        </div>
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

      {/* Pricing Modal is now handled globally in the layout, but we keep it here for direct triggers if needed */}
    </div>
  );
}
