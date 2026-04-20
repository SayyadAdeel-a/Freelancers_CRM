"use client";
import type { Client } from "@/lib/firebase/firestore";

import { useEffect, useState } from "react";
import { getClients, createClient, getDocs, query, where, collection, addDoc } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

export default function ClientsPage() {
  const { user } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      getClients(user.uid).then((data) => setClients(data as any)).finally(() => setLoading(false));
    }
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !email) return;
    setAdding(true);
    try {
      const updated = await getClients(user.uid);
      setClients(updated as any);
      setName("");
      setEmail("");
    } finally {
      setAdding(false);
    }
  };

  if (!user) return <div>Unauthorized</div>;
  if (loading) return <div className="p-8">Loading clients...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button ><Plus /> New Client</Button>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input placeholder="Client name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" disabled={adding}>{adding ? <Loader2 className="animate-spin" /> : "Add Client"}</Button>
      </form>

      <div className="grid gap-4">
        {clients.map((c) => (
          <Card key={c.id}>
            <CardContent className="pt-4">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.email} {c.company && `• ${c.company}`}</div>
              <div className="text-xs text-muted-foreground mt-2">Added: {new Date(c.createdAt.seconds * 1000).toLocaleDateString()}</div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Notes (0)</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}