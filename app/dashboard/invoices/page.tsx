"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { getAllUserInvoices, Invoice } from "@/lib/firebase/firestore";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useRouter } from "next/navigation";
import { InvoiceList } from "@/components/dashboard/InvoiceList";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InvoicesPage() {
  const { user } = useUser();
  const { profile, setIsPricingModalOpen } = useDashboardContext();
  const isPro = profile?.plan === "pro";
  const router = useRouter();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your client billing in one place.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-lg">No invoices yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Go to a client's page to create your first invoice.
              </p>
            </div>
          </div>
        ) : (
          <InvoiceList 
            invoices={invoices} 
            onUpdate={fetchInvoices} 
            hideClientName={false}
          />
        )}
      </div>
    </div>
  );
}
