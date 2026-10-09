import { obtenerUsuarioActual } from "@/repositories/usuario.repository";
import { obtenerAlertaPendiente } from "./alerta.controller";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

export async function obtenerPantallaInicio() {
  const [usuario, { alerta, apoyo, recomendado }, alertaRoja] = await Promise.all([
    obtenerUsuarioActual(),
    obtenerRecomendacionActual(),
    obtenerAlertaPendiente(),
  ]);
  return { nombre: usuario.alias, alerta, apoyo, recomendado, alertaRoja };
}
