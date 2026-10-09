import { listarEmojis, obtenerPreguntaPendiente } from "@/repositories/respuesta.repository";

/** La pregunta de seguimiento pendiente (con los emojis para responderla), o null si no hay. La usa Inicio. */
export async function obtenerPreguntaSeguimiento() {
  const [pregunta, emojis] = await Promise.all([obtenerPreguntaPendiente(), listarEmojis()]);
  return pregunta ? { pregunta, emojis } : null;
}
