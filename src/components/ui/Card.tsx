import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "white" | "yellow" | "pink" | "cyan" | "green" | "orange" | "purple";
  interactive?: boolean;
  children: React.ReactNode;
}

/**
 * Komponen Card dengan gaya Neobrutalism.
 * Border tebal hitam, bayangan keras, dan pilihan warna latar cerah.
 * Props `interactive` menambahkan efek hover angkat & shadow membesar.
 */
export function Card({ color = "white", interactive = false, className, children, ...props }: CardProps) {
  const colorClasses = {
    white: "bg-white",
    yellow: "bg-nb-yellow",
    pink: "bg-nb-pink",
    cyan: "bg-nb-cyan",
    green: "bg-nb-green",
    orange: "bg-nb-orange",
    purple: "bg-nb-purple",
  };

  return (
    <div
      className={cn(
        "nb-card p-6",
        colorClasses[color],
        interactive && "nb-card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
