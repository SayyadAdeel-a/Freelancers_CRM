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
import { formatDate } from "@/lib/utils";

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
}

export function ClientCard({ client, onDelete }: ClientCardProps) {
  return (
    <Link href={`/dashboard/client/${client.id}`} className="block group">
      <Card className="hover:border-foreground transition-all duration-300 overflow-hidden relative group-hover:translate-y-[-2px] rounded-sm bg-card border-border">
        <CardHeader className="p-5 flex flex-row items-start justify-between space-y-0 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-foreground flex items-center justify-center font-bold text-lg text-background font-mono border border-border">
              {client.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors font-sans tracking-tight">{client.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1 font-mono uppercase text-[11px] tracking-wider">
                <Building className="w-3.5 h-3.5 mr-1.5" />
                {client.company}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e: React.MouseEvent) => e.preventDefault()}
              className="p-1 hover:bg-accent rounded-sm transition-colors cursor-pointer border border-transparent hover:border-border"
            >
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-sm font-mono text-xs uppercase tracking-wider">
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" onClick={(e) => {
                e.preventDefault();
                onDelete(client.id);
              }}>
                Delete Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent className="px-5 pb-5 pt-5">
          <div className="grid grid-cols-1 gap-3 text-sm font-mono text-xs">
            <div className="flex items-center text-muted-foreground">
              <Mail className="w-4 h-4 mr-3" />
              {client.email}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-3" />
              Added {formatDate(client.createdAt)}
            </div>
            {client.nextReminder && (
              <div className="flex items-center text-primary font-bold">
                <Calendar className="w-4 h-4 mr-3" />
                Next Nudge: {formatDate(client.nextReminder.remindAt)}
              </div>
            )}
          </div>
          
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {client.noteCount || 0} Notes
            </div>
            <div className="px-2 py-1 rounded-sm bg-accent text-foreground border border-border">
              Active
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
