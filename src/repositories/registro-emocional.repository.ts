import { connection } from "next/server";
import { esEmocionId, type Intensidad } from "@/models/emocion.model";
import type { NuevoRegistroEmocional, RegistroEmocional } from "@/models/registro-emocional.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { buscarIdEmocionActiva } from "./emocion.repository";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tabla registros_emocionales (ver db/schema.sql). Borrado lógico: solo filas con activo = true.
// Cada fila es la respuesta a «¿Qué emoción sientes?»: la emoción se guarda como emocion_id (tabla emociones).
interface FilaRegistro {
  registro_emocional_id: number;
  intensidad: Intensidad;
  registrado_en: string;
  emociones: { nombre: string };
}

const COLUMNAS = "registro_emocional_id, intensidad, registrado_en, emociones!registros_emocionales_emocion_id_fkey (nombre)";

function aModelo(fila: FilaRegistro): RegistroEmocional | null {
  const emocion = fila.emociones.nombre;
  if (!esEmocionId(emocion)) return null; // emoción que la app no sabe pintar
  return {
    id: fila.registro_emocional_id,
    emocion,
    intensidad: fila.intensidad,
    registradoEn: fila.registrado_en,
  };
}

export async function listarRegistros(): Promise<readonly RegistroEmocional[]> {
  await connection(); // los registros cambian con cada petición: excluir del prerenderizado
  const usuario = await obtenerUsuarioActual();

  const { data, error } = await obtenerClienteServidor()
    .from("registros_emocionales")
    .select(COLUMNAS)
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .order("registrado_en", { ascending: true })
    .overrideTypes<FilaRegistro[]>();

  lanzarSiHayError("listar registros emocionales", error);
  return (data ?? []).flatMap((fila) => aModelo(fila) ?? []);
}

/** Guarda el registro. Devuelve null si la emoción no está disponible en el catálogo. */
export async function guardarRegistro(
  nuevo: NuevoRegistroEmocional,
  registradoEn: string,
): Promise<RegistroEmocional | null> {
  const [usuario, emocionId] = await Promise.all([obtenerUsuarioActual(), buscarIdEmocionActiva(nuevo.emocion)]);
  if (emocionId === null) return null;

  const { data, error } = await obtenerClienteServidor()
    .from("registros_emocionales")
    .insert({
      usuario_id: usuario.id,
      emocion_id: emocionId,
      intensidad: nuevo.intensidad,
      registrado_en: registradoEn,
    })
    .select(COLUMNAS)
    .single<FilaRegistro>();

  lanzarSiHayError("guardar el registro emocional", error);
  return aModelo(data as FilaRegistro);
}
