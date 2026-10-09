import type { EmocionId, Intensidad } from "./emocion.model";
import type { Ejercicio } from "./ejercicio.model";

export interface RegistroEmocional {
  id: number;
  emocion: EmocionId;
  intensidad: Intensidad;
  /** Fecha y hora del registro en formato ISO 8601. */
  registradoEn: string;
}

export type NuevoRegistroEmocional = Pick<RegistroEmocional, "emocion" | "intensidad">;

export type ResultadoRegistro =
  | { ok: true; recomendacion: Ejercicio }
  | { ok: false; error: string };
