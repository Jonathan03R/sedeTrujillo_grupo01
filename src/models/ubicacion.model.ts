/** Dónde está la persona, para buscar lugares cercanos. Viene del navegador, con su permiso, y no se guarda. */
export interface Ubicacion {
  latitud: number;
  longitud: number;
}

/** Plaza de Armas de Trujillo, Perú: ubicación FICTICIA que se usa si la persona no da permiso o el navegador no la entrega. */
export const UBICACION_DEMO: Ubicacion = { latitud: -8.1117, longitud: -79.0288 };

/** 3 decimales son ~110 m: suficiente para «cerca de ti» sin enviar un punto más exacto de lo necesario. */
const DECIMALES = 3;

function redondear(valor: number): number {
  return Number(valor.toFixed(DECIMALES));
}

/** La ubicación validada y redondeada, o null si no es un par de coordenadas reales. */
export function limpiarUbicacion(valor: unknown): Ubicacion | null {
  const u = (valor ?? {}) as Record<string, unknown>;
  const { latitud, longitud } = u;
  if (typeof latitud !== "number" || typeof longitud !== "number") return null;
  if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) return null;
  if (Math.abs(latitud) > 90 || Math.abs(longitud) > 180) return null;
  return { latitud: redondear(latitud), longitud: redondear(longitud) };
}
