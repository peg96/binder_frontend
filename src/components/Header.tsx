import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  activeView: "dashboard" | "binder" | "category";
}

export default function Header({ activeView }: HeaderProps) {
  const { logout } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Estrai l'ID dal percorso per i binder
  let binderId: number | null = null;
  if (location.startsWith("/binder/")) {
    const id = location.split("/")[2];
    if (id) binderId = parseInt(id);
  }
  
  // Estrai l'ID dal percorso per le categorie
  let categoryId: number | null = null;
  if (location.startsWith("/category/")) {
    const id = location.split("/")[2];
    if (id) categoryId = parseInt(id);
  }

  // Dati del binder
  const { data: binderData } = useQuery({
    queryKey: binderId ? ["/api/binders", binderId] : ["/api/binders", "none"],
    enabled: !!binderId && activeView === "binder",
    queryFn: async () => {
      if (!binderId) return null;
      const response = await fetch(`/api/binders/${binderId}`);
      if (!response.ok) throw new Error("Errore nel caricamento del binder");
      return response.json();
    }
  });

  // Dati categoria
  const { data: categoryData } = useQuery({
    queryKey: categoryId ? ["/api/categories", categoryId] : ["/api/categories", "none"],
    enabled: !!categoryId && activeView === "category",
    queryFn: async () => {
      if (!categoryId) return null;
      const response = await fetch(`/api/categories/${categoryId}`);
      if (!response.ok) throw new Error("Errore nel caricamento della categoria");
      return response.json();
    }
  });

  // Dati del binder della categoria
  const categoryBinderId = categoryData?.binderId;
  const { data: categoryBinderData } = useQuery({
    queryKey: categoryBinderId ? ["/api/binders", categoryBinderId] : ["/api/binders", "none-cat"],
    enabled: !!categoryBinderId && activeView === "category",
    queryFn: async () => {
      if (!categoryBinderId) return null;
      const response = await fetch(`/api/binders/${categoryBinderId}`);
      if (!response.ok) throw new Error("Errore nel caricamento del binder");
      return response.json();
    }
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-neutral-dark">GestoreBinder</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-lg text-neutral-dark/70 hidden sm:block">
            {activeView === "dashboard" && "Dashboard"}
            {activeView === "binder" && binderData?.name}
            {activeView === "category" && categoryData?.name}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-neutral-dark hover:text-primary transition"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-neutral-light px-4 py-2">
        <div className="container mx-auto flex space-x-2 overflow-x-auto">
          <Link href="/dashboard">
            <Button 
              variant={activeView === "dashboard" ? "default" : "ghost"}
              className={`whitespace-nowrap rounded-t-xl rounded-b-none ${activeView === "dashboard" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
            >
              <span className="mr-2">📋</span>Dashboard
            </Button>
          </Link>

          {activeView === "binder" && binderData && (
            <Button 
              variant="default"
              className="whitespace-nowrap rounded-t-xl rounded-b-none bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span className="mr-2">📁</span>{binderData.name}
            </Button>
          )}

          {activeView === "category" && categoryData && (
            <>
              {categoryBinderData && (
                <Link href={`/binder/${categoryBinderData.id}`}>
                  <Button 
                    variant="ghost"
                    className="whitespace-nowrap rounded-t-xl rounded-b-none"
                  >
                    <span className="mr-2">📁</span>{categoryBinderData.name}
                  </Button>
                </Link>
              )}
              <Button 
                variant="default"
                className="whitespace-nowrap rounded-t-xl rounded-b-none bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <span className="mr-2">📂</span>{categoryData.name}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
