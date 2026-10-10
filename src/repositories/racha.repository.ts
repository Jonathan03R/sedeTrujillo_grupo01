import { connection } from "next/server";
import { diaLocal, fechaLocal } from "@/lib/fechas";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Rachas en la base (ver db/rachas.sql): recalcular_racha guarda la racha; racha_semana devuelve la semana.
export interface DiaRacha {
  dia: string;
  conRegistro: boolean;
  esHoy: boolean;
}

export interface Racha {
  actual: number;
  mejor: number;
  semana: readonly DiaRacha[];
}

/** Hoy en hora de Lima, como «AAAA-MM-DD». Se lee aquí (no en lib/) porque depende del momento de la petición. */
function hoyLima(): string {
  return fechaLocal(diaLocal(new Date().toISOString()));
}

/** Vuelve a calcular la racha de la persona después de un registro. */
export async function recalcularRacha(): Promise<void> {
  const usuario = await obtenerUsuarioActual();
  const { error } = await obtenerClienteServidor().rpc("recalcular_racha", { p_usuario: usuario.id, p_hoy: hoyLima() });
  lanzarSiHayError("recalcular la racha", error);
}

/** La racha actual, la mejor y los 7 días de la semana con su estado. */
export async function obtenerRacha(): Promise<Racha> {
  await connection(); // cambia con cada registro: excluir del prerenderizado
  const usuario = await obtenerUsuarioActual();
  const supabase = obtenerClienteServidor();
  const hoy = hoyLima();

  const [{ data: semana, error: errorSemana }, { data: fila, error: errorFila }] = await Promise.all([
    supabase.rpc("racha_semana", { p_usuario: usuario.id, p_hoy: hoy }),
    supabase.from("rachas").select("racha_actual, mejor_racha").eq("usuario_id", usuario.id).maybeSingle<{ racha_actual: number; mejor_racha: number }>(),
  ]);
  lanzarSiHayError("leer la semana de la racha", errorSemana);
  lanzarSiHayError("leer la racha", errorFila);

  return {
    actual: fila?.racha_actual ?? 0,
    mejor: fila?.mejor_racha ?? 0,
    semana: ((semana ?? []) as { dia: string; con_registro: boolean; es_hoy: boolean }[]).map((d) => ({
      dia: d.dia,
      conRegistro: d.con_registro,
      esHoy: d.es_hoy,
    })),
  };
}
