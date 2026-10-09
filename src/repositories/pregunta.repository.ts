import { connection } from "next/server";
import type { PreguntaDelDia } from "@/models/pregunta.model";
import { diaLocal, inicioDiaLocal } from "@/lib/fechas";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Pregunta del día: se elige de forma determinista entre las preguntas activas (ordenadas por id),
// cambia cada día (hora de Lima) y se repite en ciclo. Misma regla que obtener_pregunta_del_dia
// en db/funciones-preguntas.sql, pero con consultas normales del cliente de Supabase.
const DIA_BASE = diaLocal("2026-01-01T00:00:00-05:00");

export async function obtenerPreguntaDelDia(): Promise<PreguntaDelDia | null> {
  await connection(); // cambia cada día: excluir del prerenderizado
  const usuario = await obtenerUsuarioActual();
  const hoy = diaLocal(new Date().toISOString());
  const cliente = obtenerClienteServidor();

  const { data: preguntas, error } = await cliente
    .from("preguntas")
    .select("pregunta_id, texto")
    .eq("activo", true)
    .order("pregunta_id", { ascending: true });

  lanzarSiHayError("listar preguntas", error);
  if (!preguntas || preguntas.length === 0) return null;

  const total = preguntas.length;
  const pregunta = preguntas[(((hoy - DIA_BASE) % total) + total) % total];

  const { count, error: errorRespuestas } = await cliente
    .from("respuestas")
    .select("respuesta_id", { count: "exact", head: true })
    .eq("usuario_id", usuario.id)
    .eq("pregunta_id", pregunta.pregunta_id)
    .eq("activo", true)
    .gte("respondido_en", inicioDiaLocal(hoy))
    .lt("respondido_en", inicioDiaLocal(hoy + 1));

  lanzarSiHayError("revisar la respuesta de hoy", errorRespuestas);

  return { id: Number(pregunta.pregunta_id), texto: pregunta.texto, respondida: (count ?? 0) > 0 };
}

/** Las preguntas activas, entre las que la IA elige la de seguimiento. */
export async function listarPreguntas(): Promise<readonly { id: number; texto: string }[]> {
  const { data, error } = await obtenerClienteServidor()
    .from("preguntas")
    .select("pregunta_id, texto")
    .eq("activo", true)
    .order("pregunta_id", { ascending: true });

  lanzarSiHayError("listar preguntas", error);
  return (data ?? []).map((p) => ({ id: Number(p.pregunta_id), texto: p.texto }));
}
