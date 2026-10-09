"use server";

import { refresh } from "next/cache";
import { guardarRespuesta } from "@/repositories/respuesta.repository";

// Server Action: se puede invocar con un POST directo, por eso valida todo lo que recibe.
// Solo se acepta la respuesta a la pregunta que la IA dejó pendiente (se comprueba en el repositorio).
// TODO: verificar la sesión del usuario cuando exista autenticación.
function esIdValido(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

export async function responderPregunta(preguntaId: unknown, emojiId: unknown): Promise<{ error: string } | undefined> {
  if (!esIdValido(preguntaId) || !esIdValido(emojiId)) return { error: "Elige una de las caritas para responder." };

  try {
    if (!(await guardarRespuesta(preguntaId, emojiId))) return { error: "Esta pregunta ya no está disponible." };
  } catch (error) {
    console.error(error); // el detalle queda en el servidor; a la persona se le muestra un mensaje simple
    return { error: "No pudimos guardar tu respuesta. Inténtalo de nuevo en un momento." };
  }

  refresh(); // ya está respondida: la tarjeta deja de mostrarse
}
