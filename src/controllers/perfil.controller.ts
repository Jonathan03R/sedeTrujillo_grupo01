import { obtenerUsuarioActual } from "@/repositories/usuario.repository";

export async function obtenerPantallaPerfil() {
  const usuario = await obtenerUsuarioActual();
  const iniciales = `${usuario.nombre[0]}${usuario.apellidos[0]}`.toUpperCase();
  return { usuario, iniciales };
}
