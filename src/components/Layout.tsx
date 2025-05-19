import { ReactNode, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const [isDashboard] = useRoute("/dashboard");
  const [isBinder] = useRoute("/binder/:id");
  const [isCategory] = useRoute("/category/:id");

  useEffect(() => {
    if (!isAuthenticated && location !== "/") {
      navigate("/");
    }
  }, [isAuthenticated, location, navigate]);

  // Determina la vista corrente
  const determineActiveView = () => {
    if (isDashboard) return "dashboard";
    if (isBinder) return "binder";
    if (isCategory) return "category";
    return "dashboard";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeView={determineActiveView()} />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
