export type EmocionId = "felicidad" | "tranquilidad" | "estres" | "tristeza" | "ansiedad" | "otra";
export type Intensidad = 1 | 2 | 3 | 4 | 5;

export interface Emocion {
  id: EmocionId;
  etiqueta: string;
  /** Ruta del ícono en /public (ver public/iconos/emociones). */
  icono: string;
  /** 1 = muy negativo, 5 = muy positivo. Sirve para graficar el progreso. */
  valor: Intensidad;
}

/** El ícono se amarra por nombre: la emoción «felicidad» usa public/iconos/emociones/felicidad.svg. */
export function rutaIconoEmocion(id: EmocionId): string {
  return `/iconos/emociones/${id}.svg`;
}

// Copia local del catálogo de la tabla emociones (db/seed.sql), para las pantallas que solo
// muestran registros ya guardados. La pantalla de registro lee las opciones de la base.
export const EMOCIONES: readonly Emocion[] = [
  { id: "felicidad", etiqueta: "Felicidad", icono: rutaIconoEmocion("felicidad"), valor: 5 },
  { id: "tranquilidad", etiqueta: "Tranquilidad", icono: rutaIconoEmocion("tranquilidad"), valor: 4 },
  { id: "estres", etiqueta: "Estrés", icono: rutaIconoEmocion("estres"), valor: 2 },
  { id: "tristeza", etiqueta: "Tristeza", icono: rutaIconoEmocion("tristeza"), valor: 1 },
  { id: "ansiedad", etiqueta: "Ansiedad", icono: rutaIconoEmocion("ansiedad"), valor: 1 },
  { id: "otra", etiqueta: "Otra", icono: rutaIconoEmocion("otra"), valor: 3 },
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
