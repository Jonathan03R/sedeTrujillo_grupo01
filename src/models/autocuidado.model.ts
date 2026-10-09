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

/** Actividades por las que la IA puede buscar un lugar cercano (OpenStreetMap). */
export const ACTIVIDADES_LUGAR = ["basquet", "futbol", "voley", "parque", "gimnasio"] as const;
export type ActividadLugar = (typeof ACTIVIDADES_LUGAR)[number];

export const ETIQUETA_ACTIVIDAD: Record<ActividadLugar, string> = {
  basquet: "Cancha de básquet",
  futbol: "Cancha de fútbol",
  voley: "Cancha de vóley",
  parque: "Parque",
  gimnasio: "Gimnasio",
};

/** Un lugar real que encontró la herramienta de búsqueda. */
export interface Lugar {
  /** Id en OpenStreetMap, por ejemplo «way/520349942». */
  id: string;
  nombre: string;
  actividad: ActividadLugar;
  distanciaMetros: number;
  latitud: number;
  longitud: number;
}

/** Un video real que encontró la herramienta de búsqueda (YouTube). */
export interface Video {
  /** Los 11 caracteres de youtube.com/watch?v=… */
  videoId: string;
  titulo: string;
  canal: string;
  duracionMinutos: number | null;
}

/** El lugar que la IA eligió, con el motivo (en lenguaje cálido, sin diagnosticar). */
export interface LugarRecomendado extends Omit<Lugar, "id"> {
  motivo: string;
}

export interface VideoRecomendado extends Video {
  motivo: string;
}

/** Lo que la IA preparó para el último registro emocional. */
export interface RecomendacionPersonalizada {
  /** Id del ejercicio del catálogo de la app (ver repositories/ejercicio.repository.ts). */
  ejercicioId: string;
  /** Mensaje corto y cálido para esta persona. */
  mensaje: string;
  alternativas: readonly AlternativaAutocuidado[];
  /** null si la IA no encontró o no consideró adecuado ningún lugar. */
  lugar: LugarRecomendado | null;
  /** null si la IA no recomendó un video (o no hay llave de YouTube). */
  video: VideoRecomendado | null;
}

const ID_VIDEO = /^[\w-]{11}$/;

export function esIdVideo(valor: unknown): valor is string {
  return typeof valor === "string" && ID_VIDEO.test(valor);
}

export function esActividadLugar(valor: unknown): valor is ActividadLugar {
  return ACTIVIDADES_LUGAR.some((actividad) => actividad === valor);
}

/** Enlace para abrir el lugar en Google Maps (no necesita llave). Se arma con las coordenadas, nunca con texto de la IA. */
export function enlaceLugar(lugar: Pick<Lugar, "latitud" | "longitud">): string {
  return `https://www.google.com/maps/search/?api=1&query=${lugar.latitud},${lugar.longitud}`;
}

export function enlaceVideo(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function miniaturaVideo(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
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
