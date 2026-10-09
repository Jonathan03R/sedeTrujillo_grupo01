import { connection } from "next/server";
import {
  esActividadLugar,
  esIconoAlternativa,
  esIdVideo,
  type AlternativaAutocuidado,
  type LugarRecomendado,
  type NuevaRecomendacionPersonalizada,
  type RecomendacionPersonalizada,
  type VideoRecomendado,
} from "@/models/autocuidado.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";

// Tabla recomendaciones_autocuidado (ver db/schema.sql). Borrado lógico: solo filas con activo = true.
interface FilaRecomendacion {
  titulo: string | null;
  recomendacion: string;
  ejercicio: string | null;
  alternativas: unknown;
  lugar: unknown;
  video: unknown;
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

function aLugar(valor: unknown): LugarRecomendado | null {
  const l = (valor ?? {}) as Record<string, unknown>;
  return typeof l.nombre === "string" &&
    esActividadLugar(l.actividad) &&
    typeof l.distanciaMetros === "number" &&
    typeof l.latitud === "number" &&
    typeof l.longitud === "number" &&
    typeof l.motivo === "string"
    ? {
        nombre: l.nombre,
        actividad: l.actividad,
        distanciaMetros: l.distanciaMetros,
        latitud: l.latitud,
        longitud: l.longitud,
        motivo: l.motivo,
      }
    : null;
}

function aVideo(valor: unknown): VideoRecomendado | null {
  const v = (valor ?? {}) as Record<string, unknown>;
  return esIdVideo(v.videoId) && typeof v.titulo === "string" && typeof v.canal === "string" && typeof v.motivo === "string"
    ? {
        videoId: v.videoId,
        titulo: v.titulo,
        canal: v.canal,
        duracionMinutos: typeof v.duracionMinutos === "number" ? v.duracionMinutos : null,
        motivo: v.motivo,
      }
    : null;
}

/** La recomendación que la IA armó para ese registro emocional, o null si no hay (por ejemplo, si la IA falló). */
export async function obtenerRecomendacionDelRegistro(registroId: number): Promise<RecomendacionPersonalizada | null> {
  await connection(); // se genera al registrar: leerla en cada petición
  const { data, error } = await obtenerClienteServidor()
    .from("recomendaciones_autocuidado")
    .select("titulo, recomendacion, ejercicio, alternativas, lugar, video")
    .eq("registro_emocional_id", registroId)
    .eq("activo", true)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle<FilaRecomendacion>();

  lanzarSiHayError("leer la recomendación de autocuidado", error);
  if (!data) return null;
  return {
    titulo: data.titulo ?? null,
    ejercicioId: data.ejercicio ?? null,
    mensaje: data.recomendacion,
    alternativas: aAlternativas(data.alternativas),
    lugar: aLugar(data.lugar),
    video: aVideo(data.video),
  };
}

export async function guardarRecomendacion(nueva: NuevaRecomendacionPersonalizada): Promise<void> {
  const { error } = await obtenerClienteServidor().from("recomendaciones_autocuidado").insert({
    registro_emocional_id: nueva.registroEmocionalId,
    titulo: nueva.titulo,
    recomendacion: nueva.mensaje,
    ejercicio: nueva.ejercicioId,
    alternativas: nueva.alternativas,
    lugar: nueva.lugar,
    video: nueva.video,
    modelo: nueva.modelo,
  });
  lanzarSiHayError("guardar la recomendación de autocuidado", error);
}
