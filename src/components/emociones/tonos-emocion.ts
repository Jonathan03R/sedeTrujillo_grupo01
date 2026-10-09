import type { EmocionId } from "@/models/emocion.model";

/** Color asociado a cada emoción. Se reutiliza en avatares, alertas, selector y gráficos. */
export interface TonoEmocion {
  /** Clases para un círculo/avatar. */
  fondo: string;
  borde: string;
  /** Clases para un recuadro suave (alertas). */
  suave: string;
  /** Tarjeta del selector: fondo pastel en reposo y borde cuando está elegida. */
  tarjeta: string;
  seleccionada: string;
  /** Fondo de la insignia de «elegida». */
  insignia: string;
  /** Colores hex para SVG (relleno y trazo). */
  relleno: string;
  trazo: string;
}

export const TONOS_EMOCION: Record<EmocionId, TonoEmocion> = {
  felicidad: {
    fondo: "bg-amber-100",
    borde: "border-amber-300",
    suave: "border-amber-100 bg-amber-50",
    tarjeta: "bg-amber-50",
    seleccionada: "border-amber-400",
    insignia: "bg-amber-500",
    relleno: "#fef3c7",
    trazo: "#fcd34d",
  },
  tranquilidad: {
    fondo: "bg-emerald-100",
    borde: "border-emerald-300",
    suave: "border-emerald-100 bg-emerald-50",
    tarjeta: "bg-emerald-50",
    seleccionada: "border-emerald-400",
    insignia: "bg-emerald-500",
    relleno: "#d1fae5",
    trazo: "#6ee7b7",
  },
  estres: {
    fondo: "bg-red-100",
    borde: "border-red-300",
    suave: "border-red-100 bg-red-50",
    tarjeta: "bg-rose-50",
    seleccionada: "border-red-500",
    insignia: "bg-red-500",
    relleno: "#fee2e2",
    trazo: "#fca5a5",
  },
  tristeza: {
    fondo: "bg-sky-100",
    borde: "border-sky-300",
    suave: "border-sky-100 bg-sky-50",
    tarjeta: "bg-sky-50",
    seleccionada: "border-sky-400",
    insignia: "bg-sky-500",
    relleno: "#e0f2fe",
    trazo: "#7dd3fc",
  },
  ansiedad: {
    fondo: "bg-violet-100",
    borde: "border-violet-300",
    suave: "border-violet-100 bg-violet-50",
    tarjeta: "bg-violet-50",
    seleccionada: "border-violet-400",
    insignia: "bg-violet-500",
    relleno: "#ede9fe",
    trazo: "#c4b5fd",
  },
  otra: {
    fondo: "bg-slate-100",
    borde: "border-slate-300",
    suave: "border-slate-200 bg-slate-50",
    tarjeta: "bg-slate-100",
    seleccionada: "border-slate-400",
    insignia: "bg-slate-500",
    relleno: "#f1f5f9",
    trazo: "#cbd5e1",
  },
};
