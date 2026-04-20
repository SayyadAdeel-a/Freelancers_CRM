"use client";

import { Client } from "@/lib/firebase/firestore";
import { 
  MoreVertical, 
  Mail, 
  Building, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
}

export function ClientCard({ client, onDelete }: ClientCardProps) {
  return (
    <Link href={`/dashboard/client/${client.id}`} className="block group">
      <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden relative">
        <CardHeader className="p-5 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              {client.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{client.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Building className="w-3.5 h-3.5 mr-1.5" />
                {client.company}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e: React.MouseEvent) => e.preventDefault()}
              className="p-1 hover:bg-secondary rounded-md transition-colors cursor-pointer"
            >
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={(e) => {
                e.preventDefault();
                onDelete(client.id);
              }}>
                Delete Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent className="px-5 pb-5 pt-0">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              {client.email}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Added {client.createdAt?.toDate?.()?.toLocaleDateString() || "Just now"}
            </div>
            {client.nextReminder && (
              <div className="flex items-center text-primary font-medium">
                <Calendar className="w-4 h-4 mr-2" />
                Next Nudge: {client.nextReminder.remindAt?.toDate?.()?.toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {client.noteCount || 0} Notes
            </div>
            <div className="px-2 py-0.5 rounded-full bg-secondary text-foreground">
              Active
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
