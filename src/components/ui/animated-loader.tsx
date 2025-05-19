import React from "react";
import { cn } from "@/lib/utils";
import { CircleDollarSign, Coins, Receipt, Wallet } from "lucide-react";

type LoaderVariant = "wallet" | "coin" | "receipt" | "dollar";

interface AnimatedLoaderProps {
  variant?: LoaderVariant;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
  message?: string;
}

export function AnimatedLoader({
  variant = "wallet",
  className,
  size = "md",
  color = "primary",
  message
}: AnimatedLoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-pink-400"
  };

  const getIconComponent = () => {
    const iconClassName = cn(
      "animate-bounce",
      sizeClasses[size],
      colorClasses[color]
    );

    switch (variant) {
      case "wallet":
        return <Wallet className={iconClassName} />;
      case "coin":
        return <Coins className={iconClassName} />;
      case "receipt":
        return <Receipt className={iconClassName} />;
      case "dollar":
        return <CircleDollarSign className={iconClassName} />;
      default:
        return <Wallet className={iconClassName} />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <div className="relative">
        {getIconComponent()}
        <span className="absolute top-0 right-0 w-3 h-3 bg-success/70 rounded-full animate-ping"></span>
      </div>
      {message && (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

export function LoginLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex space-x-2 mb-4">
        <AnimatedLoader variant="wallet" size="md" className="animate-bounce-slow" />
        <AnimatedLoader variant="dollar" size="md" className="animate-bounce-delayed" />
        <AnimatedLoader variant="coin" size="md" className="animate-bounce-slow" />
      </div>
      <p className="text-muted-foreground text-sm">Accesso in corso...</p>
    </div>
  );
}