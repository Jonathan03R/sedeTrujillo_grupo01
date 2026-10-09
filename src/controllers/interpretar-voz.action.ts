"use server";

import { esEmocionId, esIntensidad, type EmocionId, type Intensidad } from "@/models/emocion.model";
import { MODELO_IA, obtenerClienteIA } from "@/lib/ia/cliente";
import { ESPERANDO, SIN_EMOCION, esquemaVoz, instruccionesVoz, type Esperando } from "@/lib/ia/voz-prompt";
import { listarEmociones } from "@/repositories/emocion.repository";

// Server Action: se puede invocar con un POST directo, por eso valida todo lo que recibe.
// Recibe solo el texto transcrito y qué se espera oír; no lleva ningún dato de la persona.
// TODO: verificar la sesión del usuario (y limitar el uso) cuando exista autenticación.

const LARGO_MINIMO = 1;
const LARGO_MAXIMO = 300;

export type RespuestaVoz =
  | { emocion: EmocionId | null; intensidad: Intensidad | null }
  | { error: string };

function esEsperando(valor: unknown): valor is Esperando {
  return ESPERANDO.some((e) => e === valor);
}

export async function interpretarRespuestaVoz(texto: unknown, esperando: unknown): Promise<RespuestaVoz> {
  const dicho = typeof texto === "string" ? texto.replace(/\s+/g, " ").trim() : "";
  if (dicho.length < LARGO_MINIMO || dicho.length > LARGO_MAXIMO || !esEsperando(esperando)) {
    return { error: "No entendí lo que dijiste." };
  }

  try {
    const emociones = await listarEmociones();
    const ids = emociones.map((e) => e.id);

    const respuesta = await obtenerClienteIA().beta.messages.create(
      {
        model: MODELO_IA,
        max_tokens: 2000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        // Esfuerzo bajo: la persona espera hablando y la tarea es corta.
        output_config: { effort: "low", format: { type: "json_schema", schema: esquemaVoz(ids) } },
        system: instruccionesVoz(emociones),
        messages: [{ role: "user", content: `La app espera: ${esperando}\nLo que la persona dijo: «${dicho}»` }],
      },
      { timeout: 20_000, maxRetries: 0 },
    );

    if (respuesta.stop_reason === "refusal" || respuesta.stop_reason === "max_tokens") {
      return { error: "No pude entender tu respuesta ahora." };
    }

    const bloque = respuesta.content.find((b) => b.type === "text");
    const bruto = bloque ? (JSON.parse(bloque.text) as { emocion?: unknown; intensidad?: unknown }) : null;
    if (!bruto) return { error: "No pude entender tu respuesta ahora." };

    // La IA solo propone: se valida contra el catálogo real y la escala antes de usarlo.
    const emocion = bruto.emocion !== SIN_EMOCION && esEmocionId(bruto.emocion) && ids.includes(bruto.emocion) ? bruto.emocion : null;
    const intensidad = esIntensidad(bruto.intensidad) ? bruto.intensidad : null;
    return { emocion, intensidad };
  } catch (error) {
    console.error(error); // el detalle queda en el servidor; a la persona se le dice algo simple
    return { error: "No pude entender tu respuesta ahora." };
  }
}
