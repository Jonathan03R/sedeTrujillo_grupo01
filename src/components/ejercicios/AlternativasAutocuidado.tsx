import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { AlternativaAutocuidado } from "@/models/autocuidado.model";
import { COLORES_ALTERNATIVA, ICONO_POR_ALTERNATIVA } from "./iconos-alternativa";

/**
 * «También puedes…»: ideas de autocuidado a la medida de la emoción, la intensidad y los gustos de hoy.
 * Cada tarjeta es un enlace con solo ícono y título; el detalle está en su pantalla (/ideas/[icono]).
 */
export function AlternativasAutocuidado({ alternativas }: { alternativas: readonly AlternativaAutocuidado[] }) {
  return (
    <section aria-labelledby="tambien-puedes">
      <h2 id="tambien-puedes" className="mb-3 text-sm font-semibold text-slate-900">
        También puedes…
      </h2>
      <ul className="grid grid-cols-2 gap-3">
        {alternativas.map((alternativa, i) => {
          const Icono = ICONO_POR_ALTERNATIVA[alternativa.icono];
          return (
            <li key={alternativa.titulo}>
              <Link
                href={`/ideas/${alternativa.icono}`}
                className={`flex h-full min-h-28 flex-col justify-between gap-3 rounded-2xl p-3.5 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.98] ${COLORES_ALTERNATIVA[i % COLORES_ALTERNATIVA.length]}`}
              >
                <Icono className="size-7" aria-hidden="true" />
                <span className="flex items-end justify-between gap-2">
                  <span className="text-sm leading-snug font-semibold text-slate-900">{alternativa.titulo}</span>
                  <ChevronRight className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
