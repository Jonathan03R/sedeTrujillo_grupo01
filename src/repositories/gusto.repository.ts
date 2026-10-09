import { connection } from "next/server";
import { MAXIMO_GUSTOS, type Gusto } from "@/models/gusto.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tabla gustos (ver db/gustos-autocuidado.sql). Borrado lógico: solo filas con activo = true.
interface FilaGusto {
  gusto_id: number;
  texto: string;
}

export async function listarGustos(): Promise<readonly Gusto[]> {
  await connection(); // la persona los edita: leerlos en cada petición
  const usuario = await obtenerUsuarioActual();

  const { data, error } = await obtenerClienteServidor()
    .from("gustos")
    .select("gusto_id, texto")
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .order("gusto_id", { ascending: true })
    .overrideTypes<FilaGusto[]>();

  lanzarSiHayError("listar gustos", error);
  return (data ?? []).map((fila) => ({ id: fila.gusto_id, texto: fila.texto }));
}

export type ResultadoAgregarGusto = "agregado" | "repetido" | "limite";

export async function agregarGusto(texto: string): Promise<ResultadoAgregarGusto> {
  const usuario = await obtenerUsuarioActual();
  const supabase = obtenerClienteServidor();

  const { count, error: errorConteo } = await supabase
    .from("gustos")
    .select("gusto_id", { count: "exact", head: true })
    .eq("usuario_id", usuario.id)
    .eq("activo", true);
  lanzarSiHayError("contar gustos", errorConteo);
  if ((count ?? 0) >= MAXIMO_GUSTOS) return "limite";

  const { error } = await supabase.from("gustos").insert({ usuario_id: usuario.id, texto });
  if (error?.code === "23505") return "repetido"; // índice único (usuario, texto sin mayúsculas)
  lanzarSiHayError("agregar el gusto", error);
  return "agregado";
}

/** Borrado lógico. Solo quita gustos de la propia persona. */
export async function quitarGusto(gustoId: number): Promise<void> {
  const usuario = await obtenerUsuarioActual();

  const { error } = await obtenerClienteServidor()
    .from("gustos")
    .update({ activo: false })
    .eq("gusto_id", gustoId)
    .eq("usuario_id", usuario.id);

  lanzarSiHayError("quitar el gusto", error);
}
