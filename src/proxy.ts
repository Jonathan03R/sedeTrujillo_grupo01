import { NextResponse, type NextRequest } from "next/server";
import { DURACION_CHECKIN_SEGUNDOS } from "@/lib/checkin";
import { ALIAS_DEMO } from "@/models/usuario.model";

// El registro de emoción es la puerta de entrada: sin una respuesta reciente a la pregunta inicial
// no se ve el resto de la app. No se le dice a la persona que es obligatorio; simplemente entra por esa pantalla.
// Se decide con la BASE DE DATOS (si hay un registro activo reciente), no con una cookie: así, si no hay
// respuestas, la pregunta siempre aparece.

/** true si la persona tiene un registro emocional activo dentro de la ventana de check-in. */
async function hizoCheckin(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !llave) return false;

  const desde = new Date(Date.now() - DURACION_CHECKIN_SEGUNDOS * 1000).toISOString();
  const consulta = new URLSearchParams({
    select: "registro_emocional_id,usuarios!inner(alias)",
    "usuarios.alias": `eq.${ALIAS_DEMO}`,
    activo: "eq.true",
    registrado_en: `gte.${desde}`,
    limit: "1",
  });

  const respuesta = await fetch(`${url}/rest/v1/registros_emocionales?${consulta}`, {
    headers: { apikey: llave, Authorization: `Bearer ${llave}` },
    cache: "no-store",
  });
  if (!respuesta.ok) throw new Error(`Supabase respondió ${respuesta.status}`);
  return ((await respuesta.json()) as unknown[]).length > 0;
}

export async function proxy(request: NextRequest) {
  const irA = (ruta: string) => NextResponse.redirect(new URL(ruta, request.url));

  let checkin: boolean;
  try {
    checkin = await hizoCheckin();
  } catch (error) {
    // Si no se puede consultar la base, se deja pasar: las pantallas mostrarán su propio error.
    console.error(error);
    return request.nextUrl.pathname === "/" ? irA("/inicio") : NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") return irA(checkin ? "/inicio" : "/registro");
  if (!checkin) return irA("/registro");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/inicio", "/ejercicios", "/progreso", "/uso", "/perfil", "/ejercicios/:id*", "/ideas/:icono*"],
};
