import type { EmocionId } from "@/models/emocion.model";

/** Color asociado a cada emoción. Se reutiliza en avatares, alertas y gráficos. */
export interface TonoEmocion {
  /** Clases para un círculo/avatar. */
  fondo: string;
  borde: string;
  /** Clases para un recuadro suave (alertas). */
  suave: string;
  /** Colores hex para SVG (relleno y trazo). */
  relleno: string;
  trazo: string;
}

export const TONOS_EMOCION: Record<EmocionId, TonoEmocion> = {
  felicidad: {
    fondo: "bg-amber-100",
    borde: "border-amber-300",
    suave: "border-amber-100 bg-amber-50",
    relleno: "#fef3c7",
    trazo: "#fcd34d",
  },
  tranquilidad: {
    fondo: "bg-emerald-100",
    borde: "border-emerald-300",
    suave: "border-emerald-100 bg-emerald-50",
    relleno: "#d1fae5",
    trazo: "#6ee7b7",
  },
  estres: {
    fondo: "bg-red-100",
    borde: "border-red-300",
    suave: "border-red-100 bg-red-50",
    relleno: "#fee2e2",
    trazo: "#fca5a5",
  },
  tristeza: {
    fondo: "bg-sky-100",
    borde: "border-sky-300",
    suave: "border-sky-100 bg-sky-50",
    relleno: "#e0f2fe",
    trazo: "#7dd3fc",
  },
  ansiedad: {
    fondo: "bg-violet-100",
    borde: "border-violet-300",
    suave: "border-violet-100 bg-violet-50",
    relleno: "#ede9fe",
    trazo: "#c4b5fd",
  },
};
