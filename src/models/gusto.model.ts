/** Algo que le gusta a la persona («Básquet», «Dibujar»…). Se ve y edita en el Perfil. */
export interface Gusto {
  id: number;
  texto: string;
}

export const MAXIMO_GUSTOS = 10;
const LARGO_MINIMO = 2;
const LARGO_MAXIMO = 40;

/** Ideas para empezar; la persona puede escribir las suyas. */
export const SUGERENCIAS_GUSTOS: readonly string[] = [
  "Básquet",
  "Fútbol",
  "Vóley",
  "Música",
  "Dibujar",
  "Leer",
  "Videojuegos",
  "Cocinar",
  "Bailar",
  "Caminar",
  "Series",
  "Fotografía",
];

// Solo letras, números, espacios y signos simples: el texto viaja a la IA como dato y no debe poder llevar instrucciones.
const FORMATO_GUSTO = /^[\p{L}\p{N}][\p{L}\p{N} .,'+&-]*$/u;

/** El texto ya limpio (sin espacios de más), o null si no es un gusto válido. */
export function limpiarGusto(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const texto = valor.trim().replace(/\s+/g, " ");
  if (texto.length < LARGO_MINIMO || texto.length > LARGO_MAXIMO) return null;
  return FORMATO_GUSTO.test(texto) ? texto : null;
}
