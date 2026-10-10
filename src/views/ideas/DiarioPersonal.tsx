"use client";

import { useState, useSyncExternalStore } from "react";
import { Tarjeta } from "@/components/ui/Tarjeta";

const CLAVE = "pulso.diario.v1";
const listeners = new Set<() => void>();
function leer(): string { return window.localStorage.getItem(CLAVE) ?? ""; }
function suscribir(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Diario local: la app usa usuario demo compartido; no enviar texto privado a esa cuenta. */
export function DiarioPersonal() {
  const texto = useSyncExternalStore(suscribir, leer, () => "");
  const [guardado, setGuardado] = useState(false);
  function guardar(valor: string) {
    window.localStorage.setItem(CLAVE, valor);
    listeners.forEach((listener) => listener());
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 1600);
  }
  return <Tarjeta className="space-y-3 rounded-3xl p-5">
    <label htmlFor="diario" className="font-semibold text-slate-900">¿Qué te gustaría sacar de tu mente?</label>
    <textarea id="diario" value={texto} onChange={(e) => guardar(e.target.value)} maxLength={4000} rows={7}
      placeholder="Escribe sin preocuparte por hacerlo perfecto…" className="w-full resize-y rounded-2xl border border-slate-200 p-4 text-base text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
    <p role="status" className="text-xs text-slate-500">{guardado ? "Guardado en este dispositivo" : "Se guarda automáticamente en este dispositivo; no se envía a la cuenta compartida."}</p>
  </Tarjeta>;
}
