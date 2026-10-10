"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { esEmocionId, esIntensidad } from "@/models/emocion.model";
import { limpiarUbicacion } from "@/models/ubicacion.model";
import type { ErrorRegistro } from "@/models/registro-emocional.model";
import { ejecutarAnalisisInterno } from "./analisis-uso.controller";
import { generarRecomendacionPersonalizada } from "./autocuidado.controller";
import { guardarRegistro } from "@/repositories/registro-emocional.repository";
import { marcarRecomendacionPendiente } from "@/repositories/recomendacion-autocuidado.repository";

// Server Action: se puede invocar con un POST directo, por eso valida todo lo que recibe.
// Si el registro es válido guarda, marca el check-in y envía a la persona a la app (/inicio).
// TODO: verificar la sesión del usuario cuando exista autenticación.
export async function registrarEmocion(
  emocion: unknown,
  intensidad: unknown,
  ubicacion?: unknown,
): Promise<ErrorRegistro> {
  if (!esEmocionId(emocion) || !esIntensidad(intensidad)) {
    return { error: "Elige una emoción y una intensidad del 1 al 10." };
  }

  try {
    // La emoción marcada debe existir y estar activa en el catálogo de la base (tabla emociones).
    const registro = await guardarRegistro({ emocion, intensidad }, new Date().toISOString());
    if (!registro) return { error: "Esa emoción no está disponible. Elige otra." };

    // Deja visible el estado antes de redirigir. La generación lenta corre tras responder.
    try { await marcarRecomendacionPendiente(registro.id, null); } catch (error) { console.error(error); }

    // Ubicación solo se usa para buscar, nunca se guarda. Registro no espera a la IA.
    const punto = limpiarUbicacion(ubicacion);
    after(async () => {
      await Promise.allSettled([
        generarRecomendacionPersonalizada(registro, punto),
        ejecutarAnalisisInterno(),
      ]);
    });
  } catch (error) {
    console.error(error); // el detalle queda en el servidor; a la persona se le muestra un mensaje simple
    return { error: "No pudimos guardar tu registro. Inténtalo de nuevo en un momento." };
  }

  redirect("/inicio");
}
