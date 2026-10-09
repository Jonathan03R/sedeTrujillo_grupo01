import { connection } from "next/server";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tabla videos_gustos (ver db/videos-gustos.sql). DATOS FICTICIOS de demostración.
export interface VideoGusto {
  gusto: string;
  titulo: string;
  canal: string;
  consulta: string;
}

interface FilaVideoGusto {
  gusto: string;
  titulo: string;
  canal: string;
  consulta: string;
}

/** Videos de demostración que coinciden con los gustos activos de la persona. */
export async function listarVideosSegunGustos(): Promise<readonly VideoGusto[]> {
  await connection(); // los gustos cambian: leer en cada petición
  const usuario = await obtenerUsuarioActual();
  const supabase = obtenerClienteServidor();

  const { data: gustos, error: errorGustos } = await supabase
    .from("gustos")
    .select("texto")
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .overrideTypes<{ texto: string }[]>();
  lanzarSiHayError("leer los gustos para los videos", errorGustos);

  const nombres = (gustos ?? []).map((g) => g.texto);
  if (nombres.length === 0) return [];

  const { data, error } = await supabase
    .from("videos_gustos")
    .select("gusto, titulo, canal, consulta")
    .eq("activo", true)
    .in("gusto", nombres)
    .overrideTypes<FilaVideoGusto[]>();
  lanzarSiHayError("listar videos según gustos", error);

  return data ?? [];
}
