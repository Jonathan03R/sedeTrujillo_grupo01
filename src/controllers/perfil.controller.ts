import { obtenerUsuarioActual } from "@/repositories/usuario.repository";

export async function obtenerPantallaPerfil() {
  const usuario = await obtenerUsuarioActual();
  const iniciales = usuario.alias.slice(0, 2).toUpperCase();
  return { usuario, iniciales };
}
