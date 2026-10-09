// Utilidades de fecha deterministas: no leen el reloj, solo formatean la fecha que reciben.
// Lima es UTC-5 todo el año (no tiene horario de verano).
const ZONA = "America/Lima";
const MS_DIA = 86_400_000;
const DESFASE_LIMA_MS = 5 * 3_600_000;

/** Número de día local (Lima). Sirve para comparar días y calcular rangos. */
export function diaLocal(iso: string): number {
  return Math.floor((Date.parse(iso) - DESFASE_LIMA_MS) / MS_DIA);
}

/** Inicio (ISO, UTC) del día local de Lima indicado por diaLocal(). */
export function inicioDiaLocal(dia: number): string {
  return new Date(dia * MS_DIA + DESFASE_LIMA_MS).toISOString();
}

/** Hora local (Lima), de 0 a 23. */
export function horaLocal(iso: string): number {
  return new Date(Date.parse(iso) - DESFASE_LIMA_MS).getUTCHours();
}

/** «2026-10-09»: el día local indicado por diaLocal(). */
export function fechaLocal(dia: number): string {
  return new Date(dia * MS_DIA).toISOString().slice(0, 10);
}

/** «Mié 07/10 01:40»: compacto, para enviar datos a la IA. */
export function fechaHoraCompacta(iso: string): string {
  const local = new Date(Date.parse(iso) - DESFASE_LIMA_MS).toISOString();
  return `${etiquetaDiaSemana(iso)} ${local.slice(8, 10)}/${local.slice(5, 7)} ${local.slice(11, 16)}`;
}

function formatear(iso: string, opciones: Intl.DateTimeFormatOptions): string {
  const texto = new Intl.DateTimeFormat("es-PE", { timeZone: ZONA, ...opciones }).format(new Date(iso));
  const limpio = texto.replace(/\./g, "").trim();
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

/** «Sáb» */
export function etiquetaDiaSemana(iso: string): string {
  return formatear(iso, { weekday: "short" });
}

/** «3 oct» */
export function etiquetaDiaMes(iso: string): string {
  return formatear(iso, { day: "numeric", month: "short" });
}

/** «Vie, 9 oct, 10:30 a m» */
export function fechaHoraLegible(iso: string): string {
  return formatear(iso, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
