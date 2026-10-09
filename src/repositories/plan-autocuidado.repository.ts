import { connection } from "next/server";
import type { EmocionId, Intensidad } from "@/models/emocion.model";
import type { PlanAutocuidado } from "@/models/plan-autocuidado.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";

// Tabla recomendaciones_ejercicios (ver db/recomendaciones-ejercicios.sql). Solo filas con activo = true.
interface FilaPlan {
  intensidad_desde: Intensidad;
  intensidad_hasta: Intensidad;
  recomendacion: string;
  ejercicio: string | null;
}

const COLUMNAS = "intensidad_desde, intensidad_hasta, recomendacion, ejercicio, emociones!inner (nombre)";

function aModelo(fila: FilaPlan): PlanAutocuidado {
  return {
    desde: fila.intensidad_desde,
    hasta: fila.intensidad_hasta,
    recomendacion: fila.recomendacion,
    ejercicioId: fila.ejercicio,
  };
}

/** La recomendación y el ejercicio de la franja que contiene esa intensidad, o null si la emoción no tiene franja. */
export async function buscarPlan(emocion: EmocionId, intensidad: number): Promise<PlanAutocuidado | null> {
  await connection(); // la tabla se puede editar: leerla en cada petición
  const { data, error } = await obtenerClienteServidor()
    .from("recomendaciones_ejercicios")
    .select(COLUMNAS)
    .eq("emociones.nombre", emocion)
    .eq("activo", true)
    .lte("intensidad_desde", intensidad)
    .gte("intensidad_hasta", intensidad)
    .limit(1)
    .maybeSingle<FilaPlan>();

  lanzarSiHayError("buscar la recomendación y el ejercicio", error);
  return data ? aModelo(data) : null;
}

/** Las franjas de una emoción, de menor a mayor intensidad. */
export async function listarPlanesDeEmocion(emocion: EmocionId): Promise<readonly PlanAutocuidado[]> {
  await connection();
  const { data, error } = await obtenerClienteServidor()
    .from("recomendaciones_ejercicios")
    .select(COLUMNAS)
    .eq("emociones.nombre", emocion)
    .eq("activo", true)
    .order("intensidad_desde", { ascending: true })
    .overrideTypes<FilaPlan[]>();

  lanzarSiHayError("listar las franjas de la emoción", error);
  return (data ?? []).map(aModelo);
}
