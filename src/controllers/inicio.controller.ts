import { obtenerUsuarioActual } from "@/repositories/usuario.repository";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

export async function obtenerPantallaInicio() {
  const [usuario, { alerta, apoyo, recomendado }] = await Promise.all([
    obtenerUsuarioActual(),
    obtenerRecomendacionActual(),
  ]);
  return { nombre: usuario.alias, alerta, apoyo, recomendado };
}
