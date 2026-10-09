import { Clock, Heart } from "lucide-react";
import { ICONO_POR_TIPO } from "@/components/ejercicios/iconos-ejercicio";
import { EnlaceBoton } from "@/components/ui/EnlaceBoton";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { Ejercicio } from "@/models/ejercicio.model";

interface EjercicioDestacadoProps {
  ejercicio: Ejercicio;
  /** Mensaje de la IA para esta persona; si no hay, se muestra la descripción del ejercicio. */
  mensaje: string | null;
}

/** El ejercicio de autorregulación de hoy, con un botón para empezarlo en «Mi momento de calma». */
export function EjercicioDestacado({ ejercicio, mensaje }: EjercicioDestacadoProps) {
  const Icono = ICONO_POR_TIPO[ejercicio.tipo];

  return (
    <Tarjeta aria-labelledby="ejercicio-de-hoy" className="space-y-4 rounded-3xl border-blue-100 bg-blue-50/60 p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-blue-500"
        >
          <Icono className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="ejercicio-de-hoy" className="text-lg leading-tight font-bold text-slate-900">
            {ejercicio.titulo}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="flex items-center gap-1 text-sm text-slate-500">
              Un momento para ti <Heart className="size-3.5 fill-pink-400 text-pink-400" aria-hidden="true" />
            </p>
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              <Clock className="size-3.5" aria-hidden="true" />
              {ejercicio.duracionMinutos} min
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-700">{mensaje ?? ejercicio.descripcion}</p>

      <EnlaceBoton href="/ejercicios" tamano="grande">
        {ejercicio.fases ? "Respiración guiada" : "Empezar ejercicio"}
      </EnlaceBoton>
    </Tarjeta>
  );
}
