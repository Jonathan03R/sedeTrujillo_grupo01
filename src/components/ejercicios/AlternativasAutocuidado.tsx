import type { AlternativaAutocuidado } from "@/models/autocuidado.model";
import { COLORES_ALTERNATIVA, ICONO_POR_ALTERNATIVA } from "./iconos-alternativa";

/** «También puedes…»: ideas cortas de autocuidado, a la medida de la emoción, la intensidad y los gustos de hoy. */
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
            <li
              key={alternativa.titulo}
              className={`flex flex-col gap-2 rounded-2xl p-3.5 ${COLORES_ALTERNATIVA[i % COLORES_ALTERNATIVA.length]}`}
            >
              <Icono className="size-7" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-900">{alternativa.titulo}</h3>
              <p className="text-xs leading-snug text-slate-600">{alternativa.descripcion}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
