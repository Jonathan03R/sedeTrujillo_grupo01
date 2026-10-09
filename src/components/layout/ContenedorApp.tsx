import type { ReactNode } from "react";
import { BarraNavegacion } from "./BarraNavegacion";

export function ContenedorApp({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <main className="flex-1 px-4 pt-6 pb-28">{children}</main>
      <BarraNavegacion />
    </div>
  );
}
