import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

/**
 * Komponen Button dengan gaya Neobrutalism.
 * Memiliki efek tekan mekanis saat hover/active.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-nb-yellow text-nb-dark hover:bg-yellow-300",
    secondary: "bg-nb-cyan text-nb-dark hover:bg-cyan-300",
    danger: "bg-nb-pink text-white hover:bg-pink-400",
    ghost: "bg-white text-nb-dark hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-6 py-3",
  };

  return (
    <button
      className={cn(
        "nb-btn",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
