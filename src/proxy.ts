import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_CHECKIN } from "@/lib/checkin";

// El registro de emoción es la puerta de entrada: sin él no se ve el resto de la app.
// No se le dice a la persona que es obligatorio; simplemente entra por esa pantalla.
export function proxy(request: NextRequest) {
  const hizoCheckin = request.cookies.has(COOKIE_CHECKIN);
  const irA = (ruta: string) => NextResponse.redirect(new URL(ruta, request.url));

  if (request.nextUrl.pathname === "/") return irA(hizoCheckin ? "/inicio" : "/registro");
  if (!hizoCheckin) return irA("/registro");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/inicio", "/ejercicios", "/progreso", "/uso", "/perfil"],
};
