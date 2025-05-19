import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sparkles, Coins, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingCardProps {
  className?: string;
  title?: string;
}

export function LoadingBinderCard({ className, title = "Caricamento binder..." }: LoadingCardProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-lg border border-border p-8 bg-card/30 backdrop-blur-sm", 
      className
    )}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
        <LoadingSpinner variant="wallet" size="md" />
      </div>
      <h3 className="text-lg font-medium text-center animate-pulse">{title}</h3>
      <div className="w-full mt-4 space-y-2">
        <div className="w-3/4 h-3 mx-auto rounded-full bg-muted animate-pulse"></div>
        <div className="w-1/2 h-3 mx-auto rounded-full bg-muted animate-pulse"></div>
      </div>
    </div>
  );
}

export function LoadingCategoryCard({ className, title = "Caricamento categoria..." }: LoadingCardProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-lg border border-border p-8 bg-card/30 backdrop-blur-sm", 
      className
    )}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
        <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
      </div>
      <h3 className="text-lg font-medium text-center animate-pulse">{title}</h3>
      <div className="w-full mt-4 space-y-2">
        <div className="w-3/4 h-3 mx-auto rounded-full bg-muted animate-pulse"></div>
        <div className="w-1/2 h-3 mx-auto rounded-full bg-muted animate-pulse"></div>
      </div>
    </div>
  );
}

export function LoadingTransactionRow() {
  return (
    <div className="flex items-center p-3 space-x-4 border-b animate-pulse">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
        <Coins className="w-5 h-5 text-muted-foreground/40" />
      </div>
      <div className="flex-1">
        <div className="w-2/3 h-3 mb-2 rounded-full bg-muted"></div>
        <div className="w-1/3 h-2 rounded-full bg-muted"></div>
      </div>
      <div className="w-16 h-4 rounded-full bg-muted"></div>
    </div>
  );
}

export function LoadingTransactionTable() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="w-24 h-4 rounded-full bg-muted"></div>
        <div className="w-16 h-4 rounded-full bg-muted"></div>
      </div>
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingTransactionRow key={i} />
        ))}
      </div>
      <div className="flex items-center justify-between p-4 bg-muted/20">
        <div className="flex items-center space-x-2">
          <CircleDollarSign className="w-5 h-5 text-primary animate-pulse" />
          <div className="w-24 h-4 rounded-full bg-muted"></div>
        </div>
        <div className="w-20 h-5 rounded-full bg-muted"></div>
      </div>
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="w-48 h-8 rounded-full bg-muted animate-pulse mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingBinderCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function LoadingBinderView() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="w-48 h-8 rounded-full bg-muted animate-pulse mb-6"></div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-32 h-6 rounded-full bg-muted animate-pulse"></div>
        <div className="w-24 h-6 rounded-full bg-muted animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingCategoryCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function LoadingCategoryView() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="w-48 h-8 rounded-full bg-muted animate-pulse mb-6"></div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-32 h-6 rounded-full bg-muted animate-pulse"></div>
        <div className="w-24 h-6 rounded-full bg-muted animate-pulse"></div>
      </div>
      
      <LoadingTransactionTable />
    </div>
  );
}