"use server";

import { esEmocionId, esIntensidad } from "@/models/emocion.model";
import type { ResultadoRegistro } from "@/models/registro-emocional.model";
import { buscarEjercicioParaEmocion } from "@/repositories/ejercicio.repository";
import { guardarRegistro } from "@/repositories/registro-emocional.repository";

// Server Action: se puede invocar con un POST directo, por eso valida todo lo que recibe.
// TODO: verificar la sesión del usuario cuando exista autenticación.
export async function registrarEmocion(
  emocion: unknown,
  intensidad: unknown,
): Promise<ResultadoRegistro> {
  if (!esEmocionId(emocion) || !esIntensidad(intensidad)) {
    return { ok: false, error: "Elige una emoción y una intensidad del 1 al 5." };
  }

  await guardarRegistro({ emocion, intensidad }, new Date().toISOString());

  // Recomendación por reglas. Más adelante: recomendación personalizada con IA generativa.
  const recomendacion = await buscarEjercicioParaEmocion(emocion);
  return { ok: true, recomendacion };
}
