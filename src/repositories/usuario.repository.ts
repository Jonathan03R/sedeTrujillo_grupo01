import type { Usuario } from "@/models/usuario.model";

// Persona ficticia del canvas. Reemplazar por el usuario autenticado.
const USUARIO: Usuario = {
  id: 1,
  nombre: "Yoana",
  apellidos: "Castillo García",
  edad: 21,
  alias: "yoana21",
};

export async function obtenerUsuarioActual(): Promise<Usuario> {
  return USUARIO;
}
