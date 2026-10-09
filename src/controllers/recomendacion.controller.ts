import { ALTERNATIVAS_BASE, type RecomendacionPersonalizada } from "@/models/autocuidado.model";
import { INTENSIDAD_ALTA, buscarEmocion, type EmocionId } from "@/models/emocion.model";
import type { AlertaEmocional, MensajeApoyo } from "@/models/ejercicio.model";
import type { EstadoActual } from "@/models/progreso.model";
import { buscarEjercicioParaEmocion, listarEjercicios } from "@/repositories/ejercicio.repository";
import { obtenerRecomendacionDelRegistro } from "@/repositories/recomendacion-autocuidado.repository";
import { listarRegistros } from "@/repositories/registro-emocional.repository";

// Mensajes de apoyo por emoción: la recomendación fija que se usa si la IA no pudo personalizar (ver autocuidado.controller.ts).
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

/**
 * Recomendación según el último registro emocional. La usan Inicio y Ejercicios.
 * Si la IA personalizó el autocuidado para ese registro (emoción + intensidad + gustos), usa eso;
 * si no, la recomendación fija por emoción.
 */
export async function obtenerRecomendacionActual() {
  const [ejercicios, registros] = await Promise.all([listarEjercicios(), listarRegistros()]);

  const ultimo = [...registros].sort((a, b) => Date.parse(b.registradoEn) - Date.parse(a.registradoEn))[0];

  let alerta: AlertaEmocional | null = null;
  let apoyo: MensajeApoyo | null = null;
  let estado: EstadoActual | null = null;
  let recomendado = ejercicios[0];
  let personalizada: RecomendacionPersonalizada | null = null;

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
    estado = { emocion, intensidad: ultimo.intensidad };
    apoyo = { ...APOYO_POR_EMOCION[ultimo.emocion], derivar: malestar && ultimo.intensidad >= INTENSIDAD_ALTA };

    const delRegistro = await obtenerRecomendacionDelRegistro(ultimo.id);
    const elegido = delRegistro && ejercicios.find((e) => e.id === delRegistro.ejercicioId);
    if (delRegistro && elegido) {
      personalizada = delRegistro;
      recomendado = elegido;
      apoyo = { ...apoyo, detalle: delRegistro.mensaje };
    } else {
      recomendado = await buscarEjercicioParaEmocion(ultimo.emocion);
    }
  }

  return {
    alerta,
    estado,
    apoyo,
    recomendado,
    /** El mensaje de la IA para esta persona; null si no hubo personalización. */
    mensaje: personalizada?.mensaje ?? null,
    alternativas: personalizada && personalizada.alternativas.length > 0 ? personalizada.alternativas : ALTERNATIVAS_BASE,
    /** Un lugar cercano y un video que la IA buscó y eligió con sus herramientas; null si no hubo. */
    lugar: personalizada?.lugar ?? null,
    video: personalizada?.video ?? null,
    otros: ejercicios.filter((ejercicio) => ejercicio.id !== recomendado.id),
  };
}
