"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClient, getNotes, deleteClient, Client, Note } from "@/lib/firebase/firestore";
import { AddNote } from "@/components/dashboard/AddNote";
import { NoteCard } from "@/components/dashboard/NoteCard";
import { SetReminderModal } from "@/components/dashboard/SetReminderModal";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Mail,
  Building,
  Trash2,
  ExternalLink,
  MessageSquare,
  Calendar,
  Plus
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!id) return;
    try {
      const clientData = await getClient(id as string);
      if (!clientData) {
        router.push("/dashboard");
        return;
      }
      setClient(clientData);
      const notesData = await getNotes(id as string);
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router, getClient, getNotes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this client and all their data?")) {
      await deleteClient(id as string);
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard" 
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="flex justify-start gap-2">
            <a href={`mailto:${client.email}`} className="flex items-center gap-2">
              <Mail className="w-4 h-4 mr-2" />
              Email Client
            </a>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{client.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full text-sm font-medium">
              <Building className="w-4 h-4 mr-2" />
              {client.company}
            </div>
            <div className="flex items-center text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full text-sm font-medium">
              <Mail className="w-4 h-4 mr-2" />
              {client.email}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Add Note
              </h2>
            </div>
            <AddNote clientId={client.id} onSuccess={fetchData} />
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4">
              History
              <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full ml-1">
                {notes.length}
              </span>
            </h2>
            
            {notes.length === 0 ? (
              <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No history yet. Add your first note above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6 sticky top-24">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Client Details
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Status</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium text-xs">Active</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Last Contacted</span>
                <span className="font-medium text-foreground">Never</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-foreground">
                  {client.createdAt?.toDate?.()?.toLocaleDateString() || "Just now"}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setIsReminderModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SetReminderModal 
        clientId={client.id}
        clientName={client.name}
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSuccess={() => {
          // You might want to fetch reminders or show a toast
        }}
      />
    </div>
  );
}
