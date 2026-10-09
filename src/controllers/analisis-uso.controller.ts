import "server-only";
import { INTENSIDAD_MAXIMA, buscarEmocion } from "@/models/emocion.model";
import type { PreguntaAlerta } from "@/models/notificacion.model";
import { PREGUNTA_REGISTRO } from "@/models/registro-emocional.model";
import {
  DIAS_VENTANA,
  ETIQUETAS_ANOMALIA,
  NIVELES_ATENCION,
  SENALES,
  SEVERIDADES,
  TIPOS_ANOMALIA,
  esNivelAtencion,
  esSenal,
  esSeveridad,
  esTipoAnomalia,
  type AnomaliaUso,
  type NuevoAnalisisUsoTelefono,
  type SesionTelefono,
} from "@/models/uso-telefono.model";
import { diaLocal, fechaHoraCompacta, fechaLocal, inicioDiaLocal } from "@/lib/fechas";
import { MODELO_IA, obtenerClienteIA } from "@/lib/ia/cliente";
import { contieneLenguajeClinico, textoValido } from "@/lib/ia/lenguaje";
import { guardarAnalisis, obtenerUltimoAnalisis } from "@/repositories/analisis-uso-telefono.repository";
import { crearNotificacion } from "@/repositories/notificacion.repository";
import { listarPreguntasAlerta } from "@/repositories/pregunta-alerta.repository";
import { listarRegistros } from "@/repositories/registro-emocional.repository";
import { listarSesionesTelefono } from "@/repositories/sesion-telefono.repository";
import { obtenerUsuarioActual } from "@/repositories/usuario.repository";
import { resumirPorDia, ventanaReciente } from "./uso-telefono.controller";

// Análisis INTERNO del uso del teléfono: nadie lo pide desde la pantalla. Lo dispara el check-in
// (ver registrar-emocion.action.ts) en segundo plano, como lo haría el monitoreo del teléfono.
// Compara la semana con la rutina de la persona; si hay cambios muy bruscos marca alerta roja y
// lanza una notificación con una pregunta del catálogo preguntas_alerta, elegida según el cambio.
// TODO: verificar la sesión del usuario cuando exista autenticación.

/** No se vuelve a analizar si ya hay un análisis más reciente que esto (cuida el costo de la IA). */
const MINUTOS_ENTRE_ANALISIS = 60;
const SIN_SENAL = "ninguna";
const SIN_PREGUNTA = 0;

const INSTRUCCIONES = `Eres el módulo interno de bienestar digital de Pulso, una app que ayuda a jóvenes universitarios a reconocer a tiempo cambios en su bienestar emocional y a autorregularse. La app observa en segundo plano cómo se usa el teléfono; tú recibes una semana de ese uso y, si existen, las respuestas de la persona a la pregunta de ánimo de la app. La persona no ve tu razonamiento: solo ve el resultado.

Tu tarea:
1. Deduce la rutina habitual de la persona a partir de los días más parecidos entre sí (horas de uso, apps, tiempo total, mensajería) y compara cada día con esa rutina propia, no con un ideal.
2. Señala como anomalías solo los cambios claros: uso de madrugada (antes de las 5:00), picos de tiempo de pantalla, revisar el teléfono muchas veces en poco tiempo, menos contacto con otras personas (menos mensajería), abandonar apps o franjas habituales (por ejemplo, de estudio). Cada anomalía lleva la fecha del día (AAAA-MM-DD) en que ocurrió; si un desvelo empieza después de medianoche, la fecha es la del día en que ocurrió.
3. Relaciona, si los hay, los registros emocionales con los cambios de uso, con cautela: son pistas, no causas.
4. Elige un nivel de atención: bajo (rutina estable), medio (varios cambios o uno sostenido), alto (cambios fuertes que se acumulan o empeoran día tras día).
5. Elige la señal predominante entre bienestar, cansancio, animo_bajo, activacion, irritabilidad, o "${SIN_SENAL}" si no hay base suficiente.
6. Da de 2 a 4 sugerencias concretas de autocuidado y autorregulación, conectadas con lo que viste (higiene del sueño, pausas, límites de apps, contactar a alguien de confianza, respiración). Cada una en una frase corta.
7. Decide alerta_roja. Es true solo cuando los cambios son muy bruscos respecto a la propia rutina: por ejemplo, un cambio fuerte que se repite o empeora varios días seguidos, o varias anomalías de severidad alta. Es poco frecuente: si la rutina es estable o los cambios son leves o aislados, es false.
8. Si alerta_roja es true, escribe mensaje_alerta (1 o 2 frases) que cuente con calidez el cambio principal con un dato concreto, y elige pregunta_alerta_id: el id de la pregunta del catálogo que mejor corresponda al cambio más importante (por ejemplo, si lo principal es dormir muy tarde, la pregunta sobre el sueño o la madrugada). Si no hay alerta roja, mensaje_alerta es "" y pregunta_alerta_id es ${SIN_PREGUNTA}.

Reglas obligatorias:
- No diagnosticas. Nunca nombres trastornos ni condiciones clínicas (nada de "depresión", "trastorno", "adicción", "insomnio" como diagnóstico). Habla de señales y cambios: "notamos que últimamente…".
- Si el nivel es medio o alto, sugerir_profesional es true y una sugerencia invita, sin alarmar, a hablar con un profesional de salud mental o con el servicio de bienestar de la universidad.
- Háblale a la persona de tú, en español neutro, cálido y breve, sin dar por hecho su género. El resumen: 2 o 3 frases. Las descripciones de anomalías: 1 frase con el dato concreto (hora, minutos o veces).
- No añadas avisos legales ni digas que no eres un profesional: la app ya lo muestra.`;

function esquemaRespuesta(preguntas: readonly PreguntaAlerta[]) {
  return {
    type: "object",
    properties: {
      nivel_atencion: { type: "string", enum: [...NIVELES_ATENCION] },
      senal_predominante: { type: "string", enum: [...SENALES, SIN_SENAL] },
      resumen: { type: "string" },
      anomalias: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tipo: { type: "string", enum: [...TIPOS_ANOMALIA] },
            fecha: { type: "string", description: "Día de la anomalía, AAAA-MM-DD" },
            severidad: { type: "string", enum: [...SEVERIDADES] },
            descripcion: { type: "string" },
          },
          required: ["tipo", "fecha", "severidad", "descripcion"],
          additionalProperties: false,
        },
      },
      sugerencias: { type: "array", items: { type: "string" } },
      sugerir_profesional: { type: "boolean" },
      alerta_roja: { type: "boolean" },
      mensaje_alerta: { type: "string" },
      pregunta_alerta_id: { type: "integer", enum: [SIN_PREGUNTA, ...preguntas.map((p) => p.id)] },
    },
    required: [
      "nivel_atencion",
      "senal_predominante",
      "resumen",
      "anomalias",
      "sugerencias",
      "sugerir_profesional",
      "alerta_roja",
      "mensaje_alerta",
      "pregunta_alerta_id",
    ],
    additionalProperties: false,
  } as const;
}

const MAXIMO_TEXTO = 600;
const MAXIMO_SUGERENCIAS = 5;
const PESO_SEVERIDAD = { leve: 1, moderada: 2, alta: 3 } as const;

function lineaSesion(sesion: SesionTelefono): string {
  return `- ${fechaHoraCompacta(sesion.inicio)} · ${sesion.aplicacion} (${sesion.categoria}) · ${sesion.minuto} min`;
}

function texto(valor: unknown): string | null {
  return textoValido(valor, MAXIMO_TEXTO);
}

interface AnalisisValidado extends Omit<NuevoAnalisisUsoTelefono, "desde" | "hasta" | "modelo"> {
  /** Solo si hay alerta roja: lo que se le dice a la persona y la pregunta que se le lanza. */
  notificacion: { mensaje: string; preguntaAlertaId: number } | null;
}

/** La pregunta que la IA eligió; si no es válida, la primera del catálogo para el cambio más severo. */
function elegirPregunta(
  idElegido: unknown,
  anomalias: readonly AnomaliaUso[],
  preguntas: readonly PreguntaAlerta[],
): number | null {
  if (preguntas.some((p) => p.id === idElegido)) return idElegido as number;

  const principal = [...anomalias].sort(
    (a, b) => PESO_SEVERIDAD[b.severidad] - PESO_SEVERIDAD[a.severidad] || b.fecha.localeCompare(a.fecha),
  )[0];
  const porTipo = (tipo: string) => preguntas.find((p) => p.tipo === tipo);
  return (porTipo(principal?.tipo ?? "otro") ?? porTipo("otro"))?.id ?? null;
}

/** Convierte la respuesta de la IA en un análisis válido, o null si algo no cumple las reglas. */
function validarRespuesta(
  bruto: unknown,
  fechasValidas: ReadonlySet<string>,
  preguntas: readonly PreguntaAlerta[],
): AnalisisValidado | null {
  if (typeof bruto !== "object" || bruto === null) return null;
  const r = bruto as Record<string, unknown>;

  const resumen = texto(r.resumen);
  if (!esNivelAtencion(r.nivel_atencion) || !resumen || !Array.isArray(r.anomalias) || !Array.isArray(r.sugerencias)) {
    return null;
  }

  const anomalias: AnomaliaUso[] = [];
  for (const a of r.anomalias as unknown[]) {
    const item = (a ?? {}) as Record<string, unknown>;
    const descripcion = texto(item.descripcion);
    if (!esTipoAnomalia(item.tipo) || !esSeveridad(item.severidad) || !descripcion) return null;
    if (typeof item.fecha !== "string" || !fechasValidas.has(item.fecha)) return null;
    anomalias.push({ tipo: item.tipo, fecha: item.fecha, severidad: item.severidad, descripcion });
  }

  const sugerencias = (r.sugerencias as unknown[]).map(texto).filter((s): s is string => s !== null);
  if (sugerencias.length === 0) return null;

  // Una alerta roja necesita cambios concretos que la respalden y un nivel que no sea bajo.
  const mensaje = texto(r.mensaje_alerta);
  const alertaRoja = r.alerta_roja === true && anomalias.length > 0 && r.nivel_atencion !== "bajo";
  if (alertaRoja && !mensaje) return null;

  const textos = [resumen, ...sugerencias, ...anomalias.map((a) => a.descripcion), ...(mensaje ? [mensaje] : [])];
  if (contieneLenguajeClinico(textos)) return null;

  const preguntaAlertaId = alertaRoja ? elegirPregunta(r.pregunta_alerta_id, anomalias, preguntas) : null;

  return {
    nivelAtencion: r.nivel_atencion,
    senalPredominante: esSenal(r.senal_predominante) ? r.senal_predominante : null,
    resumen,
    anomalias,
    sugerencias: sugerencias.slice(0, MAXIMO_SUGERENCIAS),
    // Regla del proyecto: con nivel medio o alto siempre se sugiere ayuda profesional.
    sugerirProfesional: r.sugerir_profesional === true || r.nivel_atencion !== "bajo",
    alertaRoja: alertaRoja && preguntaAlertaId !== null,
    notificacion: alertaRoja && mensaje && preguntaAlertaId !== null ? { mensaje, preguntaAlertaId } : null,
  };
}

function armarDatos(
  dias: ReturnType<typeof resumirPorDia>,
  ventana: NonNullable<ReturnType<typeof ventanaReciente>>,
  edad: number | null,
  registros: Awaited<ReturnType<typeof listarRegistros>>,
  preguntas: readonly PreguntaAlerta[],
): string {
  // Solo se envía la edad y el uso: ni alias ni otros datos que identifiquen a la persona.
  return [
    `Persona: ${edad ?? "edad desconocida"} años, estudiante universitaria. Hora local: Lima.`,
    `Ventana: ${DIAS_VENTANA} días, del ${fechaLocal(ventana.primerDia)} al ${fechaLocal(ventana.ultimoDia)}.`,
    "",
    "Totales por día:",
    ...dias.map(
      (d) =>
        `- ${d.etiqueta} ${fechaLocal(d.dia)}: ${d.minutoTotal} min en total, ${d.apertura} aperturas, ${d.minutoMadrugada} min de madrugada`,
    ),
    "",
    "Sesiones (inicio · app (categoría) · duración):",
    ...ventana.sesiones.map(lineaSesion),
    "",
    `Respuestas de la persona a «${PREGUNTA_REGISTRO}» en la ventana (emoción e intensidad):`,
    ...(registros.length > 0
      ? registros.map(
          (r) =>
            `- ${fechaHoraCompacta(r.registradoEn)} · ${buscarEmocion(r.emocion).etiqueta}, intensidad ${r.intensidad}/${INTENSIDAD_MAXIMA}`,
        )
      : ["- (sin registros)"]),
    "",
    `Tipos de anomalía posibles: ${TIPOS_ANOMALIA.map((t) => `${t} (${ETIQUETAS_ANOMALIA[t]})`).join(", ")}.`,
    "",
    "Catálogo de preguntas de alerta (id · cambio al que corresponde · pregunta):",
    ...preguntas.map((p) => `- ${p.id} · ${p.tipo} · ${p.texto}`),
  ].join("\n");
}

async function analizar(): Promise<void> {
  const [todas, registros, usuario, preguntas] = await Promise.all([
    listarSesionesTelefono(),
    listarRegistros(),
    obtenerUsuarioActual(),
    listarPreguntasAlerta(),
  ]);
  const ventana = ventanaReciente(todas);
  if (!ventana) return;

  const dias = resumirPorDia(ventana);
  const fechasValidas = new Set(dias.map((d) => fechaLocal(d.dia)));
  const registrosVentana = registros.filter((r) => {
    const dia = diaLocal(r.registradoEn);
    return dia >= ventana.primerDia && dia <= ventana.ultimoDia;
  });

  const respuesta = await obtenerClienteIA().beta.messages.create({
    model: MODELO_IA,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: { type: "json_schema", schema: esquemaRespuesta(preguntas) } },
    system: INSTRUCCIONES,
    messages: [{ role: "user", content: armarDatos(dias, ventana, usuario.edad, registrosVentana, preguntas) }],
  });

  if (respuesta.stop_reason === "refusal" || respuesta.stop_reason === "max_tokens") {
    console.error(`IA · análisis de uso sin terminar: ${respuesta.stop_reason}`);
    return;
  }

  const bloque = respuesta.content.find((b) => b.type === "text");
  const analisis = bloque ? validarRespuesta(JSON.parse(bloque.text), fechasValidas, preguntas) : null;
  if (!analisis) {
    console.error("IA · la respuesta del análisis no pasó la validación", bloque?.type === "text" ? bloque.text : "");
    return;
  }

  const { notificacion, ...datos } = analisis;
  const analisisId = await guardarAnalisis({
    ...datos,
    desde: inicioDiaLocal(ventana.primerDia),
    hasta: inicioDiaLocal(ventana.ultimoDia + 1),
    modelo: respuesta.model,
  });

  if (notificacion) {
    await crearNotificacion({ analisisId, preguntaAlertaId: notificacion.preguntaAlertaId, mensaje: notificacion.mensaje });
  }
}

let enCurso = false;

/**
 * Analiza en segundo plano la última semana de uso. Nunca lanza: si algo falla queda en el log del
 * servidor y la persona no nota nada. Se salta si ya hay un análisis reciente o uno en marcha.
 */
export async function ejecutarAnalisisInterno(): Promise<void> {
  if (enCurso) return;
  enCurso = true;
  try {
    const ultimo = await obtenerUltimoAnalisis();
    if (ultimo && Date.now() - Date.parse(ultimo.creadoEn) < MINUTOS_ENTRE_ANALISIS * 60_000) return;
    await analizar();
  } catch (error) {
    console.error(error);
  } finally {
    enCurso = false;
  }
}
