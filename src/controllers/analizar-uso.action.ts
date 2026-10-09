"use server";

import Anthropic from "@anthropic-ai/sdk";
import { refresh } from "next/cache";
import { buscarEmocion } from "@/models/emocion.model";
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
import { guardarAnalisis } from "@/repositories/analisis-uso-telefono.repository";
import { listarRegistros } from "@/repositories/registro-emocional.repository";
import { listarSesionesTelefono } from "@/repositories/sesion-telefono.repository";
import { obtenerUsuarioActual } from "@/repositories/usuario.repository";
import { resumirPorDia, ventanaReciente } from "./uso-telefono.controller";

// Server Action: analiza con IA la última semana de uso del teléfono y guarda el resultado.
// No recibe datos del navegador: todo sale de la base. Igual valida lo que responde la IA antes de guardarlo.
// TODO: verificar la sesión del usuario cuando exista autenticación.

const SIN_SENAL = "ninguna";

const INSTRUCCIONES = `Eres el módulo de bienestar digital de Pulso, una app que ayuda a jóvenes universitarios a reconocer a tiempo cambios en su bienestar emocional y a autorregularse. La app observa en segundo plano cómo se usa el teléfono; tú recibes una semana de ese uso y, si existen, los registros emocionales que la persona hizo.

Tu tarea:
1. Deduce la rutina habitual de la persona a partir de los días más parecidos entre sí (horas de uso, apps, tiempo total, mensajería) y compara cada día con esa rutina propia, no con un ideal.
2. Señala como anomalías solo los cambios claros: uso de madrugada (antes de las 5:00), picos de tiempo de pantalla, revisar el teléfono muchas veces en poco tiempo, menos contacto con otras personas (menos mensajería), abandonar apps o franjas habituales (por ejemplo, de estudio). Cada anomalía lleva la fecha del día (AAAA-MM-DD) en que ocurrió; si un desvelo empieza después de medianoche, la fecha es la del día en que ocurrió.
3. Relaciona, si los hay, los registros emocionales con los cambios de uso, con cautela: son pistas, no causas.
4. Elige un nivel de atención: bajo (rutina estable), medio (varios cambios o uno sostenido), alto (cambios fuertes que se acumulan o empeoran día tras día).
5. Elige la señal predominante entre bienestar, cansancio, animo_bajo, activacion, irritabilidad, o "${SIN_SENAL}" si no hay base suficiente.
6. Da de 2 a 4 sugerencias concretas de autocuidado y autorregulación, conectadas con lo que viste (higiene del sueño, pausas, límites de apps, contactar a alguien de confianza, respiración). Cada una en una frase corta.

Reglas obligatorias:
- No diagnosticas. Nunca nombres trastornos ni condiciones clínicas (nada de "depresión", "trastorno", "adicción", "insomnio" como diagnóstico). Habla de señales y cambios: "notamos que últimamente…".
- Si el nivel es medio o alto, sugerir_profesional es true y una sugerencia invita, sin alarmar, a hablar con un profesional de salud mental o con el servicio de bienestar de la universidad.
- Háblale a la persona de tú, en español neutro, cálido y breve. El resumen: 2 o 3 frases. Las descripciones de anomalías: 1 frase con el dato concreto (hora, minutos o veces).
- No añadas avisos legales ni digas que no eres un profesional: la app ya lo muestra.`;

const ESQUEMA_RESPUESTA = {
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
  },
  required: ["nivel_atencion", "senal_predominante", "resumen", "anomalias", "sugerencias", "sugerir_profesional"],
  additionalProperties: false,
} as const;

// Red de seguridad para la regla de oro 2: si la IA nombra un trastorno, no se guarda.
const LENGUAJE_CLINICO = /trastorno|depresi[oó]n|adicci[oó]n|insomnio|ludopat|tdah/i;

const MAXIMO_TEXTO = 600;
const MAXIMO_SUGERENCIAS = 5;

function lineaSesion(sesion: SesionTelefono): string {
  return `- ${fechaHoraCompacta(sesion.inicio)} · ${sesion.aplicacion} (${sesion.categoria}) · ${sesion.minuto} min`;
}

function texto(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim().length > 0 && valor.length <= MAXIMO_TEXTO ? valor.trim() : null;
}

/** Convierte la respuesta de la IA en un análisis válido, o null si algo no cumple las reglas. */
function validarRespuesta(
  bruto: unknown,
  fechasValidas: ReadonlySet<string>,
): Omit<NuevoAnalisisUsoTelefono, "desde" | "hasta" | "modelo"> | null {
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

  const textos = [resumen, ...sugerencias, ...anomalias.map((a) => a.descripcion)];
  if (textos.some((t) => LENGUAJE_CLINICO.test(t))) return null;

  return {
    nivelAtencion: r.nivel_atencion,
    senalPredominante: esSenal(r.senal_predominante) ? r.senal_predominante : null,
    resumen,
    anomalias,
    sugerencias: sugerencias.slice(0, MAXIMO_SUGERENCIAS),
    // Regla del proyecto: con nivel medio o alto siempre se sugiere ayuda profesional.
    sugerirProfesional: r.sugerir_profesional === true || r.nivel_atencion !== "bajo",
  };
}

export async function analizarUsoTelefono(): Promise<{ error: string } | undefined> {
  try {
    const [todas, registros, usuario] = await Promise.all([
      listarSesionesTelefono(),
      listarRegistros(),
      obtenerUsuarioActual(),
    ]);
    const ventana = ventanaReciente(todas);
    if (!ventana) return { error: "Todavía no hay datos de uso del teléfono para analizar." };

    const dias = resumirPorDia(ventana);
    const fechasValidas = new Set(dias.map((d) => fechaLocal(d.dia)));
    const registrosVentana = registros.filter((r) => {
      const dia = diaLocal(r.registradoEn);
      return dia >= ventana.primerDia && dia <= ventana.ultimoDia;
    });

    // Solo se envía la edad y el uso: ni alias ni otros datos que identifiquen a la persona.
    const datos = [
      `Persona: ${usuario.edad ?? "edad desconocida"} años, estudiante universitaria. Hora local: Lima.`,
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
      ...(registrosVentana.length > 0
        ? registrosVentana.map(
            (r) => `- ${fechaHoraCompacta(r.registradoEn)} · ${buscarEmocion(r.emocion).etiqueta}, intensidad ${r.intensidad}/5`,
          )
        : ["- (sin registros)"]),
      "",
      `Tipos de anomalía posibles: ${TIPOS_ANOMALIA.map((t) => `${t} (${ETIQUETAS_ANOMALIA[t]})`).join(", ")}.`,
    ].join("\n");

    const respuesta = await obtenerClienteIA().beta.messages.create({
      model: MODELO_IA,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: { type: "json_schema", schema: ESQUEMA_RESPUESTA } },
      system: INSTRUCCIONES,
      messages: [{ role: "user", content: datos }],
    });

    if (respuesta.stop_reason === "refusal" || respuesta.stop_reason === "max_tokens") {
      console.error(`IA · análisis de uso sin terminar: ${respuesta.stop_reason}`);
      return { error: "No pudimos completar el análisis. Inténtalo de nuevo en un momento." };
    }

    const bloque = respuesta.content.find((b) => b.type === "text");
    const analisis = bloque ? validarRespuesta(JSON.parse(bloque.text), fechasValidas) : null;
    if (!analisis) {
      console.error("IA · la respuesta del análisis no pasó la validación", bloque?.type === "text" ? bloque.text : "");
      return { error: "El análisis no salió bien esta vez. Inténtalo de nuevo." };
    }

    await guardarAnalisis({
      ...analisis,
      desde: inicioDiaLocal(ventana.primerDia),
      hasta: inicioDiaLocal(ventana.ultimoDia + 1),
      modelo: respuesta.model,
    });
  } catch (error) {
    // El detalle queda en el servidor; a la persona se le muestra un mensaje simple.
    console.error(error);
    if (error instanceof Anthropic.RateLimitError) {
      return { error: "Hay muchas solicitudes ahora mismo. Inténtalo en un minuto." };
    }
    return { error: "No pudimos analizar tu uso ahora. Inténtalo de nuevo en un momento." };
  }

  refresh();
}
