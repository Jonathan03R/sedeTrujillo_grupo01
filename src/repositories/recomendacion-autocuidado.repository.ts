import { connection } from "next/server";
import {
  esIconoAlternativa,
  type AlternativaAutocuidado,
  type NuevaRecomendacionPersonalizada,
  type RecomendacionPersonalizada,
} from "@/models/autocuidado.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";

// Tabla recomendaciones_autocuidado (ver db/schema.sql). Borrado lógico: solo filas con activo = true.
interface FilaRecomendacion {
  recomendacion: string;
  ejercicio: string | null;
  alternativas: unknown;
}

/** El jsonb de la base puede traer cualquier cosa: se queda solo con lo que tiene la forma esperada. */
function aAlternativas(valor: unknown): AlternativaAutocuidado[] {
  if (!Array.isArray(valor)) return [];
  return valor.flatMap((item: unknown) => {
    const a = (item ?? {}) as Record<string, unknown>;
    return typeof a.titulo === "string" && typeof a.descripcion === "string" && esIconoAlternativa(a.icono)
      ? [{ titulo: a.titulo, descripcion: a.descripcion, icono: a.icono }]
      : [];
  });
}

/** La recomendación que la IA armó para ese registro emocional, o null si no hay (por ejemplo, si la IA falló). */
export async function obtenerRecomendacionDelRegistro(registroId: number): Promise<RecomendacionPersonalizada | null> {
  await connection(); // se genera al registrar: leerla en cada petición
  const { data, error } = await obtenerClienteServidor()
    .from("recomendaciones_autocuidado")
    .select("recomendacion, ejercicio, alternativas")
    .eq("registro_emocional_id", registroId)
    .eq("activo", true)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle<FilaRecomendacion>();

  lanzarSiHayError("leer la recomendación de autocuidado", error);
  if (!data?.ejercicio) return null;
  return { ejercicioId: data.ejercicio, mensaje: data.recomendacion, alternativas: aAlternativas(data.alternativas) };
}

export async function guardarRecomendacion(nueva: NuevaRecomendacionPersonalizada): Promise<void> {
  const { error } = await obtenerClienteServidor().from("recomendaciones_autocuidado").insert({
    registro_emocional_id: nueva.registroEmocionalId,
    recomendacion: nueva.mensaje,
    ejercicio: nueva.ejercicioId,
    alternativas: nueva.alternativas,
    modelo: nueva.modelo,
  });
  lanzarSiHayError("guardar la recomendación de autocuidado", error);
}
