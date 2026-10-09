/**
 * Persona de demostración (ficticia, ver db/seed-demo.sql).
 * TODO: reemplazar por el usuario autenticado cuando exista inicio de sesión.
 */
export const ALIAS_DEMO = "Yoana";

export interface Usuario {
  id: number;
  /** Nombre visible. La base no guarda nombres reales: solo un alias. */
  alias: string;
  edad: number | null;
}
