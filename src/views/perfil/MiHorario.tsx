import { Tarjeta } from "@/components/ui/Tarjeta";
import {
  ETIQUETA_EVALUACION,
  esClaseDeNoche,
  nombreDia,
  type ClaseHorario,
  type EvaluacionProxima,
} from "@/models/academico.model";

function textoDias(dias: number): string {
  if (dias === 0) return "hoy";
  if (dias === 1) return "mañana";
  return `en ${dias} días`;
}

/** Agrupa las clases (ya ordenadas por día y hora) por día de la semana. */
function porDia(clases: readonly ClaseHorario[]): { dia: number; clases: ClaseHorario[] }[] {
  const grupos: { dia: number; clases: ClaseHorario[] }[] = [];
  for (const clase of clases) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo?.dia === clase.diaSemana) ultimo.clases.push(clase);
    else grupos.push({ dia: clase.diaSemana, clases: [clase] });
  }
  return grupos;
}

interface MiHorarioProps {
  clases: readonly ClaseHorario[];
  evaluaciones: readonly EvaluacionProxima[];
}

/** El horario de clases de la persona y sus exámenes y tareas próximos: lo que la IA cruza con el uso del teléfono. */
export function MiHorario({ clases, evaluaciones }: MiHorarioProps) {
  return (
    <Tarjeta aria-labelledby="titulo-horario" className="space-y-4">
      <div>
        <h2 id="titulo-horario" className="text-sm font-semibold text-slate-900">
          Mi horario
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Pulso lo cruza con el uso de tu teléfono para entender cómo estás. Datos de demostración.
        </p>
      </div>

      {clases.length > 0 ? (
        <ul className="space-y-3">
          {porDia(clases).map(({ dia, clases: delDia }) => (
            <li key={dia}>
              <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{nombreDia(dia)}</h3>
              <ul className="mt-1 space-y-1">
                {delDia.map((clase) => (
                  <li key={`${clase.diaSemana}-${clase.horaInicio}`} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-slate-900">{clase.curso}</span>
                    <span className="flex shrink-0 items-center gap-2 text-slate-500">
                      {clase.horaInicio}–{clase.horaFin}
                      {esClaseDeNoche(clase) && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">Noche</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">Aún no hay clases cargadas.</p>
      )}

      <div>
        <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Exámenes y tareas</h3>
        {evaluaciones.length > 0 ? (
          <ul className="mt-1 space-y-1.5">
            {evaluaciones.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-2 text-sm">
                <span className="text-slate-900">
                  <span
                    className={`mr-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      e.tipo === "examen" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {ETIQUETA_EVALUACION[e.tipo]}
                  </span>
                  {e.curso} · {e.titulo}
                </span>
                <span className="shrink-0 text-slate-500">{textoDias(e.diasRestantes)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-slate-500">No hay exámenes ni tareas próximos.</p>
        )}
      </div>
    </Tarjeta>
  );
}
