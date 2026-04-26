"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { Alert } from "@/components/Alert";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });
  const [error, setError] = useState<string | null>(null);

  const handleAddClient = async () => {
    if (clients.length >= 5) {
      setIsUpsellOpen(true);
      return;
    }

    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      ...formData,
    };

    setClients([...clients, newClient]);
    setFormData({ name: "", email: "", company: "" });
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with count */}
      <div className="vast">
        <div className="text-display font-mono">{clients.length}</div>
        <div className="text-heading font-body">Active Clients</div>
        <div className="text-secondary font-mono uppercase tracking-wider text-sm">
          Freelance business management
        </div>
      </div>

      {/* Alert for limit */}
      {clients.length >= 5 && (
        <Alert variant="warning">
          Free plan limit reached. Upgrade to Pro to add more clients.
        </Alert>
      )}

      {/* Client cards */}
      <div className="grid gap-4">
        {clients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="Start building your client directory"
            action={
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Add Client
              </Button>
            }
          />
        ) : (
          clients.map((client) => (
            <Card key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="tight">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-mono">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-heading font-medium">{client.name}</div>
                    <div className="text-secondary font-mono text-sm">{client.company}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Client Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Client">
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Inc."
          />
          {error && <Alert variant="error">{error}</Alert>}
          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={handleAddClient}>
              Add Client
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upgrade Modal */}
      <Modal isOpen={isUpsellOpen} onClose={() => setIsUpsellOpen(false)} title="Upgrade to Pro">
        <div className="space-y-4">
          <p className="text-body font-mono">
            Your free plan allows up to 10 clients. Upgrade to add unlimited clients and access advanced features.
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => console.log("Upgrade clicked")}>
              Upgrade Now - $9/mo
            </Button>
            <Button variant="ghost" onClick={() => setIsUpsellOpen(false)}>
              Later
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}