"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { getAllUserInvoices, Invoice } from "@/lib/firebase/firestore";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useRouter } from "next/navigation";
import { InvoiceList } from "@/components/dashboard/InvoiceList";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Wallet, FileCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function InvoicesPage() {
  const { user } = useUser();
  const { profile, setIsPricingModalOpen } = useDashboardContext();
  const isPro = profile?.plan === "pro";
  const router = useRouter();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "sent" | "paid" | "overdue">("all");
  
  // Aggregate Metrics States
  const [paidTotal, setPaidTotal] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [overdueTotal, setOverdueTotal] = useState(0);

  useEffect(() => {
    if (profile && !isPro) {
      router.push("/dashboard");
      setIsPricingModalOpen(true);
      toast.error("Pro Feature", {
        description: "Invoicing is available exclusively on the Pro plan."
      });
    }
  }, [profile, isPro, router, setIsPricingModalOpen]);

  const fetchInvoices = useCallback(async () => {
    if (!user || !isPro) return;
    setLoading(true);
    try {
      const data = await getAllUserInvoices(user.uid);
      setInvoices(data as Invoice[]);

      // Compute statistics
      let paid = 0;
      let pending = 0;
      let overdue = 0;

      data.forEach((inv) => {
        let isOverdue = false;
        try {
          if (inv.status === "sent" && inv.dueDate) {
            const dueDate = (inv.dueDate as any)?.toDate 
              ? (inv.dueDate as any).toDate() 
              : (inv.dueDate instanceof Date)
                ? inv.dueDate
                : new Date(inv.dueDate as any);
            isOverdue = dueDate < new Date();
          }
        } catch (e) {
          console.error("Error parsing overdue date:", e);
        }

        if (inv.status === "paid") {
          paid += inv.total;
        } else if (isOverdue || inv.status === "overdue") {
          overdue += inv.total;
        } else if (inv.status === "sent") {
          pending += inv.total;
        }
      });

      setPaidTotal(paid);
      setPendingTotal(pending);
      setOverdueTotal(overdue);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [user, isPro]);

  useEffect(() => {
    if (user && isPro) {
      fetchInvoices();
    }
  }, [user, isPro, fetchInvoices]);

  if (!isPro) return null;

  // Filter logic
  const filteredInvoices = invoices.filter((inv) => {
    let isOverdue = false;
    try {
      if (inv.status === "sent" && inv.dueDate) {
        const dueDate = (inv.dueDate as any)?.toDate 
          ? (inv.dueDate as any).toDate() 
          : (inv.dueDate instanceof Date)
            ? inv.dueDate
            : new Date(inv.dueDate as any);
        isOverdue = dueDate < new Date();
      }
    } catch (e) {
      console.error("Error parsing filter date:", e);
    }

    if (filter === "all") return true;
    if (filter === "overdue") return isOverdue || inv.status === "overdue";
    if (filter === "sent") return inv.status === "sent" && !isOverdue;
    return inv.status === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Telemetry Header */}
      <div className="relative p-8 border border-border bg-card rounded-sm overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Billing Telemetry</h1>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mt-1">Invoice Generation & Liquidity Tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { 
                label: "Settled Revenue (Paid)", 
                value: paidTotal,
                icon: FileCheck,
                color: "text-primary"
              },
              { 
                label: "Accounts Receivable (Pending)", 
                value: pendingTotal,
                icon: Wallet,
                color: "text-foreground"
              },
              { 
                label: "Delinquent Capital (Overdue)", 
                value: overdueTotal,
                icon: AlertTriangle,
                color: "text-destructive"
              }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-sm border border-border/60 bg-background/50 backdrop-blur-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                  <stat.icon className={`w-4 h-4 opacity-40 ${stat.color}`} />
                </div>
                <h3 className={`text-3xl font-black font-sans tracking-tight ${stat.color}`}>
                  ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
          {[
            { id: "all", label: "All Invoices" },
            { id: "draft", label: "Drafts" },
            { id: "sent", label: "Pending" },
            { id: "paid", label: "Paid" },
            { id: "overdue", label: "Overdue" }
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-brand" 
                    : "bg-background text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Invoice List Panel */}
        <div className="bg-card border border-border rounded-sm p-6 relative overflow-hidden">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-16 h-16 bg-secondary/40 rounded-sm border border-border flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest font-black">No Invoices Found</p>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
                  {filter === "all" 
                    ? "Go to a client page to generate your first statement." 
                    : `No invoices match the "${filter}" filter status.`}
                </p>
              </div>
            </div>
          ) : (
            <InvoiceList 
              invoices={filteredInvoices} 
              onUpdate={fetchInvoices} 
              hideClientName={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
