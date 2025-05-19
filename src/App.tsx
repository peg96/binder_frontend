import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import BinderView from "@/pages/BinderView";
import CategoryView from "@/pages/CategoryView";
import Layout from "@/components/Layout";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard">
        {() => (
          <Layout>
            <Dashboard />
          </Layout>
        )}
      </Route>
      <Route path="/binder/:id">
        {(params) => (
          <Layout>
            <BinderView id={parseInt(params.id)} />
          </Layout>
        )}
      </Route>
      <Route path="/category/:id">
        {(params) => (
          <Layout>
            <CategoryView id={parseInt(params.id)} />
          </Layout>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
