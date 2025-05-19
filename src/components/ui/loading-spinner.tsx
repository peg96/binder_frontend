import React from "react";
import { cn } from "@/lib/utils";
import { RotateCw, Heart, CreditCard, Wallet } from "lucide-react";

type SpinnerVariant = "default" | "heart" | "wallet" | "card";

interface LoadingSpinnerProps {
  variant?: SpinnerVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  variant = "default",
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const getIcon = () => {
    switch (variant) {
      case "heart":
        return (
          <Heart
            className={cn(
              "animate-pulse text-pink-500",
              sizeClasses[size]
            )}
          />
        );
      case "wallet":
        return (
          <Wallet
            className={cn(
              "animate-bounce text-teal-500",
              sizeClasses[size]
            )}
          />
        );
      case "card":
        return (
          <CreditCard
            className={cn(
              "animate-pulse text-purple-500",
              sizeClasses[size]
            )}
          />
        );
      default:
        return (
          <RotateCw
            className={cn(
              "animate-spin text-primary",
              sizeClasses[size]
            )}
          />
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {getIcon()}
      {text && (
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  );
}

export function FullPageLoading({ text = "Caricamento..." }: { text?: string }) {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center">
      <LoadingSpinner size="lg" variant="wallet" />
      <p className="mt-4 text-lg font-medium text-muted-foreground">{text}</p>
    </div>
  );
}