import { getInvoiceById } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import { FileText, Printer, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Viewer | Nudge CRM",
  description: "Secure invoice viewing and verification node.",
  robots: {
    index: false,
    follow: false,
  },
};

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
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] p-4 sm:p-12 font-sans selection:bg-red-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Top Branding Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-black text-xl tracking-tighter italic">N</span>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest uppercase text-white">Nudge CRM</h2>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Asset Verification Node</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Client Status</p>
              <p className={`text-xs font-bold uppercase tracking-widest ${invoice.status === 'paid' ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                {invoice.status === 'paid' ? 'Settled' : 'Action Required'}
              </p>
            </div>
          </div>
        </div>

        {/* The Invoice Grid */}
        <div className="bg-[#111111] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          {/* Industrial Header */}
          <div className="p-8 sm:p-16 border-b border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[120px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-12">
              <div className="space-y-8">
                <div>
                  <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">Invoice</h1>
                  <p className="text-xs font-mono text-white/60 mt-2 tracking-[0.3em] uppercase">Document Identifier: {invoice.invoiceNumber}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Billed Recipient</p>
                    <p className="text-2xl font-black text-white tracking-tight leading-none">{invoice.clientName}</p>
                    <p className="text-sm font-mono text-white/60 mt-2">{invoice.clientEmail}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 text-right w-full sm:w-auto">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-8 text-right">
                  <div>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Issuance Date</p>
                    <p className="text-lg font-bold text-white">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Expiration</p>
                    <p className={`text-lg font-bold ${isOverdue ? 'text-red-500' : 'text-white'}`}>{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
                
                <div className="pt-8 sm:pt-0">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Liability</p>
                  <p className="text-6xl font-black tracking-tighter text-red-500 leading-none">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items List */}
          <div className="p-8 sm:p-16 space-y-12 bg-black/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Resource Allocation</p>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Value (USD)</p>
              </div>
              
              <div className="space-y-4">
                {invoice.lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-end py-4 group">
                    <div className="flex-1">
                      <p className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{item.description}</p>
                      <div className="h-px w-full bg-white/5 mt-4" />
                    </div>
                    <div className="ml-12">
                      <p className="text-xl font-mono font-bold text-white tracking-tighter">{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note Box */}
            {invoice.notes && (
              <div className="p-8 bg-[#1A1A1A] border-l-2 border-red-500 rounded-sm">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3 italic">// Technical Notes</p>
                <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-8 sm:p-16 border-t border-white/10 bg-black flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 text-white/40">
              <ShieldCheck className="w-5 h-5 text-green-500/50" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em]">End-to-End Encrypted Verification Success</p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="bg-transparent border-white/10 text-white hover:bg-white hover:text-black font-mono text-[10px] uppercase tracking-widest h-12 px-8 rounded-none transition-all"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" /> PDF Output
              </Button>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <div className="flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity duration-700">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Nudge Industrial Ecosystem © 2026</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-[10px] font-mono uppercase tracking-widest">Network Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
