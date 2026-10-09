"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ITEMS_NAVEGACION } from "./items-navegacion";

export function BarraNavegacion() {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {ITEMS_NAVEGACION.map(({ href, etiqueta, icono: Icono, rellenar }) => {
          const activo = ruta.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  activo ? "font-semibold text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icono
                  className={`size-5 ${activo ? (rellenar ? "fill-current" : "stroke-[2.75]") : ""}`}
                  aria-hidden="true"
                />
                {etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
