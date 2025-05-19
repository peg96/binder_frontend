import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/currency";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChartView from "@/components/ChartView";
import TransactionTable from "@/components/TransactionTable";
import TransactionModal from "@/components/modals/TransactionModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import Header from "@/components/Header";
import { LoadingCategoryView, LoadingTransactionTable } from "@/components/ui/loading-states";

type Category = {
  id: number;
  name: string;
  binderId: number;
};

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  categoryId: number;
};

type TransactionData = {
  transactions: Transaction[];
  total: number;
};

interface CategoryViewProps {
  id: number;
}

export default function CategoryView({ id }: CategoryViewProps) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch category details
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${id}`],
  });

  // Fetch transactions
  const { data, isLoading } = useQuery<TransactionData>({
    queryKey: [`/api/categories/${id}/transactions`],
  });

  const transactions = data?.transactions || [];
  const total = data?.total || 0;

  // Create transaction
  const createTransaction = useMutation({
    mutationFn: async (data: Omit<Transaction, "id">) => {
      const res = await apiRequest("POST", "/api/transactions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${id}/transactions`] });
      // Also invalidate binder's categories to update total amounts
      if (category) {
        queryClient.invalidateQueries({ queryKey: [`/api/binders/${category.binderId}/categories`] });
      }
      setIsTransactionModalOpen(false);
      toast({
        title: "Transazione creata",
        description: "La transazione è stata creata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione della transazione",
        variant: "destructive",
      });
    },
  });

  // Update transaction
  const updateTransaction = useMutation({
    mutationFn: async (data: Transaction) => {
      const { id, ...updateData } = data;
      const res = await apiRequest("PUT", `/api/transactions/${id}`, updateData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${id}/transactions`] });
      // Also invalidate binder's categories to update total amounts
      if (category) {
        queryClient.invalidateQueries({ queryKey: [`/api/binders/${category.binderId}/categories`] });
      }
      setIsTransactionModalOpen(false);
      toast({
        title: "Transazione aggiornata",
        description: "La transazione è stata aggiornata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento della transazione",
        variant: "destructive",
      });
    },
  });

  // Delete transaction
  const deleteTransaction = useMutation({
    mutationFn: async (transactionId: number) => {
      const res = await apiRequest("DELETE", `/api/transactions/${transactionId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${id}/transactions`] });
      // Also invalidate binder's categories to update total amounts
      if (category) {
        queryClient.invalidateQueries({ queryKey: [`/api/binders/${category.binderId}/categories`] });
      }
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      toast({
        title: "Transazione eliminata",
        description: "La transazione è stata eliminata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione della transazione",
        variant: "destructive",
      });
    },
  });

  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTransaction = (data: Omit<Transaction, "id"> | Transaction) => {
    if ("id" in data) {
      updateTransaction.mutate(data as Transaction);
    } else {
      createTransaction.mutate({
        ...data,
        categoryId: id,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete !== null) {
      deleteTransaction.mutate(transactionToDelete);
    }
  };

  // Mostra l'animazione di caricamento durante il caricamento dei dati
  if (isLoading) {
    return (
      <div>
        <Header activeView="category" />
        <LoadingCategoryView />
      </div>
    );
  }
  
  // Messaggio di errore se la categoria non viene trovata
  if (!category && !isLoading) {
    return (
      <div>
        <Header activeView="category" />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-neutral-dark/70">Categoria non trovata</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <h2 className="text-2xl font-bold">{category?.name}</h2>
          <Button 
            onClick={handleAddTransaction}
            className="bg-secondary hover:bg-secondary/90 text-neutral-dark py-5 px-5 rounded-xl shadow-sm flex items-center transition-all transform hover:scale-[1.02] h-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuova Transazione
          </Button>
        </div>
        
        {/* Balance Card */}
        <Card className="bg-white rounded-2xl shadow-sm mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg text-neutral-dark/70 mb-2">Saldo Corrente</h3>
            <div className="flex items-center">
              <Wallet className="h-8 w-8 mr-3 text-primary" />
              <span className={`text-3xl font-bold ${total >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(total)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-white rounded-2xl shadow-sm mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Andamento</h3>
          <ChartView transactions={transactions} />
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Transazioni</h3>
          {isLoading ? (
            <LoadingTransactionTable />
          ) : (
            <TransactionTable
              transactions={transactions}
              isLoading={false}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onAddTransaction={handleAddTransaction}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={currentTransaction}
        isPending={createTransaction.isPending || updateTransaction.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Elimina Transazione"
        description="Sei sicuro di voler eliminare questa transazione? Questa azione non può essere annullata."
        isPending={deleteTransaction.isPending}
      />
    </div>
  );
}
