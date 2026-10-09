import { listarEmociones } from "@/repositories/emocion.repository";
import { obtenerUsuarioActual } from "@/repositories/usuario.repository";

// Pantalla de entrada: la pregunta es siempre la misma (PREGUNTA_REGISTRO) y las respuestas posibles
// son las emociones activas del catálogo. La pregunta del día (preguntas/respuestas) es otro análisis.
export async function obtenerPantallaRegistro() {
  const [usuario, emociones] = await Promise.all([obtenerUsuarioActual(), listarEmociones()]);
  return { nombre: usuario.alias, emociones };
}
