import { connection } from "next/server";
import type {
  AnalisisUsoTelefono,
  AnomaliaUso,
  NivelAtencion,
  NuevoAnalisisUsoTelefono,
  Senal,
  Severidad,
  TipoAnomalia,
} from "@/models/uso-telefono.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tablas analisis_uso_telefono y anomalias_uso_telefono (ver db/uso-telefono.sql).
interface FilaAnomalia {
  tipo: TipoAnomalia;
  fecha: string;
  severidad: Severidad;
  descripcion: string;
  activo: boolean;
}

interface FilaAnalisis {
  analisis_uso_telefono_id: number;
  desde: string;
  hasta: string;
  nivel_atencion: NivelAtencion;
  senal_predominante: Senal | null;
  resumen: string;
  sugerencias: string[];
  sugerir_profesional: boolean;
  alerta_roja: boolean;
  modelo: string;
  creado_en: string;
  anomalias_uso_telefono: FilaAnomalia[];
}

const COLUMNAS = `analisis_uso_telefono_id, desde, hasta, nivel_atencion, senal_predominante, resumen,
  sugerencias, sugerir_profesional, alerta_roja, modelo, creado_en,
  anomalias_uso_telefono (tipo, fecha, severidad, descripcion, activo)`;

function aAnomalia(fila: FilaAnomalia): AnomaliaUso {
  return { tipo: fila.tipo, fecha: fila.fecha, severidad: fila.severidad, descripcion: fila.descripcion };
}

function aModelo(fila: FilaAnalisis): AnalisisUsoTelefono {
  return {
    id: fila.analisis_uso_telefono_id,
    desde: fila.desde,
    hasta: fila.hasta,
    nivelAtencion: fila.nivel_atencion,
    senalPredominante: fila.senal_predominante,
    resumen: fila.resumen,
    sugerencias: fila.sugerencias,
    sugerirProfesional: fila.sugerir_profesional,
    alertaRoja: fila.alerta_roja,
    modelo: fila.modelo,
    creadoEn: fila.creado_en,
    anomalias: fila.anomalias_uso_telefono
      .filter((anomalia) => anomalia.activo)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .map(aAnomalia),
  };
}

export async function obtenerUltimoAnalisis(): Promise<AnalisisUsoTelefono | null> {
  await connection();
  const usuario = await obtenerUsuarioActual();

  const { data, error } = await obtenerClienteServidor()
    .from("analisis_uso_telefono")
    .select(COLUMNAS)
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle<FilaAnalisis>();

  lanzarSiHayError("leer el último análisis de uso", error);
  return data ? aModelo(data) : null;
}

/** Guarda el análisis con sus anomalías y devuelve su id. */
export async function guardarAnalisis(nuevo: NuevoAnalisisUsoTelefono): Promise<number> {
  const usuario = await obtenerUsuarioActual();
  const supabase = obtenerClienteServidor();

  const { data, error } = await supabase
    .from("analisis_uso_telefono")
    .insert({
      usuario_id: usuario.id,
      desde: nuevo.desde,
      hasta: nuevo.hasta,
      nivel_atencion: nuevo.nivelAtencion,
      senal_predominante: nuevo.senalPredominante,
      resumen: nuevo.resumen,
      sugerencias: nuevo.sugerencias,
      sugerir_profesional: nuevo.sugerirProfesional,
      alerta_roja: nuevo.alertaRoja,
      modelo: nuevo.modelo,
    })
    .select("analisis_uso_telefono_id")
    .single<{ analisis_uso_telefono_id: number }>();

  lanzarSiHayError("guardar el análisis de uso", error);
  const analisisId = (data as { analisis_uso_telefono_id: number }).analisis_uso_telefono_id;
  if (nuevo.anomalias.length === 0) return analisisId;

  const { error: errorAnomalias } = await supabase.from("anomalias_uso_telefono").insert(
    nuevo.anomalias.map((anomalia) => ({
      analisis_uso_telefono_id: analisisId,
      tipo: anomalia.tipo,
      fecha: anomalia.fecha,
      severidad: anomalia.severidad,
      descripcion: anomalia.descripcion,
    })),
  );

  if (errorAnomalias) {
    // Sin transacción en la API: se desactiva el análisis incompleto (borrado lógico) para no mostrarlo a medias.
    await supabase
      .from("analisis_uso_telefono")
      .update({ activo: false })
      .eq("analisis_uso_telefono_id", analisisId);
  }
  lanzarSiHayError("guardar las anomalías del análisis", errorAnomalias);
  return analisisId;
}
