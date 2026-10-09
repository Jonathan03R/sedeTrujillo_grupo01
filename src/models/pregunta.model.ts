export interface PreguntaDelDia {
  id: number;
  texto: string;
  /** true si el usuario ya contestó esta pregunta hoy. */
  respondida: boolean;
}
