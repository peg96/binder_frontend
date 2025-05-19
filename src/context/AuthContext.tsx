import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica lo stato di autenticazione all'avvio
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica se l'utente è autenticato tentando di fare una richiesta protetta
        const res = await fetch("/api/binders", {
          credentials: "include",
        });
        
        setIsAuthenticated(res.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      const res = await apiRequest("POST", "/api/login", { username, password });
      
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante il login");
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/logout", {});
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Errore durante il logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
