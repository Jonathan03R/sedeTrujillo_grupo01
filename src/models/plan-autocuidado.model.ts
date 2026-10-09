import type { Intensidad } from "./emocion.model";

/**
 * Lo que la app indica para una emoción dentro de una franja de intensidad (tabla recomendaciones_ejercicios).
 * Cada emoción tiene 3 franjas (1-4, 5-7 y 8-10), cada una con su recomendación y su ejercicio, todos distintos.
 */
export interface PlanAutocuidado {
  desde: Intensidad;
  hasta: Intensidad;
  /** Recomendación base: la IA la personaliza, pero no cambia su idea. */
  recomendacion: string;
  /** Id del ejercicio del catálogo; null si esa franja solo lleva recomendación (sin ejercicio). */
  ejercicioId: string | null;
}
