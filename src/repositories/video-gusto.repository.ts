import { connection } from "next/server";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tabla videos_gustos (ver db/videos-gustos.sql). DATOS FICTICIOS de demostración.
export interface VideoGusto {
  gusto: string;
  /** ID real de YouTube (null = solo búsqueda). */
  videoId: string | null;
  titulo: string;
  canal: string;
  consulta: string;
}

interface FilaVideoGusto {
  gusto: string;
  video_id: string | null;
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
    .select("gusto, video_id, titulo, canal, consulta")
    .eq("activo", true)
    .in("gusto", nombres)
    .overrideTypes<FilaVideoGusto[]>();
  lanzarSiHayError("listar videos según gustos", error);

  return (data ?? []).map((f) => ({ gusto: f.gusto, videoId: f.video_id, titulo: f.titulo, canal: f.canal, consulta: f.consulta }));
}
