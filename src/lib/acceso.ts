// Acceso de DEMOSTRACIÓN: usuario y contraseña fijos en el código (prototipo, no es seguridad real).
// No usar con datos reales. Cuando exista autenticación de verdad, esto se reemplaza.
export const USUARIO_DEMO = "yoana";
export const CONTRASENA_DEMO = "admin";

/** Nombre y valor de la cookie que marca la sesión iniciada. */
export const COOKIE_SESION = "pulso_sesion";
export const VALOR_SESION = "sesion-demo-activa";
export const DURACION_SESION_SEGUNDOS = 12 * 60 * 60;

export function credencialesValidas(usuario: string, contrasena: string): boolean {
  return usuario.trim().toLowerCase() === USUARIO_DEMO && contrasena === CONTRASENA_DEMO;
}
