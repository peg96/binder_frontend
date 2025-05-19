import { useLocation } from "wouter";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

interface BinderCardProps {
  binder: {
    id: number;
    name: string;
    totalAmount: number;
    categoriesCount: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export default function BinderCard({ binder, onEdit, onDelete }: BinderCardProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/binder/${binder.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Card 
      className="bg-white rounded-2xl shadow-sm transition-all hover:shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{binder.name}</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-dark/70 hover:text-accent rounded-full transition h-9 w-9"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-dark/70 hover:text-destructive rounded-full transition h-9 w-9"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-neutral-dark/70">Categorie: </span>
            <span className="font-medium">{binder.categoriesCount}</span>
          </div>
          <Badge className={`${binder.totalAmount >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'} px-3 py-1 rounded-full text-sm font-medium`}>
            <span className="mr-1">💰</span>
            {formatCurrency(binder.totalAmount)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
