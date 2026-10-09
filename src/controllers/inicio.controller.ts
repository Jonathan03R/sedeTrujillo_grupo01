import { obtenerUsuarioActual } from "@/repositories/usuario.repository";
import { listarVideosSegunGustos } from "@/repositories/video-gusto.repository";
import { obtenerAlertaPendiente } from "./alerta.controller";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

export async function obtenerPantallaInicio() {
  const [usuario, { estado, apoyo, recomendado, mensaje, alternativas, lugar, video }, alertaRoja, videosGustos] = await Promise.all([
    obtenerUsuarioActual(),
    obtenerRecomendacionActual(),
    obtenerAlertaPendiente(),
    listarVideosSegunGustos(),
  ]);
  // Un video de demostración según un gusto (el primero de la lista).
  return { nombre: usuario.alias, estado, apoyo, recomendado, mensaje, alternativas, lugar, video, alertaRoja, videoGusto: videosGustos[0] ?? null };
}
