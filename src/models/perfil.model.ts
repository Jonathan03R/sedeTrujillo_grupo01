import type { NivelAtencion } from "./uso-telefono.model";

/** Resumen de lo que Pulso ha recopilado de la persona, para mostrarlo en el Perfil con transparencia. */
export interface DatosRecopilados {
  /** Tiempo de pantalla por día en los últimos 7 días, o null si no hay datos de uso. */
  promedioDiario: string | null;
  madrugada: string;
  aperturaPromedio: number;
  ultimoAnalisis: { cuando: string; nivel: NivelAtencion } | null;
  registrosEmocionales: number;
  respuestas: number;
  gustos: number;
  /** La pregunta que la IA dejó pendiente de responder, si hay una. */
  preguntaPendiente: string | null;
}
