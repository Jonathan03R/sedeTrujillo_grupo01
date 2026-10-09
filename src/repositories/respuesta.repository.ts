import { connection } from "next/server";
import type { EmojiRespuesta, PreguntaSeguimiento } from "@/models/pregunta.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Preguntas de seguimiento: la IA elige una de la tabla preguntas en su análisis (analisis_uso_telefono.pregunta_id)
// y la persona la responde con un emoji de la tabla emojis, que se guarda en la tabla respuestas.
interface FilaAnalisisPregunta {
  analisis_uso_telefono_id: number;
  pregunta_id: number | null;
  motivo_pregunta: string | null;
  creado_en: string;
  preguntas: { texto: string } | null;
}

export async function listarEmojis(): Promise<readonly EmojiRespuesta[]> {
  const { data, error } = await obtenerClienteServidor()
    .from("emojis")
    .select("emoji_id, simbolo, nombre")
    .eq("activo", true)
    .order("emoji_id", { ascending: true })
    .overrideTypes<{ emoji_id: number; simbolo: string; nombre: string }[]>();

  lanzarSiHayError("listar emojis", error);
  return (data ?? []).map((e) => ({ id: e.emoji_id, simbolo: e.simbolo, nombre: e.nombre }));
}

/**
 * La pregunta que la IA eligió en el último análisis, si la persona aún no la respondió.
 * Está respondida cuando hay una respuesta a esa pregunta hecha después del análisis.
 */
export async function obtenerPreguntaPendiente(): Promise<PreguntaSeguimiento | null> {
  await connection(); // cambia con cada análisis y cada respuesta: excluir del prerenderizado
  const usuario = await obtenerUsuarioActual();
  const supabase = obtenerClienteServidor();

  const { data, error } = await supabase
    .from("analisis_uso_telefono")
    .select("analisis_uso_telefono_id, pregunta_id, motivo_pregunta, creado_en, preguntas (texto)")
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle<FilaAnalisisPregunta>();
  lanzarSiHayError("leer la pregunta de seguimiento", error);
  if (!data?.pregunta_id || !data.preguntas) return null;

  const { count, error: errorRespuestas } = await supabase
    .from("respuestas")
    .select("respuesta_id", { count: "exact", head: true })
    .eq("usuario_id", usuario.id)
    .eq("pregunta_id", data.pregunta_id)
    .eq("activo", true)
    .gte("respondido_en", data.creado_en);
  lanzarSiHayError("revisar si ya respondió la pregunta", errorRespuestas);
  if ((count ?? 0) > 0) return null;

  return {
    analisisId: data.analisis_uso_telefono_id,
    preguntaId: data.pregunta_id,
    texto: data.preguntas.texto,
    motivo: data.motivo_pregunta,
  };
}

/** Guarda la respuesta. Devuelve false si esa no es la pregunta pendiente o el emoji no existe. */
export async function guardarRespuesta(preguntaId: number, emojiId: number): Promise<boolean> {
  const pendiente = await obtenerPreguntaPendiente();
  if (!pendiente || pendiente.preguntaId !== preguntaId) return false;

  const usuario = await obtenerUsuarioActual();
  const supabase = obtenerClienteServidor();

  const { data: emoji, error: errorEmoji } = await supabase
    .from("emojis")
    .select("emoji_id")
    .eq("emoji_id", emojiId)
    .eq("activo", true)
    .maybeSingle<{ emoji_id: number }>();
  lanzarSiHayError("buscar el emoji", errorEmoji);
  if (!emoji) return false;

  const { error } = await supabase
    .from("respuestas")
    .insert({ usuario_id: usuario.id, pregunta_id: preguntaId, emoji_id: emojiId });
  lanzarSiHayError("guardar la respuesta", error);
  return true;
}

/** Cuántas preguntas de seguimiento ha respondido la persona. */
export async function contarRespuestas(): Promise<number> {
  await connection();
  const usuario = await obtenerUsuarioActual();
  const { count, error } = await obtenerClienteServidor()
    .from("respuestas")
    .select("respuesta_id", { count: "exact", head: true })
    .eq("usuario_id", usuario.id)
    .eq("activo", true);
  lanzarSiHayError("contar respuestas", error);
  return count ?? 0;
}
