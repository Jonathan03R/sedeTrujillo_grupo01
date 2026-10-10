import { connection } from "next/server";
import type { LugarRecomendado } from "@/models/autocuidado.model";
import type { EmocionId } from "@/models/emocion.model";
import { UBICACION_DEMO } from "@/models/ubicacion.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { distanciaMetros } from "./lugar.repository";

// Catálogo ESTÁTICO de prueba (ver db/catalogo-estatico.sql): lugares de Trujillo por gusto y videos por emoción.
// Datos de demostración; los videos abren búsquedas de YouTube.

interface FilaLugar {
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
}

interface FilaVideo {
  titulo: string;
  canal: string;
  consulta: string;
}

/** Un video de demostración según la emoción de hoy. El enlace abre una búsqueda de YouTube. */
export interface VideoEmocion {
  titulo: string;
  canal: string;
  consulta: string;
}

/** Los lugares de Trujillo que coinciden con los gustos de la persona, de más cerca a más lejos. */
export async function listarLugaresPorGustos(gustos: readonly string[]): Promise<LugarRecomendado[]> {
  await connection();
  if (gustos.length === 0) return [];

  const { data, error } = await obtenerClienteServidor()
    .from("lugares_trujillo")
    .select("nombre, descripcion, latitud, longitud")
    .in("gusto", [...gustos])
    .eq("activo", true)
    .overrideTypes<FilaLugar[]>();
  lanzarSiHayError("listar lugares de Trujillo", error);

  // Sin repetir el mismo lugar (un lugar puede estar ligado a varios gustos).
  const vistos = new Set<string>();
  return (data ?? [])
    .filter((f) => (vistos.has(f.nombre + f.latitud) ? false : vistos.add(f.nombre + f.latitud)))
    .map((f): LugarRecomendado => ({
      nombre: f.nombre,
      actividad: "basquet",
      distanciaMetros: Math.round(distanciaMetros(UBICACION_DEMO.latitud, UBICACION_DEMO.longitud, Number(f.latitud), Number(f.longitud))),
      latitud: Number(f.latitud),
      longitud: Number(f.longitud),
      motivo: f.descripcion,
    }))
    .sort((a, b) => a.distanciaMetros - b.distanciaMetros);
}

/** Los videos de demostración para una emoción. */
export async function listarVideosDeEmocion(emocion: EmocionId): Promise<VideoEmocion[]> {
  await connection();
  const { data, error } = await obtenerClienteServidor()
    .from("videos_emociones")
    .select("titulo, canal, consulta")
    .eq("emocion", emocion)
    .eq("activo", true)
    .order("video_emocion_id", { ascending: true })
    .overrideTypes<FilaVideo[]>();
  lanzarSiHayError("listar videos de la emoción", error);
  return data ?? [];
}
