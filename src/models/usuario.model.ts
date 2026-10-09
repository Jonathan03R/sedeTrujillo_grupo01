export interface Usuario {
  id: number;
  /** Nombre visible. La base no guarda nombres reales: solo un alias. */
  alias: string;
  edad: number | null;
}
