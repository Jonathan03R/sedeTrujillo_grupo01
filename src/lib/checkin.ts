// «Check-in»: la persona registra cómo se siente al entrar a la app.
// Mientras no exista esta cookie, el proxy la envía a /registro (ver src/proxy.ts).
// Es una marca de uso, no de seguridad: no contiene datos de la persona.
export const COOKIE_CHECKIN = "pulso_checkin";

/** Cuánto tiempo vale un registro antes de pedir uno nuevo al volver a entrar. */
export const DURACION_CHECKIN_SEGUNDOS = 4 * 60 * 60;
