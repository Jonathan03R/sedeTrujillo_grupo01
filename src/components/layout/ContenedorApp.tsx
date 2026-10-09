import { Suspense, type ReactNode } from "react";
import { BarraNavegacion } from "./BarraNavegacion";

interface ContenedorAppProps {
  children: ReactNode;
  /** false en la pantalla de registro, que se ve sin menú. */
  conNavegacion?: boolean;
}

// BarraNavegacion lee la ruta actual (usePathname), un dato que solo existe en tiempo de ejecución:
// va dentro de Suspense para que no bloquee el prerenderizado. Mientras llega, se reserva su espacio.
function EspacioNavegacion() {
  return <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-10 h-16 border-t border-slate-200 bg-white/95" />;
}

export function ContenedorApp({ children, conNavegacion = true }: ContenedorAppProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <main className={`flex-1 px-4 pt-6 ${conNavegacion ? "pb-28" : "pb-10"}`}>{children}</main>
      {conNavegacion && (
        <Suspense fallback={<EspacioNavegacion />}>
          <BarraNavegacion />
        </Suspense>
      )}
    </div>
  );
}
