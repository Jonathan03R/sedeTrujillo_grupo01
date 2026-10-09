import type { ReactNode } from "react";
import { BarraNavegacion } from "./BarraNavegacion";

interface ContenedorAppProps {
  children: ReactNode;
  /** false en la pantalla de registro, que se ve sin menú. */
  conNavegacion?: boolean;
}

export function ContenedorApp({ children, conNavegacion = true }: ContenedorAppProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <main className={`flex-1 px-4 pt-6 ${conNavegacion ? "pb-28" : "pb-10"}`}>{children}</main>
      {conNavegacion && <BarraNavegacion />}
    </div>
  );
}
