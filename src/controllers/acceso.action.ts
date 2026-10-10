"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, DURACION_SESION_SEGUNDOS, VALOR_SESION, credencialesValidas } from "@/lib/acceso";

// Server Actions: se pueden invocar con un POST directo, por eso validan todo lo que reciben.

export type ErrorAcceso = { error: string } | undefined;

export async function iniciarSesion(usuario: unknown, contrasena: unknown): Promise<ErrorAcceso> {
  if (typeof usuario !== "string" || typeof contrasena !== "string" || usuario.length > 100 || contrasena.length > 100) {
    return { error: "Escribe tu usuario y tu contraseña." };
  }
  if (!credencialesValidas(usuario, contrasena)) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  (await cookies()).set(COOKIE_SESION, VALOR_SESION, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_SESION_SEGUNDOS,
  });
  // Cada inicio de sesión pasa por la pantalla de emociones, aunque haya registrado hace poco.
  redirect("/registro");
}

export async function cerrarSesion(): Promise<void> {
  (await cookies()).delete(COOKIE_SESION);
  redirect("/login");
}
