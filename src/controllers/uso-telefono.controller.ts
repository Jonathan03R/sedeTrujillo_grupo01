import {
  DIAS_VENTANA,
  HORA_FIN_MADRUGADA,
  type ResumenDiaUso,
  type SesionTelefono,
} from "@/models/uso-telefono.model";
import { diaLocal, etiquetaDiaSemana, horaLocal, inicioDiaLocal } from "@/lib/fechas";
import { obtenerUltimoAnalisis } from "@/repositories/analisis-uso-telefono.repository";
import { listarSesionesTelefono } from "@/repositories/sesion-telefono.repository";

export interface VentanaUso {
  sesiones: readonly SesionTelefono[];
  primerDia: number;
  ultimoDia: number;
}

/** Los últimos DIAS_VENTANA días con datos. Parte de la última sesión (no del reloj) para ser determinista. */
export function ventanaReciente(todas: readonly SesionTelefono[]): VentanaUso | null {
  const ultima = todas[todas.length - 1];
  if (!ultima) return null;
  const ultimoDia = diaLocal(ultima.inicio);
  const primerDia = ultimoDia - DIAS_VENTANA + 1;
  return { sesiones: todas.filter((s) => diaLocal(s.inicio) >= primerDia), primerDia, ultimoDia };
}

export function esMadrugada(sesion: SesionTelefono): boolean {
  return horaLocal(sesion.inicio) < HORA_FIN_MADRUGADA;
}

export function resumirPorDia({ sesiones, primerDia, ultimoDia }: VentanaUso): ResumenDiaUso[] {
  const dias: ResumenDiaUso[] = [];
  for (let dia = primerDia; dia <= ultimoDia; dia++) {
    const delDia = sesiones.filter((s) => diaLocal(s.inicio) === dia);
    dias.push({
      dia,
      etiqueta: etiquetaDiaSemana(inicioDiaLocal(dia)),
      minutoTotal: delDia.reduce((total, s) => total + s.minuto, 0),
      minutoMadrugada: delDia.filter(esMadrugada).reduce((total, s) => total + s.minuto, 0),
      apertura: delDia.length,
    });
  }
  return dias;
}

function textoHoras(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = Math.round(minutos % 60);
  return horas > 0 ? `${horas} h ${resto} min` : `${resto} min`;
}

export async function obtenerPantallaUsoTelefono() {
  const [todas, analisis] = await Promise.all([listarSesionesTelefono(), obtenerUltimoAnalisis()]);
  const ventana = ventanaReciente(todas);
  const dias = ventana ? resumirPorDia(ventana) : [];

  const minutoTotal = dias.reduce((total, d) => total + d.minutoTotal, 0);
  const minutoMadrugada = dias.reduce((total, d) => total + d.minutoMadrugada, 0);
  const apertura = dias.reduce((total, d) => total + d.apertura, 0);

  return {
    dias,
    promedioDiario: dias.length > 0 ? textoHoras(minutoTotal / dias.length) : null,
    madrugada: textoHoras(minutoMadrugada),
    aperturaPromedio: dias.length > 0 ? Math.round(apertura / dias.length) : 0,
    analisis,
  };
}
