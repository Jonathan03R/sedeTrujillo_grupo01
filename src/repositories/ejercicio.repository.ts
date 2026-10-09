import type { EmocionId } from "@/models/emocion.model";
import type { Ejercicio } from "@/models/ejercicio.model";

// Catálogo fijo de ejercicios. Más adelante puede venir de la base de datos.
const EJERCICIOS: readonly Ejercicio[] = [
  {
    id: "respiracion-cuadrada",
    titulo: "Respiración cuadrada",
    descripcion: "Inhala, sostén, exhala y sostén en tiempos iguales para bajar el ritmo.",
    duracionMinutos: 3,
    tipo: "respiracion",
    paraEmociones: ["estres", "ansiedad"],
    fases: [
      { etiqueta: "Inhala", segundos: 4, accion: "inhalar" },
      { etiqueta: "Sostén", segundos: 4, accion: "sostener" },
      { etiqueta: "Exhala", segundos: 4, accion: "exhalar" },
      { etiqueta: "Sostén", segundos: 4, accion: "sostener" },
    ],
  },
  {
    id: "respiracion-lenta",
    titulo: "Respiración lenta 4-7-8",
    descripcion: "Una exhalación larga ayuda al cuerpo a soltar la tensión.",
    duracionMinutos: 4,
    tipo: "respiracion",
    paraEmociones: ["ansiedad", "estres"],
    fases: [
      { etiqueta: "Inhala", segundos: 4, accion: "inhalar" },
      { etiqueta: "Sostén", segundos: 7, accion: "sostener" },
      { etiqueta: "Exhala", segundos: 8, accion: "exhalar" },
    ],
  },
  {
    id: "relajacion-muscular",
    titulo: "Relajación muscular rápida",
    descripcion: "Tensa y suelta hombros, manos y mandíbula, uno por uno.",
    duracionMinutos: 5,
    tipo: "relajacion",
    paraEmociones: ["estres", "tristeza"],
    pasos: [
      "Tensa los hombros 5 segundos y suéltalos.",
      "Aprieta las manos 5 segundos y suéltalas.",
      "Relaja la mandíbula y la frente.",
      "Respira lento tres veces.",
    ],
  },
  {
    id: "anclaje-5-4-3-2-1",
    titulo: "Anclaje 5-4-3-2-1",
    descripcion: "Nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas.",
    duracionMinutos: 3,
    tipo: "autorregulacion",
    paraEmociones: ["ansiedad"],
    pasos: [
      "Nombra 5 cosas que puedes ver.",
      "Nombra 4 cosas que puedes tocar.",
      "Nombra 3 sonidos que escuchas.",
      "Nombra 2 olores que percibes.",
      "Nombra 1 sabor que sientes.",
    ],
  },
  {
    id: "pausa-gratitud",
    titulo: "Pausa de gratitud",
    descripcion: "Anota tres cosas pequeñas del día por las que te sientes agradecido.",
    duracionMinutos: 2,
    tipo: "autorregulacion",
    paraEmociones: ["tristeza", "tranquilidad", "felicidad"],
    pasos: [
      "Respira profundo una vez.",
      "Piensa en tres cosas pequeñas del día que agradeces.",
      "Anótalas o dilas en voz alta.",
    ],
  },
];

export async function listarEjercicios(): Promise<readonly Ejercicio[]> {
  return EJERCICIOS;
}

export async function buscarEjercicioParaEmocion(emocion: EmocionId): Promise<Ejercicio> {
  return EJERCICIOS.find((e) => e.paraEmociones.includes(emocion)) ?? EJERCICIOS[0];
}
