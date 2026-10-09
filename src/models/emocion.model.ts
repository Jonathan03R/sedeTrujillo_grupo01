export type EmocionId = "tranquilidad" | "felicidad" | "estres" | "tristeza" | "ansiedad";
export type Intensidad = 1 | 2 | 3 | 4 | 5;

export interface Emocion {
  id: EmocionId;
  etiqueta: string;
  emoji: string;
  /** 1 = muy negativo, 5 = muy positivo. Sirve para graficar el progreso. */
  valor: Intensidad;
}

export const EMOCIONES: readonly Emocion[] = [
  { id: "felicidad", etiqueta: "Felicidad", emoji: "😄", valor: 5 },
  { id: "tranquilidad", etiqueta: "Tranquilidad", emoji: "😌", valor: 4 },
  { id: "estres", etiqueta: "Estrés", emoji: "😣", valor: 2 },
  { id: "tristeza", etiqueta: "Tristeza", emoji: "😢", valor: 1 },
  { id: "ansiedad", etiqueta: "Ansiedad", emoji: "😰", valor: 1 },
];

export const INTENSIDADES: readonly Intensidad[] = [1, 2, 3, 4, 5];

export function esEmocionId(valor: unknown): valor is EmocionId {
  return EMOCIONES.some((emocion) => emocion.id === valor);
}

export function esIntensidad(valor: unknown): valor is Intensidad {
  return INTENSIDADES.some((intensidad) => intensidad === valor);
}

export function buscarEmocion(id: EmocionId): Emocion {
  const emocion = EMOCIONES.find((e) => e.id === id);
  if (!emocion) throw new Error(`Emoción desconocida: ${id}`);
  return emocion;
}
