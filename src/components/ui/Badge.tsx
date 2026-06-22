import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "income" | "expense" | "default";
  children: React.ReactNode;
}

/**
 * Komponen Badge untuk label tipe transaksi atau kategori.
 */
export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  const variantClasses = {
    income: "bg-nb-green text-nb-dark",
    expense: "bg-nb-pink text-white",
    default: "bg-nb-gray text-nb-dark",
  };

  return (
    <span className={cn("nb-badge", variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}
