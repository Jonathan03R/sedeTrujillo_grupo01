// «Check-in»: la persona responde la pregunta inicial («¿Qué emoción sientes?») al entrar a la app.
// Que haya hecho check-in se decide con la base de datos (ver src/proxy.ts), no con una cookie.

/** Cuánto tiempo vale un registro antes de pedir uno nuevo al volver a entrar. */
export const DURACION_CHECKIN_SEGUNDOS = 4 * 60 * 60;
