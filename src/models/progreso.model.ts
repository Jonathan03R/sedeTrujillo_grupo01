import type { Emocion, Intensidad } from "./emocion.model";

export type PeriodoProgreso = "semana" | "mes" | "todos";

/** Un registro dibujado en el gráfico de línea (eje Y = intensidad). */
export interface PuntoGrafico {
  etiqueta: string;
  intensidad: Intensidad;
  emocion: Emocion;
}

export interface EstadoActual {
  emocion: Emocion;
  intensidad: Intensidad;
}

/** Compara el ánimo de esta semana con el de la semana anterior. */
export type Tendencia = "mejora" | "estable" | "baja";

export interface RegistroReciente {
  id: number;
  emocion: Emocion;
  intensidad: Intensidad;
  fechaTexto: string;
}

export interface Habito {
  id: string;
  nombre: string;
  completados: number;
  meta: number;
}
