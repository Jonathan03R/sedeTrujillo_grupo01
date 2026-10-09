import { esIconoAlternativa } from "@/models/autocuidado.model";
import { listarVideosSegunGustos } from "@/repositories/video-gusto.repository";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

/**
 * La pantalla de una idea de «También puedes…». El destino depende del ícono de la tarjeta:
 * deporte -> lugar cercano; musica -> videos; las demás aún no tienen destino (ver IdeaView).
 * Devuelve null si el ícono no existe.
 */
export async function obtenerIdea(icono: string) {
  if (!esIconoAlternativa(icono)) return null;

  const [{ alternativas, lugar, video }, videosGustos] = await Promise.all([
    obtenerRecomendacionActual(),
    listarVideosSegunGustos(),
  ]);

  return {
    icono,
    alternativa: alternativas.find((a) => a.icono === icono) ?? null,
    lugar,
    video,
    // Un video de demostración según un gusto (el primero de la lista).
    videoGusto: videosGustos[0] ?? null,
  };
}
