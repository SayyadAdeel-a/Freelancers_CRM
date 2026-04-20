"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { getClients, deleteClient, Client } from "@/lib/firebase/firestore";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ClientCardSkeleton } from "@/components/dashboard/Skeletons";

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [plan, setPlan] = useState("free");

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
      fetchClients();
    }
  }, [fetchClients, authLoading]);

  const handleAddClick = () => {
    if (plan === "free" && clients.length >= 5) {
      setIsUpgradeModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };


  const handleDelete = (clientId: string) => async (confirmed: string) => {
    if (confirmed === "true") {
      try {
        await deleteClient(clientId);
        setClients(clients.filter(c => c.id !== clientId));
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
          <h1 className="text-3xl font-bold tracking-tight">Your Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your active projects and relationships.
          </p>
        </div>
        <Button onClick={handleAddClick} className="shadow-brand w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState onAddClick={handleAddClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={handleDelete(client.id)}
            />
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
