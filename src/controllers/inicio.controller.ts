import { obtenerUsuarioActual } from "@/repositories/usuario.repository";
import { obtenerAlertaPendiente } from "./alerta.controller";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

export async function obtenerPantallaInicio() {
  const [usuario, { estado, apoyo, recomendado, mensaje, alternativas, lugar, video }, alertaRoja] = await Promise.all([
    obtenerUsuarioActual(),
    obtenerRecomendacionActual(),
    obtenerAlertaPendiente(),
  ]);
  return { nombre: usuario.alias, estado, apoyo, recomendado, mensaje, alternativas, lugar, video, alertaRoja };
}
