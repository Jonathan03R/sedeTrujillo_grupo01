"use server";

import { refresh } from "next/cache";
import { esEmocionId } from "@/models/emocion.model";
import { responderNotificacion } from "@/repositories/notificacion.repository";

// Server Action: se puede invocar con un POST directo, por eso valida todo lo que recibe.
// TODO: verificar la sesión del usuario cuando exista autenticación.
export async function responderAlerta(notificacionId: unknown, emocion: unknown): Promise<{ error: string } | undefined> {
  if (typeof notificacionId !== "number" || !Number.isInteger(notificacionId) || notificacionId <= 0 || !esEmocionId(emocion)) {
    return { error: "Elige una emoción para responder." };
  }

  try {
    if (!(await responderNotificacion(notificacionId, emocion))) {
      return { error: "Esta pregunta ya no está disponible." };
    }
  } catch (error) {
    console.error(error); // el detalle queda en el servidor; a la persona se le muestra un mensaje simple
    return { error: "No pudimos guardar tu respuesta. Inténtalo de nuevo en un momento." };
  }

  refresh(); // la notificación ya está respondida: la alerta deja de mostrarse
}
