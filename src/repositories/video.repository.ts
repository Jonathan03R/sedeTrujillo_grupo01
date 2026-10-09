import "server-only";
import { esIdVideo, type Video } from "@/models/autocuidado.model";

// Videos de YouTube (YouTube Data API v3). Necesita YOUTUBE_API_KEY, que es secreta: solo servidor.
// Sin la llave, la IA no ofrece videos (ver controllers/herramientas-autocuidado.ts).
const URL_API = "https://www.googleapis.com/youtube/v3";
const ESPERA_MAXIMA_MS = 10_000;
const CANTIDAD_MAXIMA = 5;
/** Para calmarse no sirve un video larguísimo. */
const DURACION_MAXIMA_MINUTOS = 40;

export function hayLlaveYoutube(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY);
}

async function pedir<T>(ruta: string, parametros: Record<string, string>): Promise<T> {
  const llave = process.env.YOUTUBE_API_KEY;
  if (!llave) throw new Error("Falta la variable de entorno YOUTUBE_API_KEY. Revisa tu archivo .env (ver .env.example).");

  const respuesta = await fetch(`${URL_API}/${ruta}?${new URLSearchParams(parametros)}`, {
    // La llave va en el encabezado para que no quede en la URL (ni en logs).
    headers: { "X-Goog-Api-Key": llave },
    signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
  });
  if (!respuesta.ok) throw new Error(`YouTube respondió ${respuesta.status}`);
  return (await respuesta.json()) as T;
}

/** «PT1H2M30S» -> minutos. */
function minutosDeDuracion(iso: string | undefined): number | null {
  const partes = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!partes) return null;
  return Math.max(1, Math.round(Number(partes[1] ?? 0) * 60 + Number(partes[2] ?? 0) + Number(partes[3] ?? 0) / 60));
}

interface ResultadoBusqueda {
  items?: { id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string } }[];
}
interface ResultadoDetalles {
  items?: { id?: string; contentDetails?: { duration?: string } }[];
}

/** Videos aptos para todo público, en español, que se pueden ver embebidos. Lanza si YouTube no responde. */
export async function buscarVideos(consulta: string): Promise<Video[]> {
  const busqueda = await pedir<ResultadoBusqueda>("search", {
    part: "snippet",
    type: "video",
    q: consulta,
    maxResults: String(CANTIDAD_MAXIMA * 2),
    safeSearch: "strict",
    videoEmbeddable: "true",
    relevanceLanguage: "es",
    regionCode: "PE",
  });

  const candidatos = (busqueda.items ?? []).flatMap((item) => {
    const videoId = item.id?.videoId;
    return esIdVideo(videoId) && item.snippet?.title ? [{ videoId, titulo: item.snippet.title, canal: item.snippet.channelTitle ?? "" }] : [];
  });
  if (candidatos.length === 0) return [];

  const detalles = await pedir<ResultadoDetalles>("videos", {
    part: "contentDetails",
    id: candidatos.map((c) => c.videoId).join(","),
  });
  const duraciones = new Map((detalles.items ?? []).map((d) => [d.id, minutosDeDuracion(d.contentDetails?.duration)]));

  return candidatos
    .map((c): Video => ({ ...c, duracionMinutos: duraciones.get(c.videoId) ?? null }))
    .filter((v) => v.duracionMinutos === null || v.duracionMinutos <= DURACION_MAXIMA_MINUTOS)
    .slice(0, CANTIDAD_MAXIMA);
}
