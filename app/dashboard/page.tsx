"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { getClients, deleteClient, Client } from "@/lib/firebase/firestore";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AddClientModal } from "@/components/dashboard/AddClientModal";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Plus, Users, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [plan, setPlan] = useState("free"); // Default to free, will be fetched from user doc later

  const fetchClients = async () => {
    if (!user) return;
    try {
      const data = await getClients(user.uid);
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchClients();
    }
  }, [user, authLoading]);

  const handleAddClick = () => {
    if (plan === "free" && clients.length >= 5) {
      setIsUpgradeModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    }
  };

  if (authLoading || (loading && clients.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
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
          <p className="text-muted-foreground mt-1">Manage your active projects and relationships.</p>
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
              onDelete={handleDelete} 
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