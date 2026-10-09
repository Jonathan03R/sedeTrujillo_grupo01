interface IndicadorPasosProps {
  total: number;
  /** Paso en el que está la persona (empieza en 1). */
  actual: number;
}

// El tramo después del paso actual se muestra a medias: indica que ya empezó el camino.
const AVANCE_TRAMO_ACTUAL = "30%";

export function IndicadorPasos({ total, actual }: IndicadorPasosProps) {
  return (
    <ol aria-label={`Paso ${actual} de ${total}`} className="flex items-center gap-2">
      {Array.from({ length: total }, (_, indice) => {
        const numero = indice + 1;
        const alcanzado = numero <= actual;
        const avance = numero < actual ? "100%" : numero === actual ? AVANCE_TRAMO_ACTUAL : "0%";
        return (
          <li key={numero} className="flex items-center gap-2">
            <span
              className={`flex size-9 items-center justify-center rounded-full text-sm font-bold ${
                alcanzado ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {numero}
            </span>
            {numero < total && (
              <span aria-hidden="true" className="h-1 w-20 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full rounded-full bg-blue-500" style={{ width: avance }} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
