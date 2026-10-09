export interface PreguntaDelDia {
  id: number;
  texto: string;
  /** true si el usuario ya contestó esta pregunta hoy. */
  respondida: boolean;
}

/** Un emoji con el que se responde una pregunta (tabla emojis). */
export interface EmojiRespuesta {
  id: number;
  simbolo: string;
  nombre: string;
}

/** La pregunta de la tabla preguntas que la IA eligió tras cruzar el horario con el uso del teléfono. */
export interface PreguntaSeguimiento {
  analisisId: number;
  preguntaId: number;
  texto: string;
  /** Por qué se la hacemos hoy (lo escribió la IA, con un dato concreto). */
  motivo: string | null;
}
