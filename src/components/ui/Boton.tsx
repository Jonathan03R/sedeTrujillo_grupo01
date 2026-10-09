import type { ComponentPropsWithoutRef } from "react";

type Variante = "primario" | "secundario";

interface BotonProps extends ComponentPropsWithoutRef<"button"> {
  variante?: Variante;
}

const ESTILOS_VARIANTE: Record<Variante, string> = {
  primario: "bg-blue-600 text-white hover:bg-blue-700",
  secundario: "bg-blue-50 text-blue-700 hover:bg-blue-100",
};

export function Boton({ variante = "primario", className = "", type = "button", ...props }: BotonProps) {
  return (
    <button
      type={type}
      className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${ESTILOS_VARIANTE[variante]} ${className}`}
      {...props}
    />
  );
}
