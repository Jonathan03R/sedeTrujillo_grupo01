import { listarEmociones } from "@/repositories/emocion.repository";
import { obtenerNotificacionPendiente } from "@/repositories/notificacion.repository";

/** La alerta roja pendiente (con las emociones para responderla), o null si no hay. La usan Inicio y Uso. */
export async function obtenerAlertaPendiente() {
  const [notificacion, emociones] = await Promise.all([obtenerNotificacionPendiente(), listarEmociones()]);
  return notificacion ? { notificacion, emociones } : null;
}
