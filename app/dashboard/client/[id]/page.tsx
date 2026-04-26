"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { getClient, getNotes, getReminders, getInvoices, deleteClient, Client, Note, Reminder, Invoice } from "@/lib/firebase/firestore";
import { AddNote } from "@/components/dashboard/AddNote";
import { NoteCard } from "@/components/dashboard/NoteCard";
import { SetReminderModal } from "@/components/dashboard/SetReminderModal";
import { NewInvoiceModal } from "@/components/dashboard/NewInvoiceModal";
import { InvoiceList } from "@/components/dashboard/InvoiceList";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Mail,
  Building,
  Trash2,
  MessageSquare,
  Calendar,
  Plus,
  FileText
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { ClientDetailSkeleton } from "@/components/dashboard/Skeletons";
import { PayerRatingBadge } from "@/components/dashboard/PayerRatingBadge";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import posthog from "posthog-js";

export default function ClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const { profile, setIsPricingModalOpen } = useDashboardContext();
  const isPro = profile?.plan === "pro";

  const fetchData = useCallback(async (): Promise<void> => {
    if (!id) return;
    try {
      const clientData = await getClient(id as string, user?.uid || "");
      if (!clientData) {
        router.push("/dashboard");
        return;
      }
      setClient(clientData);
      
      // Fetch notes, reminders, and invoices in parallel
      const [notesData, remindersData, invoicesData] = await Promise.all([
        getNotes(id as string, user?.uid || ""),
        getReminders(id as string, user?.uid || ""),
        getInvoices(id as string, user?.uid || "")
      ]);
      
      setNotes(notesData);
      setReminders(remindersData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this client and all their data?")) {
      try {
        await deleteClient(id as string);
        posthog.capture("client_deleted", { client_id: id });
        toast.success("Client deleted successfully");
        router.push("/dashboard");
      } catch (error) {
        posthog.captureException(error);
        console.error("Error deleting client:", error);
        toast.error("Failed to delete client");
      }
    }
  };

  if (loading) {
    return <ClientDetailSkeleton />;
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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex justify-start gap-2"
            onClick={(e) => {
              if (!isPro) {
                e.preventDefault();
                setIsPricingModalOpen(true);
              }
            }}
          >
            {!isPro && <span className="opacity-60">🔒</span>}
            <a 
              href={isPro ? `mailto:${client.email}` : "#"} 
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isPro ? "Email Client" : "Pro Email"}
            </a>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{client.name}</h1>
            {client.payerRating && (
              <PayerRatingBadge rating={client.payerRating} size="md" className="mt-1" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-sm text-sm font-mono uppercase tracking-tight border border-border/50">
              <Building className="w-4 h-4 mr-2" />
              {client.company}
            </div>
            <div className="flex items-center text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-sm text-sm font-mono uppercase tracking-tight border border-border/50">
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
            <div className="relative">
              {!isPro && (
                <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] flex items-center justify-center border border-dashed border-border rounded-sm">
                  <Button onClick={() => setIsPricingModalOpen(true)} className="bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest rounded-sm">
                    Unlock Notes with Pro
                  </Button>
                </div>
              )}
              <AddNote clientId={client.id} onSuccess={fetchData} />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Invoices
                <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm ml-1 font-mono">
                  {invoices.length}
                </span>
              </h2>
              <Button 
                onClick={() => isPro ? setIsInvoiceModalOpen(true) : setIsPricingModalOpen(true)} 
                size="sm" 
                className="font-mono text-[10px] uppercase tracking-wider rounded-sm h-8"
              >
                {!isPro && <span className="mr-1.5 opacity-60">🔒</span>}
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Invoice
              </Button>
            </div>
            
            <InvoiceList 
              clientId={client.id} 
              invoices={invoices} 
              onUpdate={fetchData} 
            />
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4">
              History
              <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm ml-1 font-mono">
                {notes.length}
              </span>
            </h2>
            
            {notes.length === 0 ? (
              <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No history yet. Add your first note above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note, i) => (
                  <div
                    key={note.id}
                    className="animate-in fade-in slide-in-from-bottom-3"
                    style={{ animationDelay: `${i * 70}ms`, animationFillMode: "both" }}
                  >
                    <NoteCard note={note} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6 sticky top-24">
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
                  {formatDate(client.createdAt)}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => isPro ? setIsReminderModalOpen(true) : setIsPricingModalOpen(true)}
              >
                {!isPro && <span className="mr-2 opacity-60">🔒</span>}
                <Plus className="w-4 h-4 mr-2" />
                {isPro ? "Set Reminder" : "Set Pro Reminder"}
              </Button>

              {reminders.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upcoming Reminders</h4>
                  {reminders.filter(r => !r.isSent).map((reminder) => (
                    <div key={reminder.id} className="p-3 bg-secondary/30 rounded-xl border border-border/50 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-primary">Follow-up</span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(reminder.remindAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{reminder.message}</p>
                    </div>
                  ))}
                </div>
              )}
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
          fetchData();
        }}
      />
      <NewInvoiceModal
        clientId={client.id}
        clientName={client.name}
        clientEmail={client.email}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
