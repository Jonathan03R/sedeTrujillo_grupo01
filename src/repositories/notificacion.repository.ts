import { connection } from "next/server";
import type { EmocionId } from "@/models/emocion.model";
import type { NuevaNotificacion, Notificacion } from "@/models/notificacion.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { buscarIdEmocionActiva } from "./emocion.repository";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tabla notificaciones (ver db/alertas.sql). Borrado lógico: solo filas con activo = true.
// Está pendiente mientras no tenga respondida_en.
interface FilaNotificacion {
  notificacion_id: number;
  mensaje: string;
  preguntas_alerta: { texto: string };
}

export async function obtenerNotificacionPendiente(): Promise<Notificacion | null> {
  await connection(); // cambia con cada análisis: excluir del prerenderizado
  const usuario = await obtenerUsuarioActual();

  const { data, error } = await obtenerClienteServidor()
    .from("notificaciones")
    .select("notificacion_id, mensaje, preguntas_alerta!inner (texto)")
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .is("respondida_en", null)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle<FilaNotificacion>();

  lanzarSiHayError("leer la notificación pendiente", error);
  return data ? { id: data.notificacion_id, mensaje: data.mensaje, pregunta: data.preguntas_alerta.texto } : null;
}

/** Crea la notificación. Las pendientes anteriores se desactivan: solo importa la del análisis más reciente. */
export async function crearNotificacion(nueva: NuevaNotificacion): Promise<void> {
  const usuario = await obtenerUsuarioActual();
  const supabase = obtenerClienteServidor();

  const { error: errorAnteriores } = await supabase
    .from("notificaciones")
    .update({ activo: false })
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .is("respondida_en", null);
  lanzarSiHayError("cerrar notificaciones anteriores", errorAnteriores);

  const { error } = await supabase.from("notificaciones").insert({
    usuario_id: usuario.id,
    analisis_uso_telefono_id: nueva.analisisId,
    pregunta_alerta_id: nueva.preguntaAlertaId,
    mensaje: nueva.mensaje,
  });
  lanzarSiHayError("crear la notificación", error);
}

/** Guarda la emoción elegida. Devuelve false si la notificación no existe, no es de la persona o ya se respondió. */
export async function responderNotificacion(notificacionId: number, emocion: EmocionId): Promise<boolean> {
  const [usuario, emocionId] = await Promise.all([obtenerUsuarioActual(), buscarIdEmocionActiva(emocion)]);
  if (emocionId === null) return false;

  const { data, error } = await obtenerClienteServidor()
    .from("notificaciones")
    .update({ respuesta_emocion_id: emocionId, respondida_en: new Date().toISOString() })
    .eq("notificacion_id", notificacionId)
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .is("respondida_en", null)
    .select("notificacion_id");

  lanzarSiHayError("responder la notificación", error);
  return (data ?? []).length > 0;
}
