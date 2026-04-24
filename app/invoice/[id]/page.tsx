import { getInvoiceById } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import { FileText, Printer, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Image from "next/image";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PublicInvoicePage({ params }: PageProps) {
  const invoice = await getInvoiceById(params.id);

  if (!invoice) {
    notFound();
  }

  const dueDate = invoice.dueDate && 'toDate' in (invoice.dueDate as any)
    ? (invoice.dueDate as any).toDate()
    : invoice.dueDate instanceof Date
      ? invoice.dueDate
      : new Date();

  const isOverdue = invoice.status === "sent" && dueDate < new Date();

  const formatCurrency = (amt: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] p-4 sm:p-8 font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background border border-border p-6 rounded-sm shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`h-3 w-3 rounded-full animate-pulse ${
              invoice.status === 'paid' ? 'bg-green-500' : 
              isOverdue ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Invoice Status</p>
              <h2 className="text-xl font-black uppercase tracking-tight">
                {invoice.status === 'paid' ? 'Settled' : isOverdue ? 'Overdue' : 'Awaiting Payment'}
              </h2>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="font-mono text-[10px] uppercase tracking-widest h-9 rounded-sm" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5 mr-2" /> Print PDF
            </Button>
          </div>
        </div>

        {/* Main Invoice Card */}
        <div className="bg-white dark:bg-card border border-border rounded-sm shadow-xl overflow-hidden print:shadow-none print:border-none">
          <div className="h-2 bg-primary w-full" />
          
          <div className="p-8 sm:p-12 space-y-12">
            {/* Logo & Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-b border-border pb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm">
                    <span className="text-primary-foreground font-black text-xl">N</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tighter uppercase">Invoice</h1>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Reference Number</p>
                  <p className="font-mono font-bold text-lg">{invoice.invoiceNumber}</p>
                </div>
              </div>

              <div className="text-right space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Issued Date</p>
                  <p className="font-mono font-bold">{formatDate(invoice.issueDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Due Date</p>
                  <p className={`font-mono font-bold ${isOverdue ? 'text-red-500' : ''}`}>
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill To / From */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4 p-6 bg-secondary/20 rounded-sm border border-border/40">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Billed To</p>
                <div className="space-y-1">
                  <p className="text-2xl font-black tracking-tight">{invoice.clientName}</p>
                  <p className="text-sm font-mono text-muted-foreground">{invoice.clientEmail}</p>
                </div>
              </div>
              
              <div className="space-y-4 p-6 border border-border/40 rounded-sm">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Payable To</p>
                <div className="space-y-1">
                  <p className="text-xl font-bold tracking-tight">Financial Transaction Details</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please refer to the payment instructions provided by your service provider. 
                    Standard processing times apply.
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground ml-1">Professional Services Rendered</p>
              <div className="border border-border rounded-sm overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary/30 border-b border-border">
                      <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Description</th>
                      <th className="px-6 py-4 text-right text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoice.lineItems.map((item, i) => (
                      <tr key={i} className="hover:bg-secondary/10 transition-colors">
                        <td className="px-6 py-6 font-mono text-sm">{item.description}</td>
                        <td className="px-6 py-6 text-right font-mono font-bold text-lg">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Section */}
            <div className="flex justify-end pt-8">
              <div className="w-full sm:w-80 space-y-4">
                <div className="flex justify-between items-center px-6 py-8 bg-primary text-primary-foreground rounded-sm shadow-brand">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-80">Total Balance Due</p>
                  <p className="text-3xl font-black tracking-tighter">{formatCurrency(invoice.total)}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="space-y-4 p-8 bg-secondary/10 border-l-4 border-primary rounded-r-sm">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Vendor Notes</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-12 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted flex items-center justify-center rounded-full">
                  <FileText className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Generated via Nudge Ecosystem</p>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest">Digital Asset Verification: {invoice.id.slice(0, 8)}</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pb-12">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
            Need a professional CRM like this? 
            <a href="https://adeelsayyad.tech" className="text-primary font-bold ml-2 hover:underline">Built with Nudge</a>
          </p>
        </div>
      </div>
    </div>
  );
}
