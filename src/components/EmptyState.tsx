import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon: "binder" | "category" | "transaction";
}

export default function EmptyState({ title, description, buttonText, onClick, icon }: EmptyStateProps) {
  // Seleziona l'icona appropriata in base al tipo
  const renderIcon = () => {
    switch (icon) {
      case "binder":
        return (
          <svg className="w-24 h-24 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6h4a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6Z" />
            <path d="M6 6h4a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6Z" />
            <path d="M10 6h4a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V6Z" />
            <path d="M14 6h4a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V6Z" />
          </svg>
        );
      case "category":
        return (
          <svg className="w-24 h-24 text-accent mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
            <path d="M10 3v10" />
            <path d="M2 8h10" />
            <path d="M14 14v6a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1Z" />
            <path d="M19 14v8" />
            <path d="M14 17.5h8" />
          </svg>
        );
      case "transaction":
        return (
          <svg className="w-24 h-24 text-secondary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-neutral-light/50 rounded-2xl p-6 shadow-sm text-center">
      {renderIcon()}
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-neutral-dark/70 mb-4">{description}</p>
      <Button 
        onClick={onClick}
        className="bg-secondary hover:bg-secondary/90 text-neutral-dark py-3 px-5 rounded-xl shadow-sm inline-flex items-center transition-all transform hover:scale-[1.02]"
      >
        <Plus className="h-5 w-5 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
}
