import { connection } from "next/server";
import type { Usuario } from "@/models/usuario.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";

// Persona de demostración (ficticia, ver db/seed-demo.sql).
// TODO: reemplazar por el usuario autenticado cuando exista inicio de sesión.
const ALIAS_DEMO = "Yoana";

export async function obtenerUsuarioActual(): Promise<Usuario> {
  await connection(); // lectura por petición: excluir del prerenderizado
  const { data, error } = await obtenerClienteServidor()
    .from("usuarios")
    .select("usuario_id, alias, edad")
    .eq("alias", ALIAS_DEMO)
    .eq("activo", true)
    .maybeSingle();

  lanzarSiHayError("leer el usuario", error);
  if (!data) throw new Error(`No existe el usuario de demostración "${ALIAS_DEMO}". Ejecuta db/seed-demo.sql.`);

  return { id: data.usuario_id, alias: data.alias, edad: data.edad };
}
