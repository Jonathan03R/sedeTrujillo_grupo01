import type { Habito } from "@/models/progreso.model";

// Datos ficticios. Reemplazar por la base de datos cuando exista la tabla de hábitos.
const HABITOS: readonly Habito[] = [
  { id: "respiracion", nombre: "Respiración guiada", completados: 3, meta: 5 },
  { id: "sueno", nombre: "Dormir 7 horas o más", completados: 4, meta: 7 },
  { id: "pausas", nombre: "Pausas entre tareas", completados: 2, meta: 5 },
  { id: "agua", nombre: "Tomar agua", completados: 5, meta: 7 },
];

export async function listarHabitos(): Promise<readonly Habito[]> {
  return HABITOS;
}
