import type { ComponentPropsWithoutRef } from "react";

export function Tarjeta({ className = "", ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    />
  );
}
