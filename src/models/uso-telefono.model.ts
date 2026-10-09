// Monitoreo del uso del teléfono (en el prototipo web los datos son ficticios).
// La IA compara la semana con la propia rutina de la persona y señala cambios: no diagnostica.

export type CategoriaAplicacion =
  | "redes_sociales"
  | "mensajeria"
  | "entretenimiento"
  | "productividad"
  | "educacion"
  | "juegos"
  | "salud"
  | "otro";

export type NivelAtencion = "bajo" | "medio" | "alto";
export type Senal = "bienestar" | "cansancio" | "animo_bajo" | "activacion" | "irritabilidad";
export type TipoAnomalia =
  | "uso_nocturno"
  | "pico_uso"
  | "revision_frecuente"
  | "menos_contacto"
  | "abandono_rutina"
  | "otro";
export type Severidad = "leve" | "moderada" | "alta";

export const NIVELES_ATENCION: readonly NivelAtencion[] = ["bajo", "medio", "alto"];
export const SENALES: readonly Senal[] = ["bienestar", "cansancio", "animo_bajo", "activacion", "irritabilidad"];
export const TIPOS_ANOMALIA: readonly TipoAnomalia[] = [
  "uso_nocturno",
  "pico_uso",
  "revision_frecuente",
  "menos_contacto",
  "abandono_rutina",
  "otro",
];
export const SEVERIDADES: readonly Severidad[] = ["leve", "moderada", "alta"];

export const ETIQUETAS_ANOMALIA: Record<TipoAnomalia, string> = {
  uso_nocturno: "Uso de madrugada",
  pico_uso: "Mucho más tiempo de pantalla",
  revision_frecuente: "Revisión muy frecuente",
  menos_contacto: "Menos contacto con otros",
  abandono_rutina: "Cambio en la rutina",
  otro: "Otro cambio",
};

/** Las sesiones que empiezan antes de esta hora (Lima) cuentan como uso de madrugada. */
export const HORA_FIN_MADRUGADA = 5;

/** Días que mira cada análisis. */
export const DIAS_VENTANA = 7;

/** Una vez que la persona abrió una app (lo que captaría el monitoreo en segundo plano). */
export interface SesionTelefono {
  aplicacion: string;
  categoria: CategoriaAplicacion;
  /** Inicio de la sesión en formato ISO 8601. */
  inicio: string;
  minuto: number;
}

/** Totales de un día local (Lima). */
export interface ResumenDiaUso {
  dia: number;
  etiqueta: string;
  minutoTotal: number;
  minutoMadrugada: number;
  apertura: number;
}

export interface AnomaliaUso {
  tipo: TipoAnomalia;
  /** Día local en formato AAAA-MM-DD. */
  fecha: string;
  severidad: Severidad;
  descripcion: string;
}

export interface AnalisisUsoTelefono {
  id: number;
  desde: string;
  hasta: string;
  nivelAtencion: NivelAtencion;
  senalPredominante: Senal | null;
  resumen: string;
  sugerencias: readonly string[];
  sugerirProfesional: boolean;
  /** Cambios muy bruscos en la rutina: la app muestra una alerta roja y lanza una notificación. */
  alertaRoja: boolean;
  /** Pregunta de la tabla preguntas que la IA eligió según el análisis (null si ninguna aportaba). */
  preguntaId: number | null;
  motivoPregunta: string | null;
  modelo: string;
  creadoEn: string;
  anomalias: readonly AnomaliaUso[];
}

export type NuevoAnalisisUsoTelefono = Omit<AnalisisUsoTelefono, "id" | "creadoEn">;

export function esNivelAtencion(valor: unknown): valor is NivelAtencion {
  return NIVELES_ATENCION.some((nivel) => nivel === valor);
}

export function esSenal(valor: unknown): valor is Senal {
  return SENALES.some((senal) => senal === valor);
}

export function esTipoAnomalia(valor: unknown): valor is TipoAnomalia {
  return TIPOS_ANOMALIA.some((tipo) => tipo === valor);
}

export function esSeveridad(valor: unknown): valor is Severidad {
  return SEVERIDADES.some((severidad) => severidad === valor);
}
