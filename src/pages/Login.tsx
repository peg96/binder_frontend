import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AnimatedLoader, LoginLoader } from "@/components/ui/animated-loader";

const loginSchema = z.object({
  username: z.string().min(1, "Il nome utente è obbligatorio"),
  password: z.string().min(1, "La password è obbligatoria"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "USER",
      password: "12345",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    
    try {
      await login(data.username, data.password);
      navigate("/dashboard");
      toast({
        title: "Login effettuato",
        description: "Bentornato nel tuo GestoreBinder!",
      });
    } catch (err) {
      setError("Credenziali non valide. Riprova!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/30 to-secondary/30">
      <Card className="w-full max-w-md bg-white rounded-[2rem] shadow-medium">
        <CardContent className="pt-8 px-8 pb-8">
          <div className="text-center mb-8">
            <div className="w-28 h-28 mx-auto rounded-full shadow-sm overflow-hidden bg-primary/30 flex items-center justify-center">
              <svg 
                className="h-16 w-16 text-primary"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                <line x1="12" y1="22" x2="12" y2="13"></line>
                <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mt-4 text-neutral-dark">GestoreBinder</h1>
            <p className="text-lg mt-2 text-neutral-dark/80">La tua app per il cash stuffing</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Nome utente</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="px-5 py-6 text-lg rounded-2xl border-2 border-primary/50 focus:border-primary focus:ring-primary/30"
                        placeholder="Inserisci il tuo username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="px-5 py-6 text-lg rounded-2xl border-2 border-primary/50 focus:border-primary focus:ring-primary/30"
                        placeholder="Inserisci la tua password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-neutral-dark font-bold py-6 px-6 rounded-2xl shadow-sm transition-all transform hover:scale-[1.02] text-lg h-auto"
                >
                  Accedi
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-destructive/20 text-destructive border border-destructive/30 rounded-xl">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
