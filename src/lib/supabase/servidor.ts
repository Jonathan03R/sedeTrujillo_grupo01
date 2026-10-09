import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente de Supabase con la llave service_role: salta RLS y tiene acceso total a la base.
// `server-only` hace fallar el build si algún componente de cliente lo importa.
// Solo lo usan los repositorios. Todo lo que reciban debe haberse validado antes (ver controllers/).
let cliente: SupabaseClient | undefined;

function variable(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}. Revisa tu archivo .env (ver .env.example).`);
  return valor;
}

export function obtenerClienteServidor(): SupabaseClient {
  cliente ??= createClient(variable("NEXT_PUBLIC_SUPABASE_URL"), variable("SUPABASE_SERVICE_ROLE_KEY"), {
    // La app aún no usa sesiones de Supabase Auth: no guardar ni refrescar tokens en el servidor.
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

/** Convierte el error de Supabase en una excepción con contexto (sin exponer datos al usuario). */
export function lanzarSiHayError(contexto: string, error: { message: string } | null): void {
  if (error) throw new Error(`Supabase · ${contexto}: ${error.message}`);
}
