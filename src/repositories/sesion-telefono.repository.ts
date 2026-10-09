import { connection } from "next/server";
import type { CategoriaAplicacion, SesionTelefono } from "@/models/uso-telefono.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";
import { obtenerUsuarioActual } from "./usuario.repository";

// Tabla sesiones_telefono (ver db/uso-telefono.sql). En el prototipo los datos son ficticios.
// No se lee anomalia_simulada: es la «respuesta correcta» de la demostración y la IA no debe verla.
interface FilaSesion {
  inicio: string;
  minuto: number;
  aplicaciones: { nombre: string; categoria: CategoriaAplicacion };
}

export async function listarSesionesTelefono(): Promise<readonly SesionTelefono[]> {
  await connection(); // el uso cambia con cada petición: excluir del prerenderizado
  const usuario = await obtenerUsuarioActual();

  const { data, error } = await obtenerClienteServidor()
    .from("sesiones_telefono")
    .select("inicio, minuto, aplicaciones!inner (nombre, categoria)")
    .eq("usuario_id", usuario.id)
    .eq("activo", true)
    .order("inicio", { ascending: true })
    .overrideTypes<FilaSesion[]>();

  lanzarSiHayError("listar el uso del teléfono", error);
  return (data ?? []).map((fila) => ({
    aplicacion: fila.aplicaciones.nombre,
    categoria: fila.aplicaciones.categoria,
    inicio: fila.inicio,
    minuto: fila.minuto,
  }));
}
