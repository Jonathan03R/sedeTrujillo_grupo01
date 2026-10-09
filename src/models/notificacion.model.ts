import type { TipoAnomalia } from "./uso-telefono.model";

/** Pregunta del catálogo que la app lanza según el tipo de cambio detectado (tabla preguntas_alerta). */
export interface PreguntaAlerta {
  id: number;
  tipo: TipoAnomalia;
  texto: string;
}

/** Aviso con una pregunta que recibe la persona cuando el análisis marca alerta roja. Se responde con una emoción. */
export interface Notificacion {
  id: number;
  /** Frase cálida que explica el cambio detectado. */
  mensaje: string;
  pregunta: string;
}

export interface NuevaNotificacion {
  analisisId: number;
  preguntaAlertaId: number;
  mensaje: string;
}
