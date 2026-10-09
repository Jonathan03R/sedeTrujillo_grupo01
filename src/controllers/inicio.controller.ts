import { EMOCIONES } from "@/models/emocion.model";
import { obtenerUsuarioActual } from "@/repositories/usuario.repository";

export async function obtenerPantallaInicio() {
  const usuario = await obtenerUsuarioActual();
  return { nombre: usuario.nombre, emociones: EMOCIONES };
}
