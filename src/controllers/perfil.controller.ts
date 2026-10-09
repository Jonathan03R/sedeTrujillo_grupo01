import { listarGustos } from "@/repositories/gusto.repository";
import { obtenerUsuarioActual } from "@/repositories/usuario.repository";

export async function obtenerPantallaPerfil() {
  const [usuario, gustos] = await Promise.all([obtenerUsuarioActual(), listarGustos()]);
  const iniciales = usuario.alias.slice(0, 2).toUpperCase();
  return { usuario, iniciales, gustos };
}
