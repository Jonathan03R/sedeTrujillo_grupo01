// Horario académico de la persona: clases, exámenes y tareas. La IA lo cruza con el uso del teléfono
// para entender cambios (por ejemplo, uso de madrugada con un examen cerca) y elegir una pregunta.

/** Índice 0 = día 1 = lunes (igual que dia_semana en la base). */
export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

export function nombreDia(diaSemana: number): string {
  return DIAS_SEMANA[diaSemana - 1] ?? "";
}

export interface ClaseHorario {
  curso: string;
  /** 1 = lunes ... 7 = domingo. */
  diaSemana: number;
  /** «19:00» */
  horaInicio: string;
  horaFin: string;
}

/** Desde esta hora una clase cuenta como «de noche». */
export const HORA_INICIO_NOCHE = 18;

export function esClaseDeNoche(clase: Pick<ClaseHorario, "horaInicio">): boolean {
  return Number(clase.horaInicio.slice(0, 2)) >= HORA_INICIO_NOCHE;
}

export type TipoEvaluacion = "examen" | "tarea";

export const ETIQUETA_EVALUACION: Record<TipoEvaluacion, string> = {
  examen: "Examen",
  tarea: "Tarea",
};

export interface Evaluacion {
  id: number;
  tipo: TipoEvaluacion;
  curso: string;
  titulo: string;
  /** Día de la fecha, en formato AAAA-MM-DD. */
  fecha: string;
}

/** Cuántos días faltan para una evaluación (0 = hoy). */
export interface EvaluacionProxima extends Evaluacion {
  diasRestantes: number;
}

/** Solo se consideran las evaluaciones de las próximas semanas. */
export const DIAS_EVALUACIONES_PROXIMAS = 21;
