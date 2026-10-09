import type { EmocionId, Intensidad } from "./emocion.model";

/** Pregunta fija de la pantalla de entrada. Sus respuestas posibles son las emociones del catálogo (tabla emociones). */
export const PREGUNTA_REGISTRO = "¿Qué emoción sientes?";

export interface RegistroEmocional {
  id: number;
  emocion: EmocionId;
  intensidad: Intensidad;
  /** Fecha y hora del registro en formato ISO 8601. */
  registradoEn: string;
}

export type NuevoRegistroEmocional = Pick<RegistroEmocional, "emocion" | "intensidad">;

/** Lo único que la acción de registrar devuelve: si todo sale bien, redirige a /inicio. */
export interface ErrorRegistro {
  error: string;
}
