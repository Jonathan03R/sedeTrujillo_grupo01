import { connection } from "next/server";
import type { ClaseHorario, Evaluacion, TipoEvaluacion } from "@/models/academico.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tablas horarios_clases y evaluaciones (ver db/horario-academico.sql). Borrado lógico: solo filas con activo = true.
// Los datos son ficticios (db/seed-horario.sql).
interface FilaClase {
  curso: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
}

interface FilaEvaluacion {
  evaluacion_id: number;
  tipo: TipoEvaluacion;
  curso: string;
  titulo: string;
  fecha: string;
}

/** Las clases de la semana, ordenadas por día y hora. */
export async function listarClases(): Promise<readonly ClaseHorario[]> {
  await connection(); // el horario se puede editar: leerlo en cada petición
  const usuario = await obtenerUsuarioActual();

  const { data, error } = await obtenerClienteServidor()
    .from("horarios_clases")
    .select("curso, dia_semana, hora_inicio, hora_fin")
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .order("dia_semana", { ascending: true })
    .order("hora_inicio", { ascending: true })
    .overrideTypes<FilaClase[]>();

  lanzarSiHayError("listar el horario de clases", error);
  return (data ?? []).map((fila) => ({
    curso: fila.curso,
    diaSemana: fila.dia_semana,
    // La base devuelve «19:00:00»: se muestra «19:00».
    horaInicio: fila.hora_inicio.slice(0, 5),
    horaFin: fila.hora_fin.slice(0, 5),
  }));
}

/** Los exámenes y tareas, de la fecha más cercana a la más lejana. */
export async function listarEvaluaciones(): Promise<readonly Evaluacion[]> {
  await connection();
  const usuario = await obtenerUsuarioActual();

  const { data, error } = await obtenerClienteServidor()
    .from("evaluaciones")
    .select("evaluacion_id, tipo, curso, titulo, fecha")
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .order("fecha", { ascending: true })
    .overrideTypes<FilaEvaluacion[]>();

  lanzarSiHayError("listar exámenes y tareas", error);
  return (data ?? []).map((fila) => ({
    id: fila.evaluacion_id,
    tipo: fila.tipo,
    curso: fila.curso,
    titulo: fila.titulo,
    fecha: fila.fecha,
  }));
}
