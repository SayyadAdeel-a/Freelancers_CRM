"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@/hooks/use-user";
import { getClients, deleteClient, Client } from "@/lib/firebase/firestore";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ClientCardSkeleton } from "@/components/dashboard/Skeletons";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { FREE_PLAN_CLIENT_LIMIT } from "@/lib/constants";
import posthog from "posthog-js";

export default function ClientsPage() {
  const { user, loading: authLoading } = useUser();
  const { profile } = useDashboardContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const plan = profile?.plan || "free";
  const [search, setSearch] = useState("");

  const fetchClients = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getClients(user.uid);
      setClients(data as Client[]);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      // Defer execution to avoid synchronous setState in effect body
      void Promise.resolve().then(() => fetchClients());
    }
  }, [fetchClients, authLoading, user]);

  const filteredClients = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
    );
  }, [search, clients]);

  const handleAddClick = () => {
    if (plan === "free" && clients.length >= FREE_PLAN_CLIENT_LIMIT) {
      posthog.capture("upgrade_modal_viewed", { trigger: "client_limit", client_count: clients.length });
      setIsUpgradeModalOpen(true);
    } else {
      setIsAddModalOpen(true);
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
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-32 hidden sm:block" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            {clients.length === 0
              ? "No clients yet. Add your first one."
              : `${clients.length} client${clients.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Button onClick={handleAddClick} className="shadow-brand w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search bar */}
      {clients.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value.length >= 2) {
                posthog.capture("client_search_performed", { query_length: e.target.value.length });
              }
            }}
            placeholder="Search clients…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary/50 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      )}

      {/* Client grid */}
      {clients.length === 0 ? (
        <EmptyState onAddClick={handleAddClick} />
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No clients match &ldquo;{search}&rdquo;</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSearch("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, i) => (
            <div
              key={client.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <ClientCard client={client} onDelete={handleDelete(client.id)} />
            </div>
          ))}
        </div>
      )}

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchClients}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
