import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/currency";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BinderCard from "@/components/BinderCard";
import BinderModal from "@/components/modals/BinderModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { LoadingDashboard } from "@/components/ui/loading-states";

type Binder = {
  id: number;
  name: string;
  userId: number;
  totalAmount: number;
  categoriesCount: number;
};

export default function Dashboard() {
  const [isBinderModalOpen, setIsBinderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBinder, setCurrentBinder] = useState<Binder | null>(null);
  const [binderToDelete, setBinderToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch all binders
  const { data: binders = [], isLoading } = useQuery<Binder[]>({
    queryKey: ["/api/binders"],
  });

  // Create new binder
  const createBinder = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/binders", { name });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/binders"] });
      setIsBinderModalOpen(false);
      toast({
        title: "Binder creato",
        description: "Il binder è stato creato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del binder",
        variant: "destructive",
      });
    },
  });

  // Update binder
  const updateBinder = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const res = await apiRequest("PUT", `/api/binders/${id}`, { name });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/binders"] });
      setIsBinderModalOpen(false);
      toast({
        title: "Binder aggiornato",
        description: "Il binder è stato aggiornato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del binder",
        variant: "destructive",
      });
    },
  });

  // Delete binder
  const deleteBinder = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/binders/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/binders"] });
      setIsDeleteModalOpen(false);
      setBinderToDelete(null);
      toast({
        title: "Binder eliminato",
        description: "Il binder è stato eliminato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del binder",
        variant: "destructive",
      });
    },
  });

  const handleAddBinder = () => {
    setCurrentBinder(null);
    setIsBinderModalOpen(true);
  };

  const handleEditBinder = (binder: Binder) => {
    setCurrentBinder(binder);
    setIsBinderModalOpen(true);
  };

  const handleDeleteBinder = (id: number) => {
    setBinderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBinder = (name: string) => {
    if (currentBinder) {
      updateBinder.mutate({ id: currentBinder.id, name });
    } else {
      createBinder.mutate(name);
    }
  };

  const handleConfirmDelete = () => {
    if (binderToDelete !== null) {
      deleteBinder.mutate(binderToDelete);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">I tuoi Binder</h2>
        <Button 
          onClick={handleAddBinder}
          className="bg-secondary hover:bg-secondary/90 text-neutral-dark py-5 px-5 rounded-xl shadow-sm flex items-center transition-all transform hover:scale-[1.02] h-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuovo Binder
        </Button>
      </div>

      {/* Binder Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-32"></div>
          ))}
        </div>
      ) : binders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {binders.map((binder) => (
            <BinderCard
              key={binder.id}
              binder={binder}
              onEdit={() => handleEditBinder(binder)}
              onDelete={() => handleDeleteBinder(binder.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nessun binder ancora!"
          description="Crea il tuo primo binder per iniziare a organizzare il tuo cash stuffing."
          buttonText="Crea un binder"
          onClick={handleAddBinder}
          icon="binder"
        />
      )}

      {/* Modals */}
      <BinderModal
        isOpen={isBinderModalOpen}
        onClose={() => setIsBinderModalOpen(false)}
        onSave={handleSaveBinder}
        binder={currentBinder}
        isPending={createBinder.isPending || updateBinder.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Elimina Binder"
        description="Sei sicuro di voler eliminare questo binder? Questa azione eliminerà anche tutte le categorie e le transazioni associate."
        isPending={deleteBinder.isPending}
      />
    </div>
  );
}
