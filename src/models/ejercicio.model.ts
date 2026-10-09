import type { Emocion } from "./emocion.model";

export type TipoEjercicio = "respiracion" | "relajacion" | "autorregulacion";

export const ETIQUETA_TIPO_EJERCICIO: Record<TipoEjercicio, string> = {
  respiracion: "Respiración",
  relajacion: "Relajación",
  autorregulacion: "Autorregulación",
};

export interface FaseRespiracion {
  etiqueta: string;
  segundos: number;
  accion: "inhalar" | "sostener" | "exhalar";
}

export interface Ejercicio {
  id: string;
  titulo: string;
  descripcion: string;
  duracionMinutos: number;
  tipo: TipoEjercicio;
  /** Solo los ejercicios de respiración guiada tienen fases. */
  fases?: readonly FaseRespiracion[];
  /** Instrucciones para los ejercicios que no son de respiración guiada. */
  pasos?: readonly string[];
}

/** Resumen del último registro emocional, mostrado al inicio de «Mi momento de calma». */
export interface AlertaEmocional {
  emocion: Emocion;
  titulo: string;
  detalle: string;
}

export interface MensajeApoyo {
  titulo: string;
  detalle: string;
  /** Si es true, la pantalla sugiere buscar apoyo profesional (regla de oro: derivar). */
  derivar: boolean;
}
