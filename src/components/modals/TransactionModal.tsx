import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toInputDate } from "@/lib/date";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  categoryId: number;
};

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Transaction, "id"> | Transaction) => void;
  transaction: Transaction | null;
  isPending: boolean;
}

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  transaction, 
  isPending 
}: TransactionModalProps) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Quando la transazione cambia o la modale si apre, aggiorna lo stato
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setDate(toInputDate(transaction.date));
        setDescription(transaction.description);
        setAmount(transaction.amount.toString());
      } else {
        // Default a oggi per nuove transazioni
        setDate(toInputDate(new Date()));
        setDescription("");
        setAmount("");
      }
    }
  }, [isOpen, transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (date && description && amount) {
      const data = {
        date: new Date(date).toISOString(),
        description,
        amount: parseFloat(amount),
      };
      
      if (transaction) {
        onSave({
          ...data,
          id: transaction.id,
          categoryId: transaction.categoryId,
        });
      } else {
        onSave(data);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            {transaction ? "Modifica Transazione" : "Nuova Transazione"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="transactionDate" className="block text-lg font-medium mb-2">
              Data
            </Label>
            <Input
              id="transactionDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-6 text-lg rounded-2xl border-2 border-primary/50 focus:border-primary focus:ring-primary/30 h-auto"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="transactionDescription" className="block text-lg font-medium mb-2">
              Descrizione
            </Label>
            <Input
              id="transactionDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-6 text-lg rounded-2xl border-2 border-primary/50 focus:border-primary focus:ring-primary/30 h-auto"
              placeholder="Es: Spesa settimanale"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="transactionAmount" className="block text-lg font-medium mb-2">
              Importo (€)
            </Label>
            <Input
              id="transactionAmount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-5 py-6 text-lg rounded-2xl border-2 border-primary/50 focus:border-primary focus:ring-primary/30 h-auto"
              placeholder="Es: 50.00"
              required
            />
            <p className="text-sm text-neutral-dark/70 mt-2">
              Usa il segno negativo (-) per le spese.
            </p>
          </div>
          
          <DialogFooter className="flex space-x-3 mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-neutral-light hover:bg-neutral-light/80 py-3 px-4 rounded-xl text-neutral-dark font-medium h-auto"
              disabled={isPending}
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 py-3 px-4 rounded-xl text-neutral-dark font-bold h-auto"
              disabled={isPending || !date || !description || !amount}
            >
              {isPending ? "Salvataggio..." : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
