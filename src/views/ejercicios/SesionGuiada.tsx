"use client";

import { Check, Pause, Play, RefreshCw, SkipForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertaEmocional } from "@/components/emociones/AlertaEmocional";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { EnlaceBoton } from "@/components/ui/EnlaceBoton";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { Ejercicio } from "@/models/ejercicio.model";
import { INTENSIDAD_MAXIMA } from "@/models/emocion.model";
import type { PasoSesion } from "@/models/sesion-guiada";
import type { EstadoActual } from "@/models/progreso.model";

const PASOS_VISIBLES = 4;
const RADIO_ANILLO = 52;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO_ANILLO;

interface SesionGuiadaProps {
  ejercicio: Ejercicio;
  pasos: readonly PasoSesion[];
  estado: EstadoActual | null;
}

/** El aviso de arriba: nombra la emoción de hoy sin diagnosticar, con el mismo lenguaje de acompañamiento. */
function avisoDeHoy(estado: EstadoActual) {
  const malestar = estado.emocion.valor <= 2;
  return {
    emocion: estado.emocion,
    titulo: malestar && estado.intensidad >= 7
      ? "Estás haciendo un gran esfuerzo"
      : `Sientes ${estado.emocion.etiqueta.toLowerCase()} (nivel ${estado.intensidad} de ${INTENSIDAD_MAXIMA})`,
    detalle: malestar
      ? "Es normal sentirse así. Vamos a hacer el ejercicio paso a paso, a tu ritmo."
      : "Gracias por tomarte este momento. Vamos paso a paso.",
  };
}

interface EstadoSesion {
  indice: number;
  restante: number;
  pausado: boolean;
  terminado: boolean;
}

function estadoInicial(pasos: readonly PasoSesion[]): EstadoSesion {
  return { indice: 0, restante: pasos[0]?.segundos ?? 0, pausado: false, terminado: pasos.length === 0 };
}

/** Pasa al siguiente paso, o termina la sesión si era el último. */
function avanzar(estado: EstadoSesion, pasos: readonly PasoSesion[]): EstadoSesion {
  if (estado.indice >= pasos.length - 1) return { ...estado, restante: 0, terminado: true };
  const indice = estado.indice + 1;
  return { ...estado, indice, restante: pasos[indice].segundos };
}

/** Un segundo menos; si el paso se acaba, pasa al siguiente. */
function tictac(estado: EstadoSesion, pasos: readonly PasoSesion[]): EstadoSesion {
  if (estado.pausado || estado.terminado) return estado;
  const restante = estado.restante - 1;
  return restante > 0 ? { ...estado, restante } : avanzar({ ...estado, restante }, pasos);
}

export function SesionGuiada({ ejercicio, pasos, estado }: SesionGuiadaProps) {
  const [sesion, setSesion] = useState<EstadoSesion>(() => estadoInicial(pasos));
  const { indice, restante, pausado, terminado } = sesion;
  const paso = pasos[indice];
  const ultimo = indice === pasos.length - 1;

  // Un tick por segundo mientras la sesión corre. Todo el cambio de estado va dentro del tick.
  useEffect(() => {
    if (pausado || terminado) return;
    const reloj = setInterval(() => setSesion((actual) => tictac(actual, pasos)), 1000);
    return () => clearInterval(reloj);
  }, [pausado, terminado, pasos]);

  function siguiente() {
    setSesion((actual) => avanzar(actual, pasos));
  }

  function alternarPausa() {
    setSesion((actual) => ({ ...actual, pausado: !actual.pausado }));
  }

  function reiniciar() {
    setSesion(estadoInicial(pasos));
  }

  const proximos = pasos.slice(indice, indice + PASOS_VISIBLES);
  const fraccion = paso ? Math.max(restante, 0) / paso.segundos : 0;

  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo={ejercicio.titulo} volverA="/inicio" />

      {estado && <AlertaEmocional {...avisoDeHoy(estado)} />}

      {terminado ? (
        <Tarjeta className="space-y-4 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="size-7" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-slate-900">¡Lo lograste!</h2>
          <p className="text-sm text-slate-600">Terminaste el ejercicio. Tómate un momento y mira cómo te sientes ahora.</p>
          <div className="flex flex-col gap-2">
            <EnlaceBoton href="/inicio">Volver al inicio</EnlaceBoton>
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Hacerlo otra vez
            </button>
          </div>
        </Tarjeta>
      ) : (
        <>
          <Tarjeta className="space-y-5" aria-live="polite">
            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase">
              Paso {indice + 1} de {pasos.length}
            </p>

            <div className="flex items-center gap-5">
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">{paso.titulo}</h2>
                <p className="text-sm leading-relaxed text-slate-600">{paso.detalle}</p>
              </div>

              <div className="relative size-32 shrink-0" role="timer" aria-label={`${Math.max(restante, 0)} segundos`}>
                <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
                  <circle cx="60" cy="60" r={RADIO_ANILLO} fill="none" stroke="#dbeafe" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIO_ANILLO}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${fraccion * CIRCUNFERENCIA} ${CIRCUNFERENCIA}`}
                    className="transition-[stroke-dasharray] duration-1000 ease-linear motion-reduce:transition-none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-slate-900">{Math.max(restante, 0)}</span>
                  <span className="text-xs text-slate-500">segundos</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={alternarPausa}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-base font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {pausado ? <Play className="size-5 fill-current" aria-hidden="true" /> : <Pause className="size-5 fill-current" aria-hidden="true" />}
                {pausado ? "Continuar" : "Pausar"}
              </button>
              <button
                type="button"
                onClick={siguiente}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <SkipForward className="size-4" aria-hidden="true" />
                {ultimo ? "Terminar" : "Siguiente"}
              </button>
            </div>
          </Tarjeta>

          {proximos.length > 1 && (
            <section aria-labelledby="proximos-pasos">
              <h2 id="proximos-pasos" className="mb-3 text-sm font-semibold text-slate-900">
                Próximos pasos
              </h2>
              <ol className="grid grid-cols-4 gap-2 text-center">
                {proximos.map((proximo, i) => (
                  <li key={`${indice + i}`} className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold ${
                        i === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {i === 0 ? indice + 1 : indice + i + 1}
                    </span>
                    <span className={`line-clamp-2 text-[11px] leading-tight ${i === 0 ? "font-semibold text-blue-700" : "text-slate-500"}`}>
                      {proximo.titulo}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}

      <Link href="/ejercicios" className="block text-center text-xs font-medium text-slate-500 hover:underline">
        Ver otros ejercicios
      </Link>
    </div>
  );
}
