// Autocuidado personalizado: la IA combina la emoción de hoy, su intensidad (1-10) y los gustos de la persona.
// Apoya la autorregulación; no diagnostica.

export const ICONOS_ALTERNATIVA = [
  "relajacion",
  "musica",
  "ideas",
  "escribir",
  "deporte",
  "caminar",
  "arte",
  "amistad",
  "naturaleza",
  "juego",
  "descanso",
] as const;

export type IconoAlternativa = (typeof ICONOS_ALTERNATIVA)[number];

/** Una idea corta de autocuidado, por ejemplo «Tira unos tiros libres con calma». */
export interface AlternativaAutocuidado {
  titulo: string;
  descripcion: string;
  icono: IconoAlternativa;
}

/** Lo que la IA preparó para el último registro emocional. */
export interface RecomendacionPersonalizada {
  /** Id del ejercicio del catálogo de la app (ver repositories/ejercicio.repository.ts). */
  ejercicioId: string;
  /** Mensaje corto y cálido para esta persona. */
  mensaje: string;
  alternativas: readonly AlternativaAutocuidado[];
}

export interface NuevaRecomendacionPersonalizada extends RecomendacionPersonalizada {
  registroEmocionalId: number;
  modelo: string;
}

export function esIconoAlternativa(valor: unknown): valor is IconoAlternativa {
  return ICONOS_ALTERNATIVA.some((icono) => icono === valor);
}

/** Ideas generales para cuando la IA no está disponible: la pantalla siempre se ve completa. */
export const ALTERNATIVAS_BASE: readonly AlternativaAutocuidado[] = [
  { titulo: "Relajación rápida", descripcion: "Suelta hombros y mandíbula durante un minuto.", icono: "relajacion" },
  { titulo: "Música tranquila", descripcion: "Pon una lista suave y respira al ritmo.", icono: "musica" },
  { titulo: "Ideas para sentirte mejor", descripcion: "Toma agua, abre la ventana y estírate un momento.", icono: "ideas" },
  { titulo: "Escribe lo que sientes", descripcion: "Anota en dos líneas lo que pasa por tu mente.", icono: "escribir" },
];
