import { ALTERNATIVAS_BASE, type RecomendacionPersonalizada } from "@/models/autocuidado.model";
import { INTENSIDAD_ALTA, buscarEmocion } from "@/models/emocion.model";
import type { AlertaEmocional, Ejercicio, MensajeApoyo } from "@/models/ejercicio.model";
import type { EstadoActual } from "@/models/progreso.model";
import { buscarEjercicio } from "@/repositories/ejercicio.repository";
import { buscarPlan, listarPlanesDeEmocion } from "@/repositories/plan-autocuidado.repository";
import { obtenerRecomendacionDelRegistro } from "@/repositories/recomendacion-autocuidado.repository";
import { listarRegistros } from "@/repositories/registro-emocional.repository";

/** Título de respaldo si la IA no escribió uno. */
const TITULO_POR_DEFECTO = "Para ti hoy";

/**
 * Recomendación según el último registro emocional. La usan Inicio y Ejercicios.
 *
 * Qué recibe la persona lo dicta la tabla recomendaciones_ejercicios: según la emoción y la franja de
 * intensidad (1-4, 5-7, 8-10) hay una recomendación y un ejercicio, o solo recomendación (sin ejercicio).
 * La IA personaliza el mensaje, el título, las ideas, el lugar y el video; si no pudo, se muestra la
 * recomendación base de la tabla tal cual.
 */
export async function obtenerRecomendacionActual() {
  const registros = await listarRegistros();
  const ultimo = [...registros].sort((a, b) => Date.parse(b.registradoEn) - Date.parse(a.registradoEn))[0];

  let alerta: AlertaEmocional | null = null;
  let apoyo: MensajeApoyo | null = null;
  let estado: EstadoActual | null = null;
  let recomendado: Ejercicio | null = null;
  let mensaje: string | null = null;
  let personalizada: RecomendacionPersonalizada | null = null;
  // «Otros ejercicios»: los de las demás franjas de la misma emoción.
  let otros: Ejercicio[] = [];

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

    const [plan, planes, delRegistro] = await Promise.all([
      buscarPlan(ultimo.emocion, ultimo.intensidad),
      listarPlanesDeEmocion(ultimo.emocion),
      obtenerRecomendacionDelRegistro(ultimo.id),
    ]);

    // El ejercicio sale siempre de la tabla (nunca de lo que haya elegido la IA): null = franja sin ejercicio.
    recomendado = plan?.ejercicioId ? await buscarEjercicio(plan.ejercicioId) : null;
    const ids = planes.flatMap((p) => (p.ejercicioId && p.ejercicioId !== plan?.ejercicioId ? [p.ejercicioId] : []));
    otros = (await Promise.all(ids.map(buscarEjercicio))).filter((e): e is Ejercicio => e !== null);

    personalizada = delRegistro;
    mensaje = delRegistro?.estadoGeneracion === "lista" ? delRegistro.mensaje : plan?.recomendacion ?? null;
    apoyo = {
      titulo: delRegistro?.titulo ?? TITULO_POR_DEFECTO,
      detalle: mensaje ?? "Gracias por registrar cómo te sientes.",
      derivar: malestar && ultimo.intensidad >= INTENSIDAD_ALTA,
    };
  }

  return {
    alerta,
    estado,
    apoyo,
    /** El ejercicio de la franja de hoy; null si esa franja solo lleva recomendación. */
    recomendado,
    /** La recomendación de hoy: personalizada por la IA, o la base de la tabla si la IA no pudo. */
    mensaje,
    alternativas: personalizada && personalizada.alternativas.length > 0 ? personalizada.alternativas : ALTERNATIVAS_BASE,
    /** Un lugar cercano y un video que la IA buscó y eligió con sus herramientas; null si no hubo. */
    lugar: personalizada?.lugar ?? null,
    video: personalizada?.video ?? null,
    recomendacionPendiente: personalizada?.estadoGeneracion === "pendiente",
    otros,
  };
}
