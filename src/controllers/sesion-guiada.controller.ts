import { construirPasos } from "@/models/sesion-guiada";
import { listarEjercicios } from "@/repositories/ejercicio.repository";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

/** La sesión guiada de un ejercicio (o null si el id no existe en el catálogo). */
export async function obtenerSesionGuiada(id: string) {
  const ejercicio = (await listarEjercicios()).find((e) => e.id === id);
  if (!ejercicio) return null;

  const { estado } = await obtenerRecomendacionActual();
  return { ejercicio, pasos: construirPasos(ejercicio), estado };
}
