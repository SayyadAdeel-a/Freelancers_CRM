"use client";

import { useState } from "react";
import { Invoice, updateInvoice } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  MoreHorizontal,
  Mail,
  Download
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import { generateInvoicePdf } from "@/lib/pdf/client";
import { uploadInvoicePdf } from "@/lib/firebase/storage";

interface InvoiceListProps {
  clientId?: string;
  invoices: Invoice[];
  onUpdate: () => void;
  hideClientName?: boolean;
}

export function InvoiceList({ clientId: propClientId, invoices, onUpdate, hideClientName = true }: InvoiceListProps) {
  const { user } = useUser();
  const [updating, setUpdating] = useState<string | null>(null);

  const getStatusBadge = (invoice: Invoice) => {
    const isOverdue = invoice.status === "sent" && 
      (invoice.dueDate as Timestamp).toDate() < new Date();
    
    const status = isOverdue ? "overdue" : invoice.status;

    const styles = {
      draft: "bg-secondary text-muted-foreground border-border",
      sent: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      paid: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      overdue: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };

    return (
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${styles[status]}`}>
          {status}
        </span>
        {invoice.viewsCount && invoice.viewsCount > 0 ? (
          <span 
            className="flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-sm border border-green-500/20 font-mono tracking-tight cursor-help"
            title={`Opened ${invoice.viewsCount} time${invoice.viewsCount > 1 ? 's' : ''}. Last read: ${invoice.lastViewedAt ? formatDate(invoice.lastViewedAt as any) : 'Unknown'}`}
          >
            <span>👁</span>
            <span>{invoice.viewsCount}</span>
          </span>
        ) : null}
      </div>
    );
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    setUpdating(invoice.id);
    const targetClientId = propClientId || invoice.clientId;
    if (!targetClientId) {
      toast.error("Could not find client ID for this invoice");
      return;
    }

    try {
      await updateInvoice(targetClientId, invoice.id, { 
        status: "paid",
        paidAt: Timestamp.now()
      });
      toast.success("Invoice marked as paid");
      onUpdate();
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    } finally {
      setUpdating(null);
    }
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    const toastId = toast.loading("Compiling high-resolution PDF...");
    try {
      const pdfBlob = await generateInvoicePdf(invoice);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF.", { id: toastId });
    }
  };

  const handleSendViaNudge = async (invoice: Invoice) => {
    setUpdating(invoice.id);
    const targetClientId = propClientId || invoice.clientId;
    if (!targetClientId) {
      toast.error("Could not find client ID for this invoice");
      setUpdating(null);
      return;
    }

    const toastId = toast.loading("Compiling PDF Statement...");
    try {
      // 1. Generate local PDF blob
      const pdfBlob = await generateInvoicePdf(invoice);
      
      // 2. Upload to Firebase Storage in background
      toast.loading("Uploading securely to Nudge cloud...", { id: toastId });
      const pdfUrl = await uploadInvoicePdf(user?.uid || "", invoice.id, pdfBlob);
      
      // 3. Mark in database as sent
      toast.loading("Updating invoice state...", { id: toastId });
      await updateInvoice(targetClientId, invoice.id, { 
        status: "sent",
        sentAt: Timestamp.now(),
        pdfUrl
      });

      // 4. Convert blob to Base64 to transmit as attachment
      toast.loading("Dispatching trackable statement via Resend...", { id: toastId });
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        try {
          const base64data = (reader.result as string).split(',')[1];
          
          const res = await fetch("/api/invoices/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoiceId: invoice.id,
              userEmail: user?.email,
              userName: user?.displayName,
              pdfBase64: base64data
            })
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to send email");
          }

          toast.success("Invoice sent via Nudge with attached PDF!", { id: toastId });
          onUpdate();
        } catch (error: any) {
          console.error("Error dispatching email:", error);
          toast.error(`Email dispatch failed: ${error.message || "Unknown error"}`, { id: toastId });
        } finally {
          setUpdating(null);
        }
      };
    } catch (error: any) {
      console.error("Nudge send process failed:", error);
      toast.error(`Failed to send invoice: ${error.message || "Unknown error"}`, { id: toastId });
      setUpdating(null);
    }
  };

  const handleSendViaGmail = async (invoice: Invoice) => {
    const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber} from ${user?.displayName || "Nudge CRM User"}`);
    const publicUrl = `https://app.adeelsayyad.tech/invoice/${invoice.id}`;
    
    // Format line items for plain text
    const itemsText = invoice.lineItems.map(item => `- ${item.description}: $${item.amount.toLocaleString()}`).join('\n');
    
    const body = encodeURIComponent(
      `Hi ${invoice.clientName},\n\n` +
      `I hope you're having a great day.\n\n` +
      `Please find the details for invoice ${invoice.invoiceNumber} below.\n\n` +
      `Invoice Summary:\n` +
      `${itemsText}\n\n` +
      `Total Balance Due: $${invoice.total.toLocaleString()}\n` +
      `Due Date: ${formatDate(invoice.dueDate)}\n\n` +
      `--- STUNNING VERSION ---\n` +
      `You can view the full professional breakdown and pay online here:\n` +
      `${publicUrl}\n` +
      `------------------------\n\n` +
      `Please let me know if you have any questions.\n\n` +
      `Best regards,\n${user?.displayName || "Nudge CRM User"}`
    );
    
    // 1. Update status to 'sent'
    setUpdating(invoice.id);
    const targetClientId = propClientId || invoice.clientId;
    if (!targetClientId) {
      toast.error("Could not find client ID for this invoice");
      return;
    }

    try {
      await updateInvoice(targetClientId, invoice.id, { 
        status: "sent",
        sentAt: Timestamp.now()
      });
      onUpdate();
      
      // 2. Open Gmail
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${invoice.clientEmail}&su=${subject}&body=${body}`, '_blank');
      toast.success("Opening Gmail and marked as sent");
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
    } finally {
      setUpdating(null);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 bg-secondary/10 rounded-sm border border-dashed border-border/60">
        <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">No invoices created for this client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead className="bg-secondary/30 uppercase tracking-widest text-[10px] font-black text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3">INV #</th>
              {!hideClientName && <th className="px-4 py-3">Client</th>}
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-4 py-4 font-bold text-foreground">{invoice.invoiceNumber}</td>
                {!hideClientName && (
                  <td className="px-4 py-4 text-muted-foreground uppercase font-bold text-[10px]">
                    {invoice.clientName || "Unknown"}
                  </td>
                )}
                <td className="px-4 py-4 text-muted-foreground">{formatDate(invoice.issueDate)}</td>
                <td className="px-4 py-4 text-muted-foreground">{formatDate(invoice.dueDate)}</td>
                <td className="px-4 py-4 font-bold text-foreground">
                  ${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(invoice)}
                </td>
                <td className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      disabled={updating === invoice.id}
                      className="p-1 hover:bg-accent rounded-sm transition-colors cursor-pointer border border-transparent hover:border-border inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-sm font-mono text-[10px] uppercase tracking-wider">
                      {invoice.status === "draft" && (
                        <>
                          <DropdownMenuItem onClick={() => handleSendViaNudge(invoice)} className="text-primary font-black">
                            <Send className="w-3.5 h-3.5 mr-2 animate-pulse" /> Send via Nudge (Tracked)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendViaGmail(invoice)}>
                            <Mail className="w-3.5 h-3.5 mr-2" /> Send via Gmail (Personal)
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      <DropdownMenuItem onClick={() => handleDownloadPdf(invoice)}>
                        <Download className="w-3.5 h-3.5 mr-2" /> Download PDF Statement
                      </DropdownMenuItem>

                      {invoice.status !== "paid" && (
                        <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-500" /> Mark as Paid
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
