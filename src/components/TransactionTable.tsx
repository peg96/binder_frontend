import { formatDateIt } from "@/lib/date";
import { formatCurrency } from "@/lib/currency";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { LoadingTransactionRow } from "@/components/ui/loading-states";

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  categoryId: number;
};

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  onAddTransaction: () => void;
}

export default function TransactionTable({ 
  transactions, 
  isLoading, 
  onEdit, 
  onDelete,
  onAddTransaction 
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-neutral-light/50 rounded-md"></div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Nessuna transazione"
        description="Non ci sono transazioni in questa categoria."
        buttonText="Aggiungi una transazione"
        onClick={onAddTransaction}
        icon="transaction"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead className="text-right">Importo</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow 
              key={transaction.id}
              className="hover:bg-neutral-light/30"
            >
              <TableCell className="py-3 whitespace-nowrap">
                {formatDateIt(transaction.date)}
              </TableCell>
              <TableCell className="py-3">{transaction.description}</TableCell>
              <TableCell className={`py-3 text-right font-medium ${transaction.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="py-3 text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-dark/70 hover:text-accent h-8 w-8"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-dark/70 hover:text-destructive h-8 w-8"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
