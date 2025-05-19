import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  category: {
    id: number;
    name: string;
  } | null;
  isPending: boolean;
}

export default function CategoryModal({ isOpen, onClose, onSave, category, isPending }: CategoryModalProps) {
  const [name, setName] = useState("");

  // Quando la categoria cambia o la modale si apre, aggiorna lo stato
  useEffect(() => {
    if (isOpen) {
      setName(category?.name || "");
    }
  }, [isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            {category ? "Modifica Categoria" : "Nuova Categoria"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="categoryName" className="block text-lg font-medium mb-2">
              Nome della Categoria
            </Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-6 text-lg rounded-2xl border-2 border-primary/50 focus:border-primary focus:ring-primary/30 h-auto"
              placeholder="Es: Spesa"
              required
              autoFocus
            />
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
              disabled={isPending || !name.trim()}
            >
              {isPending ? "Salvataggio..." : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
