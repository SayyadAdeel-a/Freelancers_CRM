"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calculator } from "lucide-react";
import { addInvoice } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

interface NewInvoiceModalProps {
  clientId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewInvoiceModal({ clientId, clientName, isOpen, onClose, onSuccess }: NewInvoiceModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState([{ description: "", amount: 0 }]);
  const [notes, setNotes] = useState("");

  // Auto-generate invoice number placeholder/suggestion logic could go here
  useEffect(() => {
    if (isOpen && !invoiceNumber) {
      setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [isOpen, invoiceNumber]);

  const total = lineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    const newItems = [...lineItems];
    (newItems[index] as any)[field] = value;
    setLineItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (lineItems.some(item => !item.description || item.amount <= 0)) {
      toast.error("Please fill all line items with valid amounts.");
      return;
    }

    setLoading(true);
    try {
      const issueDate = new Date();
      const due = new Date(dueDate);
      
      await addInvoice(clientId, user.uid, {
        invoiceNumber,
        clientName,
        issueDate: Timestamp.fromDate(issueDate),
        dueDate: Timestamp.fromDate(due),
        lineItems,
        total,
        status: "draft",
        notes
      });

      toast.success("Invoice created successfully!");
      onSuccess();
      onClose();
      // Reset form
      setLineItems([{ description: "", amount: 0 }]);
      setInvoiceNumber("");
      setDueDate("");
      setNotes("");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background border border-border overflow-hidden p-0 animate-in zoom-in-95 duration-200 rounded-sm">
        <form onSubmit={handleSubmit}>
          <div className="bg-primary h-1 w-full" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold tracking-tight text-foreground font-sans">Create Invoice</DialogTitle>
              <DialogDescription className="mt-2 text-muted-foreground font-mono uppercase tracking-wider text-xs">
                For {clientName}. Draft invoices can be edited before sending.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2.5">
                  <Label htmlFor="invNum" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Invoice Number</Label>
                  <Input
                    id="invNum"
                    required
                    placeholder="INV-001"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all font-mono"
                  />
                </div>
                <div className="grid gap-2.5">
                  <Label htmlFor="dueDate" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Line Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="h-8 rounded-sm font-mono text-[10px] uppercase tracking-widest border-border/60">
                    <Plus className="w-3 h-3 mr-1" /> Add Item
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {lineItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex-grow">
                        <Input
                          placeholder="Description (e.g. Logo Design)"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, "description", e.target.value)}
                          className="bg-secondary/40 border-border/40 rounded-sm h-10 text-sm"
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={item.amount || ""}
                          onChange={(e) => updateLineItem(index, "amount", parseFloat(e.target.value))}
                          className="bg-secondary/40 border-border/40 rounded-sm h-10 text-sm font-mono"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border/50 rounded-sm">
                <div className="flex items-center text-muted-foreground font-mono text-xs uppercase tracking-widest">
                  <Calculator className="w-4 h-4 mr-2" /> Total Amount
                </div>
                <div className="text-2xl font-black font-sans tracking-tight">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="grid gap-2.5">
                <Label htmlFor="notes" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Thank you for your business!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all"
                />
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-0 pt-2 border-t border-border mt-4 pt-6">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="rounded-sm font-mono tracking-wider h-11 px-6 uppercase text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground rounded-sm font-mono tracking-wider uppercase text-xs h-11 px-8 hover:bg-primary/90 active:scale-95 transition-all">
                {loading ? "Creating..." : "Save Invoice"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
