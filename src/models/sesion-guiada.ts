import type { Ejercicio } from "./ejercicio.model";

/** Un paso de la sesión guiada: lo que se hace y cuánto dura. */
export interface PasoSesion {
  titulo: string;
  detalle: string;
  segundos: number;
}

/** Si el texto de un paso no dice cuánto dura, este es el tiempo por defecto. */
const SEGUNDOS_POR_DEFECTO = 10;

const DETALLE_ACCION = {
  inhalar: "Inhala despacio por la nariz.",
  sostener: "Mantén el aire con calma.",
  exhalar: "Exhala lento por la boca.",
} as const;

/** «Tensa los hombros 5 segundos y suéltalos.» -> 5 */
function segundosEnTexto(paso: string): number {
  const coincidencia = /(\d+)\s*segundos?/i.exec(paso);
  return coincidencia ? Number(coincidencia[1]) : SEGUNDOS_POR_DEFECTO;
}

/**
 * Los pasos de la sesión. Los de respiración repiten su ciclo hasta cubrir la duración del ejercicio;
 * los demás usan sus pasos tal cual.
 */
export function construirPasos(ejercicio: Ejercicio): PasoSesion[] {
  const fases = ejercicio.fases;
  if (fases) {
    const cicloSegundos = fases.reduce((total, fase) => total + fase.segundos, 0);
    const ciclos = Math.max(1, Math.round((ejercicio.duracionMinutos * 60) / cicloSegundos));
    const ciclo: PasoSesion[] = fases.map((fase) => ({
      titulo: fase.etiqueta,
      detalle: DETALLE_ACCION[fase.accion],
      segundos: fase.segundos,
    }));
    return Array.from({ length: ciclos }, () => ciclo).flat();
  }

  return (ejercicio.pasos ?? []).map((paso, i) => ({
    titulo: `Paso ${i + 1}`,
    detalle: paso,
    segundos: segundosEnTexto(paso),
  }));
}
