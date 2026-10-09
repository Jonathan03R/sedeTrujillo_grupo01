import { INTENSIDADES, INTENSIDAD_MAXIMA, type Emocion, type Intensidad } from "@/models/emocion.model";
import { IconoEmocion } from "./IconoEmocion";
import { TONOS_EMOCION } from "./tonos-emocion";

const RADIO_ANILLO = 44;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO_ANILLO;

/** «Tu estado actual»: la emoción de hoy dentro de un anillo, con su intensidad en una barra de 10 tramos. */
export function TarjetaEstadoActual({ emocion, intensidad }: { emocion: Emocion; intensidad: Intensidad }) {
  const tono = TONOS_EMOCION[emocion.id];

  return (
    <section aria-label="Tu estado actual" className={`flex items-center gap-4 rounded-3xl border p-4 ${tono.suave}`}>
      <div aria-hidden="true" className="relative size-24 shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={RADIO_ANILLO} fill="none" stroke={tono.relleno} strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={RADIO_ANILLO}
            fill="none"
            stroke={tono.trazo}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(intensidad / INTENSIDAD_MAXIMA) * CIRCUNFERENCIA} ${CIRCUNFERENCIA}`}
          />
        </svg>
        <IconoEmocion emocion={emocion} className="absolute inset-0 m-auto size-14" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">Tu estado actual</p>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{emocion.etiqueta}</h2>
        <p className="mt-1 text-sm font-medium text-slate-700">
          Nivel <span className="rounded-full bg-white/70 px-2 py-0.5 font-bold text-slate-900">{intensidad}</span> /{" "}
          {INTENSIDAD_MAXIMA}
        </p>
        <div
          role="img"
          aria-label={`Intensidad ${intensidad} de ${INTENSIDAD_MAXIMA}`}
          className="mt-2 flex gap-0.5"
        >
          {INTENSIDADES.map((nivel) => (
            <span
              key={nivel}
              className={`h-2 flex-1 first:rounded-l-full last:rounded-r-full ${nivel <= intensidad ? tono.insignia : "bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
