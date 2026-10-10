import { Flame } from "lucide-react";
import type { Racha } from "@/repositories/racha.repository";

const LETRAS = ["L", "M", "X", "J", "V", "S", "D"];

/**
 * Racha semanal compacta: una franja delgada con los siete días y un fuego por cada día con registro.
 * Tonos cálidos y suaves, pensados para la salud mental: sin colores agresivos ni recargos visuales.
 */
export function TarjetaRacha({ racha }: { racha: Racha }) {
  return (
    <section aria-labelledby="titulo-racha" className="rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="size-4 text-orange-500" aria-hidden="true" />
          <h2 id="titulo-racha" className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
            Racha semanal
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          <span className="text-sm font-bold text-slate-800">{racha.actual}</span> {racha.actual === 1 ? "día" : "días"} · mejor {racha.mejor}
        </p>
      </div>

      <ol className="mt-2.5 flex items-center justify-between gap-1">
        {racha.semana.map((d, i) => (
          <li key={d.dia} className="flex flex-col items-center gap-1">
            <span
              aria-label={`${LETRAS[i]}: ${d.conRegistro ? "con registro" : d.esHoy ? "hoy" : "sin registro"}`}
              className={`flex size-7 items-center justify-center rounded-full ${
                d.conRegistro
                  ? "bg-orange-100 text-orange-500"
                  : d.esHoy
                    ? "border border-dashed border-orange-300 text-orange-300"
                    : "bg-white/70 text-slate-300"
              }`}
            >
              {d.conRegistro ? <Flame className="size-3.5 fill-current" aria-hidden="true" /> : null}
            </span>
            <span className={`text-[10px] font-semibold ${d.esHoy ? "text-orange-600" : "text-slate-400"}`}>{LETRAS[i]}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
