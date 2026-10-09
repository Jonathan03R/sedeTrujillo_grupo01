import { connection } from "next/server";
import type { NuevoRegistroEmocional, RegistroEmocional } from "@/models/registro-emocional.model";

// FUENTE DE DATOS FICTICIA EN MEMORIA (se reinicia al reiniciar el servidor).
// Reemplazar por consultas a Supabase (tabla registros_emocionales, ver db/schema.sql).
const registros: RegistroEmocional[] = [
  { id: 1, emocion: "estres", intensidad: 4, registradoEn: "2026-09-14T20:10:00-05:00" },
  { id: 2, emocion: "ansiedad", intensidad: 3, registradoEn: "2026-09-16T09:00:00-05:00" },
  { id: 3, emocion: "tristeza", intensidad: 3, registradoEn: "2026-09-19T19:30:00-05:00" },
  { id: 4, emocion: "estres", intensidad: 4, registradoEn: "2026-09-22T08:45:00-05:00" },
  { id: 5, emocion: "ansiedad", intensidad: 4, registradoEn: "2026-09-24T21:15:00-05:00" },
  { id: 6, emocion: "estres", intensidad: 4, registradoEn: "2026-09-26T10:00:00-05:00" },
  { id: 7, emocion: "ansiedad", intensidad: 4, registradoEn: "2026-09-28T22:00:00-05:00" },
  { id: 8, emocion: "estres", intensidad: 3, registradoEn: "2026-09-30T13:20:00-05:00" },
  { id: 9, emocion: "tristeza", intensidad: 2, registradoEn: "2026-10-02T19:00:00-05:00" },
  { id: 10, emocion: "estres", intensidad: 4, registradoEn: "2026-10-03T08:40:00-05:00" },
  { id: 11, emocion: "ansiedad", intensidad: 3, registradoEn: "2026-10-04T21:00:00-05:00" },
  { id: 12, emocion: "estres", intensidad: 5, registradoEn: "2026-10-05T09:15:00-05:00" },
  { id: 13, emocion: "tristeza", intensidad: 2, registradoEn: "2026-10-06T18:30:00-05:00" },
  { id: 14, emocion: "tranquilidad", intensidad: 3, registradoEn: "2026-10-07T12:00:00-05:00" },
  { id: 15, emocion: "estres", intensidad: 5, registradoEn: "2026-10-08T20:15:00-05:00" },
  { id: 16, emocion: "tranquilidad", intensidad: 2, registradoEn: "2026-10-09T10:30:00-05:00" },
];

export async function listarRegistros(): Promise<readonly RegistroEmocional[]> {
  // Los registros cambian con cada petición: excluir esta lectura del prerenderizado.
  // Las páginas que la usan deben envolverse en <Suspense>.
  await connection();
  return registros;
}

export async function guardarRegistro(
  nuevo: NuevoRegistroEmocional,
  registradoEn: string,
): Promise<RegistroEmocional> {
  const registro: RegistroEmocional = { id: registros.length + 1, ...nuevo, registradoEn };
  registros.push(registro);
  return registro;
}
