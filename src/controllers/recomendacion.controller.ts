import { INTENSIDAD_ALTA, buscarEmocion, type EmocionId } from "@/models/emocion.model";
import type { AlertaEmocional, MensajeApoyo } from "@/models/ejercicio.model";
import { buscarEjercicioParaEmocion, listarEjercicios } from "@/repositories/ejercicio.repository";
import { listarRegistros } from "@/repositories/registro-emocional.repository";

// Mensajes de apoyo por emoción. Más adelante: recomendación personalizada con IA generativa.
// Lenguaje de acompañamiento: nunca nombra trastornos ni diagnostica.
const APOYO_POR_EMOCION: Record<EmocionId, Pick<MensajeApoyo, "titulo" | "detalle">> = {
  estres: {
    titulo: "Tómate unos minutos para calmar tu mente.",
    detalle: "Te sugiero un ejercicio de respiración guiada para reducir el estrés y recuperar la calma.",
  },
  ansiedad: {
    titulo: "Vamos a bajar el ritmo, con calma.",
    detalle: "Un ejercicio breve de respiración o de anclaje puede ayudarte a volver al presente.",
  },
  tristeza: {
    titulo: "Date un momento para ti.",
    detalle: "Una pausa corta de relajación o gratitud puede ayudarte. Hablar con alguien de confianza también suma.",
  },
  tranquilidad: {
    titulo: "Qué bueno sentirte en calma.",
    detalle: "Aprovecha para reforzar este hábito con un ejercicio corto.",
  },
  felicidad: {
    titulo: "Disfruta este momento.",
    detalle: "Un ejercicio breve de gratitud puede ayudarte a mantener ese ánimo.",
  },
  otra: {
    titulo: "Ponerle nombre a lo que sientes ayuda.",
    detalle: "Un ejercicio corto puede ayudarte a reconocer y entender esa emoción.",
  },
};

/** Recomendación según el último registro emocional. La usan Inicio y Ejercicios. */
export async function obtenerRecomendacionActual() {
  const [ejercicios, registros] = await Promise.all([listarEjercicios(), listarRegistros()]);

  const ultimo = [...registros].sort((a, b) => Date.parse(b.registradoEn) - Date.parse(a.registradoEn))[0];

  let alerta: AlertaEmocional | null = null;
  let apoyo: MensajeApoyo | null = null;
  let recomendado = ejercicios[0];

  if (ultimo) {
    const emocion = buscarEmocion(ultimo.emocion);
    const malestar = emocion.valor <= 2;
    alerta = {
      emocion,
      titulo:
        emocion.id === "otra"
          ? `Registraste una emoción distinta (nivel ${ultimo.intensidad})`
          : `Notamos que sientes ${emocion.etiqueta.toLowerCase()} (nivel ${ultimo.intensidad})`,
      detalle: malestar
        ? "Es normal sentirse así. Aquí tienes una recomendación para ayudarte."
        : "Gracias por registrar cómo te sientes. Aquí tienes una sugerencia.",
    };
    apoyo = { ...APOYO_POR_EMOCION[ultimo.emocion], derivar: malestar && ultimo.intensidad >= INTENSIDAD_ALTA };
    recomendado = await buscarEjercicioParaEmocion(ultimo.emocion);
  }

  return {
    alerta,
    apoyo,
    recomendado,
    otros: ejercicios.filter((ejercicio) => ejercicio.id !== recomendado.id),
  };
}
