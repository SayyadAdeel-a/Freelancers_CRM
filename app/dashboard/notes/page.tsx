"use client";
import type { Client, Note } from "@/lib/firebase/firestore";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getClients, getNotesByClient, createNote } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Search, Send, Clock, ChevronRight } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

import { useDashboardContext } from "@/components/dashboard/DashboardContext";

export default function NotesPage() {
  const { user } = useUser();
  const { profile, setIsPricingModalOpen } = useDashboardContext();
  const isPro = profile?.plan === "pro";
  const router = useRouter();

  useEffect(() => {
    if (profile && !isPro) {
      router.push("/dashboard");
      setIsPricingModalOpen(true);
      toast.error("Pro Feature", {
        description: "Access to Notes requires a Pro plan."
      });
    }
  }, [profile, isPro, router, setIsPricingModalOpen]);

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [adding, setAdding] = useState(false);
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  
  const filteredClients = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
    );
  }, [search, clients]);

  const fetchClients = useCallback(async () => {
    if (!user) return;
    setLoadingClients(true);
    try {
      const data = await getClients(user.uid);
      setClients(data as Client[]);
    } finally {
      setLoadingClients(false);
    }
  }, [user]);

  useEffect(() => {
    // Defer execution to avoid synchronous setState in effect body
    void Promise.resolve().then(() => fetchClients());
  }, [fetchClients]);
  useEffect(() => {
    if (!selectedClient || !user) {
      void Promise.resolve().then(() => setNotes([]));
      return;
    }
    // Defer state update
    void Promise.resolve().then(() => setLoadingNotes(true));
    getNotesByClient(selectedClient.id, user.uid)
      .then((data) => setNotes(data as Note[]))
      .finally(() => setLoadingNotes(false));
  }, [selectedClient, user]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedClient || !content.trim()) return;
    setAdding(true);
    try {
      await createNote(selectedClient.id, user.uid, content.trim());
      const updated = await getNotesByClient(selectedClient.id, user.uid);
      setNotes(updated as Note[]);
      setContent("");
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    } finally {
      setAdding(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-in fade-in duration-500 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground mt-1">
          Activity logs and notes for each client.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 min-h-[500px]">
        {/* Client list panel */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 rounded-lg border-none outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {loadingClients ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : filteredClients.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                {search ? "No clients match your search" : "No clients yet"}
              </div>
            ) : (
              filteredClients.map((c) => {
                const isSelected = selectedClient?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className={cn(
                      "w-full text-left p-4 flex items-center gap-3 transition-all hover:bg-secondary/50 group",
                      isSelected && "bg-primary/5 border-l-2 border-primary"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}
                    >
                      {getInitials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-semibold truncate", isSelected && "text-primary")}>
                        {c.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.company || c.email}
                      </p>
                    </div>
                    {isSelected && <ChevronRight className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Notes panel */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          {!selectedClient ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-4">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">Select a client</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Choose a client from the list to view and add notes
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Panel header */}
              <div className="p-5 border-b border-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {getInitials(selectedClient.name)}
                </div>
                <div>
                  <h2 className="font-bold text-base">{selectedClient.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedClient.company || selectedClient.email}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full font-medium">
                  <FileText className="w-3.5 h-3.5" />
                  {notes.length} {notes.length === 1 ? "note" : "notes"}
                </div>
              </div>

              {/* Notes list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {loadingNotes ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                  ))
                ) : notes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center h-32 text-muted-foreground gap-2">
                    <p className="text-sm">No notes yet. Add the first one below.</p>
                  </div>
                ) : (
                  notes.map((note, i) => (
                    <div
                      key={note.id}
                      className="group bg-secondary/30 hover:bg-secondary/60 border border-border/50 rounded-xl p-4 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
                      style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    >
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatRelativeTime(note.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add note form */}
              <form
                onSubmit={handleAddNote}
                className="p-4 border-t border-border bg-card"
              >
                <div className="flex gap-3">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Add a note for ${selectedClient.name}…`}
                    className="flex-1 resize-none min-h-[72px] bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleAddNote(e as unknown as React.FormEvent);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={adding || !content.trim()}
                    className="self-end shadow-brand h-10 w-10 p-0 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Cmd + Enter to submit
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
