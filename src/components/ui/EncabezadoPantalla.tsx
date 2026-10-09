import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface EncabezadoPantallaProps {
  titulo: string;
  /** Si se indica, muestra el botón de volver hacia esa ruta. */
  volverA?: string;
}

export function EncabezadoPantalla({ titulo, volverA }: EncabezadoPantallaProps) {
  return (
    <header className="relative flex min-h-10 items-center justify-center">
      {volverA && (
        <Link
          href={volverA}
          aria-label="Volver"
          className="absolute left-0 flex size-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </Link>
      )}
      <h1 className="text-lg font-semibold text-slate-900">{titulo}</h1>
    </header>
  );
}
