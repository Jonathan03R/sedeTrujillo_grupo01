import type { AlertaEmocional as DatosAlerta } from "@/models/ejercicio.model";
import { AvatarEmocion } from "./AvatarEmocion";
import { TONOS_EMOCION } from "./tonos-emocion";

export function AlertaEmocional({ emocion, titulo, detalle }: DatosAlerta) {
  return (
    <section
      aria-label="Tu último registro"
      className={`flex items-center gap-3 rounded-2xl border p-4 ${TONOS_EMOCION[emocion.id].suave}`}
    >
      <AvatarEmocion emocion={emocion} tamano="lg" />
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
        <p className="mt-0.5 text-xs text-slate-600">{detalle}</p>
      </div>
    </section>
  );
}
