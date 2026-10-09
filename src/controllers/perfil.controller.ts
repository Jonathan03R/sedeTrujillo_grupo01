import { DIAS_EVALUACIONES_PROXIMAS, type EvaluacionProxima } from "@/models/academico.model";
import type { DatosRecopilados } from "@/models/perfil.model";
import { diaLocal, fechaHoraLegible } from "@/lib/fechas";
import { obtenerUltimoAnalisis } from "@/repositories/analisis-uso-telefono.repository";
import { listarGustos } from "@/repositories/gusto.repository";
import { listarClases, listarEvaluaciones } from "@/repositories/horario.repository";
import { listarRegistros } from "@/repositories/registro-emocional.repository";
import { contarRespuestas, obtenerPreguntaPendiente } from "@/repositories/respuesta.repository";
import { listarSesionesTelefono } from "@/repositories/sesion-telefono.repository";
import { obtenerUsuarioActual } from "@/repositories/usuario.repository";
import { resumirUso } from "./uso-telefono.controller";

export async function obtenerPantallaPerfil() {
  const [usuario, gustos, clases, evaluaciones, sesiones, analisis, registros, respuestas, pendiente] = await Promise.all([
    obtenerUsuarioActual(),
    listarGustos(),
    listarClases(),
    listarEvaluaciones(),
    listarSesionesTelefono(),
    obtenerUltimoAnalisis(),
    listarRegistros(),
    contarRespuestas(),
    obtenerPreguntaPendiente(),
  ]);
  const iniciales = usuario.alias.slice(0, 2).toUpperCase();

  // Los repositorios ya leyeron datos por petición (connection()), así que aquí se puede leer el reloj.
  const hoy = diaLocal(new Date().toISOString());
  const proximas: EvaluacionProxima[] = evaluaciones
    .map((e) => ({ ...e, diasRestantes: diaLocal(`${e.fecha}T00:00:00-05:00`) - hoy }))
    .filter((e) => e.diasRestantes >= 0 && e.diasRestantes <= DIAS_EVALUACIONES_PROXIMAS);

  const uso = resumirUso(sesiones);
  const recopilado: DatosRecopilados = {
    promedioDiario: uso.promedioDiario,
    madrugada: uso.madrugada,
    aperturaPromedio: uso.aperturaPromedio,
    ultimoAnalisis: analisis ? { cuando: fechaHoraLegible(analisis.creadoEn), nivel: analisis.nivelAtencion } : null,
    registrosEmocionales: registros.length,
    respuestas,
    gustos: gustos.length,
    preguntaPendiente: pendiente?.texto ?? null,
  };

  return { usuario, iniciales, gustos, horario: { clases, evaluaciones: proximas }, recopilado };
}
