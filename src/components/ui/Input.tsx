import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * Komponen Input dengan gaya Neobrutalism.
 * Border tebal, dan fokus state dengan shadow.
 */
export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-bold text-sm text-nb-dark">{label}</label>
      )}
      <input className={cn("nb-input", className)} {...props} />
    </div>
  );
}
