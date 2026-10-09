import { Tarjeta } from "@/components/ui/Tarjeta";
import type { ResumenDiaUso } from "@/models/uso-telefono.model";

const ALTO_BARRA_PX = 128;

function horas(minutos: number): string {
  return (minutos / 60).toFixed(1).replace(".0", "");
}

export function GraficoUsoSemanal({ dias }: { dias: readonly ResumenDiaUso[] }) {
  const maximo = Math.max(...dias.map((d) => d.minutoTotal), 1);
  const descripcion = dias
    .map((d) => `${d.etiqueta}: ${horas(d.minutoTotal)} h, ${d.minutoMadrugada} min de madrugada`)
    .join("; ");

  return (
    <Tarjeta aria-labelledby="titulo-grafico-uso">
      <h2 id="titulo-grafico-uso" className="text-sm font-semibold text-slate-900">
        Tiempo de pantalla por día
      </h2>

      <div role="img" aria-label={descripcion} className="mt-4 flex items-end justify-between gap-2">
        {dias.map((d) => {
          const alto = (d.minutoTotal / maximo) * ALTO_BARRA_PX;
          const altoMadrugada = (d.minutoMadrugada / maximo) * ALTO_BARRA_PX;
          return (
            <div key={d.dia} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-slate-500">{horas(d.minutoTotal)} h</span>
              <div className="flex w-full max-w-8 flex-col justify-end" style={{ height: ALTO_BARRA_PX }}>
                <div className="rounded-t-md bg-blue-400" style={{ height: alto - altoMadrugada }} />
                {altoMadrugada > 0 && <div className="bg-amber-400" style={{ height: altoMadrugada }} />}
              </div>
              <span className="text-xs text-slate-500">{d.etiqueta}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-blue-400" aria-hidden="true" /> Durante el día
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-amber-400" aria-hidden="true" /> De madrugada (antes de las 5:00)
        </span>
      </p>
    </Tarjeta>
  );
}
