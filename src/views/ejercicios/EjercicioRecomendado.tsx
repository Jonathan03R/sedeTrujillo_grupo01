import { CircleCheck, Clock } from "lucide-react";
import { ICONO_POR_TIPO } from "@/components/ejercicios/iconos-ejercicio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { Ejercicio } from "@/models/ejercicio.model";

export function EjercicioRecomendado({ ejercicio }: { ejercicio: Ejercicio }) {
  const Icono = ICONO_POR_TIPO[ejercicio.tipo];

  return (
    <section aria-labelledby="ejercicio-recomendado">
      <h2
        id="ejercicio-recomendado"
        className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900"
      >
        <CircleCheck className="size-4 text-emerald-500" aria-hidden="true" />
        Ejercicio recomendado
      </h2>
      <Tarjeta className="flex gap-4">
        <div
          aria-hidden="true"
          className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
        >
          <Icono className="size-10" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{ejercicio.titulo}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Clock className="size-3.5" aria-hidden="true" />
            {ejercicio.duracionMinutos} minutos
          </p>
          <p className="mt-2 text-sm text-slate-600">{ejercicio.descripcion}</p>
        </div>
      </Tarjeta>
    </section>
  );
}
