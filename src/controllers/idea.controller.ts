import type { LugarRecomendado, VideoRecomendado } from "@/models/autocuidado.model";
import { esIconoAlternativa } from "@/models/autocuidado.model";
import { UBICACION_DEMO } from "@/models/ubicacion.model";
import { buscarLugaresCercanos } from "@/repositories/lugar.repository";
import { buscarVideos, hayLlaveYoutube } from "@/repositories/video.repository";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

const CONSULTA_VIDEO_TRANQUILO = "música tranquila para relajarse";

/** Una cancha cercana a la ubicación de demostración, para cuando la recomendación de hoy no trajo lugar. */
async function buscarLugarDeRespaldo(): Promise<LugarRecomendado | null> {
  try {
    const [lugar] = await buscarLugaresCercanos("basquet", 3000, UBICACION_DEMO, false);
    if (!lugar) return null;
    return {
      nombre: lugar.nombre,
      actividad: lugar.actividad,
      distanciaMetros: lugar.distanciaMetros,
      latitud: lugar.latitud,
      longitud: lugar.longitud,
      motivo: "Está cerca de la Plaza de Armas: un buen lugar para tirar unos tiros con calma.",
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/** Un video de música tranquila, para cuando la recomendación de hoy no trajo video. */
async function buscarVideoDeRespaldo(): Promise<VideoRecomendado | null> {
  if (!hayLlaveYoutube()) return null;
  try {
    const [video] = await buscarVideos(CONSULTA_VIDEO_TRANQUILO, { soloMusica: true });
    if (!video) return null;
    return { ...video, motivo: "Música tranquila para bajar el ritmo y acompañar el momento." };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * La pantalla de una idea de «También puedes…». Usa lo que la IA preparó al registrar la emoción;
 * si no trajo lugar (deporte) o video (música), lo busca en este momento.
 * Devuelve null si el ícono no existe.
 */
export async function obtenerIdea(icono: string) {
  if (!esIconoAlternativa(icono)) return null;

  const { alternativas, lugar, video } = await obtenerRecomendacionActual();
  const necesitaLugar = icono === "deporte" && !lugar;
  const necesitaVideo = icono === "musica" && !video;

  return {
    icono,
    alternativa: alternativas.find((a) => a.icono === icono) ?? null,
    lugar: necesitaLugar ? await buscarLugarDeRespaldo() : lugar,
    video: necesitaVideo ? await buscarVideoDeRespaldo() : video,
    videoGusto: null,
  };
}
