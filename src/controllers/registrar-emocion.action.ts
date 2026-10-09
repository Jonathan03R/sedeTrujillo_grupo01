"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { esEmocionId, esIntensidad } from "@/models/emocion.model";
import type { ErrorRegistro } from "@/models/registro-emocional.model";
import { COOKIE_CHECKIN, DURACION_CHECKIN_SEGUNDOS } from "@/lib/checkin";
import { ejecutarAnalisisInterno } from "./analisis-uso.controller";
import { generarRecomendacionPersonalizada } from "./autocuidado.controller";
import { guardarRegistro } from "@/repositories/registro-emocional.repository";

// Server Action: se puede invocar con un POST directo, por eso valida todo lo que recibe.
// Si el registro es válido guarda, marca el check-in y envía a la persona a la app (/inicio).
// TODO: verificar la sesión del usuario cuando exista autenticación.
export async function registrarEmocion(emocion: unknown, intensidad: unknown): Promise<ErrorRegistro> {
  if (!esEmocionId(emocion) || !esIntensidad(intensidad)) {
    return { error: "Elige una emoción y una intensidad del 1 al 10." };
  }

  try {
    // La emoción marcada debe existir y estar activa en el catálogo de la base (tabla emociones).
    const registro = await guardarRegistro({ emocion, intensidad }, new Date().toISOString());
    if (!registro) return { error: "Esa emoción no está disponible. Elige otra." };

    // En tiempo real: la IA personaliza el autocuidado con la emoción, su intensidad y los gustos.
    // Nunca lanza; si falla, Inicio muestra la recomendación fija.
    await generarRecomendacionPersonalizada(registro);
  } catch (error) {
    console.error(error); // el detalle queda en el servidor; a la persona se le muestra un mensaje simple
    return { error: "No pudimos guardar tu registro. Inténtalo de nuevo en un momento." };
  }

  // Análisis interno en segundo plano (como el monitoreo del teléfono): no hace esperar a la persona.
  after(ejecutarAnalisisInterno);

  (await cookies()).set(COOKIE_CHECKIN, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_CHECKIN_SEGUNDOS,
  });

  redirect("/inicio");
}
