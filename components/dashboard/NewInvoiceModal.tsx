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
  clientEmail: string;
  clientCompany?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewInvoiceModal({ 
  clientId, 
  clientName, 
  clientEmail, 
  clientCompany = "", 
  isOpen, 
  onClose, 
  onSuccess 
}: NewInvoiceModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
  const [notes, setNotes] = useState("");
  
  // Advanced Billing Metrics
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState("");

  // Auto-generate invoice number placeholder/suggestion logic
  useEffect(() => {
    if (isOpen && !invoiceNumber) {
      setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [isOpen, invoiceNumber]);

  // Dynamic Math Computations
  const subtotal = lineItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.rate) || 0), 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const total = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    const newItems = [...lineItems];
    (newItems[index] as any)[field] = value;
    
    // Auto-calculate row amount
    if (field === "quantity" || field === "rate") {
      const qty = Number(newItems[index].quantity) || 0;
      const rate = Number(newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }
    
    setLineItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (lineItems.some(item => !item.description || item.quantity <= 0 || item.rate <= 0)) {
      toast.error("Please fill all line items with valid quantities and rates.");
      return;
    }

    setLoading(true);
    try {
      const issueDate = new Date();
      const due = new Date(dueDate);
      
      await addInvoice(clientId, user.uid, {
        invoiceNumber,
        clientName,
        clientEmail,
        clientCompany,
        issueDate: Timestamp.fromDate(issueDate),
        dueDate: Timestamp.fromDate(due),
        lineItems,
        subtotal,
        taxRate: Number(taxRate) || 0,
        taxAmount,
        discount: Number(discount) || 0,
        total,
        status: "draft",
        notes,
        paymentUrl: paymentUrl.trim() || undefined
      });

      toast.success("Invoice created successfully!");
      onSuccess();
      onClose();
      
      // Reset form
      setLineItems([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
      setInvoiceNumber("");
      setDueDate("");
      setNotes("");
      setTaxRate(0);
      setDiscount(0);
      setPaymentUrl("");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-background border border-border overflow-hidden p-0 animate-in zoom-in-95 duration-200 rounded-sm">
        <form onSubmit={handleSubmit}>
          <div className="bg-primary h-1 w-full" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold tracking-tight text-foreground font-sans">CREATE STATEMENT</DialogTitle>
              <DialogDescription className="mt-2 text-muted-foreground font-mono uppercase tracking-wider text-xs">
                For {clientName}. Draft statements can be reviewed before sending.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar my-4">
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
                
                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {lineItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex-grow">
                        <Input
                          placeholder="Description (e.g. Design Consulting)"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, "description", e.target.value)}
                          className="bg-secondary/40 border-border/40 rounded-sm h-10 text-sm"
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity || ""}
                          onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 0)}
                          className="bg-secondary/40 border-border/40 rounded-sm h-10 text-sm font-mono"
                        />
                      </div>
                      <div className="w-28">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Rate ($)"
                          value={item.rate || ""}
                          onChange={(e) => updateLineItem(index, "rate", parseFloat(e.target.value) || 0)}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2.5">
                  <Label htmlFor="taxRate" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={taxRate || ""}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all font-mono"
                  />
                </div>
                <div className="grid gap-2.5">
                  <Label htmlFor="discount" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Flat Discount ($)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={discount || ""}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-2.5">
                <Label htmlFor="paymentUrl" className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Online Payment Gateway Redirect URL (Wise, PayPal, Stripe)</Label>
                <Input
                  id="paymentUrl"
                  type="url"
                  placeholder="https://stripe.com/pay/... or https://paypal.me/..."
                  value={paymentUrl}
                  onChange={(e) => setPaymentUrl(e.target.value)}
                  className="bg-secondary/40 border-border/40 focus:ring-4 focus:ring-primary/10 rounded-sm h-11 transition-all font-mono text-xs"
                />
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

              {/* Advanced Invoice Telemetry Statement */}
              <div className="p-4 bg-secondary/20 border border-border/50 rounded-sm space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {taxAmount > 0 && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Tax ({taxRate}%)</span>
                    <span>+${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex items-center justify-between text-muted-foreground mb-1">
                    <span>Discount</span>
                    <span className="text-destructive">-${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="border-t border-border/40 pt-2.5 mt-2 flex items-center justify-between text-foreground font-black text-sm uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calculator className="w-4 h-4 mr-2 text-primary" /> Total Balance Due
                  </div>
                  <div className="text-xl font-sans tracking-tight text-primary">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-0 pt-2 border-t border-border mt-2 pt-6">
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
