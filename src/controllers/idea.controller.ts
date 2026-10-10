import { esIconoAlternativa } from "@/models/autocuidado.model";
import { listarGustos } from "@/repositories/gusto.repository";
import { listarLugaresPorGustos, listarVideosDeEmocion } from "@/repositories/catalogo-estatico.repository";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

/**
 * La pantalla de una idea de «También puedes…».
 * - Lugares: si la IA eligió uno al registrar, va primero; luego los lugares estáticos de Trujillo según tus gustos.
 * - Videos: si la IA eligió uno, va primero; luego los videos estáticos de la emoción de hoy.
 * Devuelve null si el ícono no existe.
 */
export async function obtenerIdea(icono: string) {
  if (!esIconoAlternativa(icono)) return null;

  const [{ alternativas, lugar, video, estado }, gustos] = await Promise.all([obtenerRecomendacionActual(), listarGustos()]);

  const lugares = icono === "deporte" || icono === "relajacion" || icono === "caminar" || icono === "naturaleza"
    ? [...(lugar ? [lugar] : []), ...(await listarLugaresPorGustos(gustos.map((g) => g.texto)))]
    : [];
  const videosEmocion = icono === "musica" && estado ? await listarVideosDeEmocion(estado.emocion.id) : [];

  return {
    icono,
    alternativa: alternativas.find((a) => a.icono === icono) ?? null,
    lugares,
    video: icono === "musica" ? video : null,
    videosEmocion,
  };
}
