"use client";
import type { Client, Note } from "@/lib/firebase/firestore";

import { useEffect, useState } from "react";
import { getClients, getNotesByClient, createNote } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

export default function NotesPage() {
  const { user } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [adding, setAdding] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!user) return;
    getClients(user.uid).then((data) => setClients(data as any)).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!selectedClient) { setNotes([]); return; }
    setLoading(true);
    getNotesByClient(selectedClient).then((data) => setNotes(data as any)).finally(() => setLoading(false));
  }, [selectedClient]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedClient || !content) return;
  const notes = useState<Note[]>([])[0];
    try {
      await createNote(selectedClient, user.uid, content);
      const updated = await getNotesByClient(selectedClient);
      setNotes(updated as any);
      setContent("");
    } finally {
      setAdding(false);
    }
  };

  if (!user) return <div>Unauthorized</div>;
  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Client Notes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {clients.map((c) => (
              <div key={c.id} className="p-3 border rounded cursor-pointer hover:bg-secondary" onClick={() => setSelectedClient(c.id)}>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.email} {c.company && `• ${c.company}`}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{clients.find(c => c.id === selectedClient)?.name || 'Select a client'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notes.length === 0 && <div className="text-muted-foreground">No notes yet.</div>}
            {notes.map((n) => (
              <Card key={n.id}>
                <CardContent className="pt-4">
                  <p>{n.content}</p>
                  <div className="text-xs text-muted-foreground mt-2">{new Date(n.createdAt.seconds * 1000).toLocaleString()}</div>
                </CardContent>
              </Card>
            ))}

            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add a note…" disabled={!selectedClient} />
              <Button type="submit" disabled={adding || !selectedClient}>{adding ? <Loader2 className="animate-spin" /> : <Plus />}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}