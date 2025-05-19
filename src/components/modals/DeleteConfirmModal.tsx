import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isPending: boolean;
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  isPending
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="text-neutral-dark mb-4">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex space-x-3 mt-4">
          <Button 
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-neutral-light hover:bg-neutral-light/80 py-3 px-4 rounded-xl text-neutral-dark font-medium h-auto"
            disabled={isPending}
          >
            Annulla
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 bg-destructive hover:bg-destructive/90 py-3 px-4 rounded-xl font-bold h-auto"
            disabled={isPending}
          >
            {isPending ? "Eliminazione..." : "Elimina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
