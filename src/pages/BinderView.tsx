import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/currency";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import CategoryModal from "@/components/modals/CategoryModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import EmptyState from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { LoadingBinderView, LoadingCategoryCard } from "@/components/ui/loading-states";
import Header from "@/components/Header";

type Binder = {
  id: number;
  name: string;
  userId: number;
  totalAmount: number;
  categoriesCount: number;
};

type Category = {
  id: number;
  name: string;
  binderId: number;
  totalAmount: number;
  transactionsCount: number;
};

interface BinderViewProps {
  id: number;
}

export default function BinderView({ id }: BinderViewProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch binder details
  const { data: binder } = useQuery<Binder>({
    queryKey: ["/api/binders", id],
    queryFn: async () => {
      const response = await fetch(`/api/binders/${id}`);
      if (!response.ok) {
        throw new Error("Errore nel recupero del binder");
      }
      return response.json();
    }
  });

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/binders/categories", id],
    queryFn: async () => {
      const response = await fetch(`/api/binders/${id}/categories`);
      if (!response.ok) {
        throw new Error("Errore nel recupero delle categorie");
      }
      return response.json();
    }
  });

  // Create category
  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/categories", { name, binderId: id });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la creazione della categoria");
      }
      return await res.json();
    },
    onSuccess: () => {
      // Invalida la query con la chiave aggiornata
      queryClient.invalidateQueries({ queryKey: ["/api/binders/categories", id] });
      setIsCategoryModalOpen(false);
      toast({
        title: "Categoria creata",
        description: "La categoria è stata creata con successo",
      });
    },
    onError: (error) => {
      console.error("Errore nella creazione della categoria:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione della categoria",
        variant: "destructive",
      });
    },
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const res = await apiRequest("PUT", `/api/categories/${id}`, { name });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/binders/${id}/categories`] });
      setIsCategoryModalOpen(false);
      toast({
        title: "Categoria aggiornata",
        description: "La categoria è stata aggiornata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento della categoria",
        variant: "destructive",
      });
    },
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (categoryId: number) => {
      const res = await apiRequest("DELETE", `/api/categories/${categoryId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/binders/${id}/categories`] });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      toast({
        title: "Categoria eliminata",
        description: "La categoria è stata eliminata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione della categoria",
        variant: "destructive",
      });
    },
  });

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCategory = (name: string) => {
    if (currentCategory) {
      updateCategory.mutate({ id: currentCategory.id, name });
    } else {
      createCategory.mutate(name);
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete !== null) {
      deleteCategory.mutate(categoryToDelete);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category/${categoryId}`);
  };

  // Mostra l'animazione di caricamento durante il caricamento dei dati
  if (isLoading) {
    return (
      <div>
        <Header activeView="binder" />
        <LoadingBinderView />
      </div>
    );
  }

  // Messaggio di errore se il binder non viene trovato
  if (!binder && !isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-neutral-dark/70">Binder non trovato</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          {binder?.name}
          {binder && (
            <Badge className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${binder.totalAmount >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              <span className="mr-1">💰</span>
              {formatCurrency(binder.totalAmount)}
            </Badge>
          )}
        </h2>
        <Button 
          onClick={handleAddCategory}
          className="bg-secondary hover:bg-secondary/90 text-neutral-dark py-5 px-5 rounded-xl shadow-sm flex items-center transition-all transform hover:scale-[1.02] h-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuova Categoria
        </Button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-32"></div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category.id)}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => handleDeleteCategory(category.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nessuna categoria in questo binder!"
          description="Crea la tua prima categoria per iniziare a tracciare le tue transazioni."
          buttonText="Crea una categoria"
          onClick={handleAddCategory}
          icon="category"
        />
      )}

      {/* Modals */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={currentCategory}
        isPending={createCategory.isPending || updateCategory.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Elimina Categoria"
        description="Sei sicuro di voler eliminare questa categoria? Questa azione eliminerà anche tutte le transazioni associate."
        isPending={deleteCategory.isPending}
      />
    </div>
  );
}
