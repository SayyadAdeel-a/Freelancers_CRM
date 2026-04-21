"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import { Input } from "@/components/Input";
import { EmptyState } from "@/components/EmptyState";


interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export function ClientDetail() {
  const [client, setClient] = useState<Client>({
    id: "1",
    name: "Acme Corp",
    email: "contact@acme.com",
    company: "Acme Inc.",
  });

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Initial consultation - discussed project scope and timeline",
      createdAt: "2024-01-15 10:30",
    },
    {
      id: "2",
      content: "Sent proposal via email - awaiting response",
      createdAt: "2024-01-16 14:20",
    },
  ]);

  const [newNote, setNewNote] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toLocaleString(),
    };
    setNotes([note, ...notes]);
    setNewNote("");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Left column: Client info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Client header - tall treatment */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <div className="vast">
            <div className="text-display font-mono font-light">{client.name}</div>
            <div className="text-heading font-body">{client.company}</div>
            <div className="text-secondary font-mono text-sm">
              {client.email}
            </div>
          </div>
        </div>

        {/* Client details */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Contact details and company info</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  Name
                </label>
                <Input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                <Input value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                Company
              </label>
              <Input value={client.company} onChange={(e) => setClient({ ...client, company: e.target.value })} />
            </div>
          </div>
        </Card>

        {/* Notes section */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Chronological notes about client interactions</CardDescription>
          </CardHeader>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {notes.length === 0 ? (
              <EmptyState title="No notes yet" description="Record your conversations and interactions" />
            ) : (
              notes.map((note) => (
                <div key={note.id} className="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                  <p className="text-body font-mono text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">{note.createdAt}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                Add Note
              </label>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm outline-none resize-none min-h-[80px]"
                placeholder="Record your notes here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="primary" onClick={addNote}>
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right column: Sidebar actions */}
      <div className="space-y-4">
        {/* Set Reminder */}
        <Card>
          <CardHeader>
            <CardTitle>Set Reminder</CardTitle>
            <CardDescription>Schedule a follow-up</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                Remind on
              </label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm outline-none"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>
            <Button variant="primary" className="w-full">
              🔔 Set Reminder
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              📧 Send Email
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              📞 Call Client
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              📅 Schedule Meeting
            </Button>
          </div>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <span className="text-sm font-mono text-green-700 dark:text-green-400">Active</span>
              <span className="text-sm font-mono uppercase tracking-wider text-green-700 dark:text-green-400">
                In Progress
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">Next Contact</span>
              <span className="text-sm font-mono text-gray-500">2024-02-01</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}