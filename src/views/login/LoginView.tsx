"use client";

import { Eye, EyeOff, LockKeyhole, LogIn, UserRound } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { iniciarSesion } from "@/controllers/acceso.action";

/** Pantalla de acceso con iconos. Usuario y contraseña de demostración (ver lib/acceso.ts). */
export function LoginView() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  function entrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    iniciarTransicion(async () => {
      // Si las credenciales son correctas, la acción redirige a la app y este código no llega a ejecutar setError.
      const respuesta = await iniciarSesion(usuario, contrasena);
      if (respuesta) setError(respuesta.error);
    });
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <Image src="/ilustraciones/yoana-abrazo.png" alt="" width={700} height={633} priority className="mb-4 h-auto w-44" />
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Bienvenida a Pulso</h1>
      <p className="mt-1 text-sm text-slate-600">Entra para cuidar tu bienestar.</p>

      <form onSubmit={entrar} className="mt-6 w-full max-w-sm space-y-4" aria-label="Acceso">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Usuario</span>
          <span className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
            <UserRound className="size-5 shrink-0 text-slate-500" aria-hidden="true" />
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              required
              className="w-full bg-transparent py-3 text-base text-slate-900 outline-none"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Contraseña</span>
          <span className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
            <LockKeyhole className="size-5 shrink-0 text-slate-500" aria-hidden="true" />
            <input
              type={mostrar ? "text" : "password"}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-transparent py-3 text-base text-slate-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setMostrar((m) => !m)}
              aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={mostrar}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              {mostrar ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
            </button>
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pendiente}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-base font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60"
        >
          <LogIn className="size-5" aria-hidden="true" />
          {pendiente ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 max-w-sm text-center text-xs text-slate-500">
        Acceso de demostración con datos ficticios.
      </p>
    </div>
  );
}
