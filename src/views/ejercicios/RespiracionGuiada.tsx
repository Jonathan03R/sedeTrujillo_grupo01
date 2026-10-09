"use client";

import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Boton } from "@/components/ui/Boton";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { FaseRespiracion } from "@/models/ejercicio.model";

interface RespiracionGuiadaProps {
  titulo: string;
  fases: readonly FaseRespiracion[];
}

const ESCALA_INHALADO = 1;
const ESCALA_EXHALADO = 0.6;

// El círculo crece al inhalar, se achica al exhalar y se mantiene al sostener.
function escalaPara(fases: readonly FaseRespiracion[], indice: number): number {
  for (let paso = 0; paso < fases.length; paso++) {
    const { accion } = fases[(indice - paso + fases.length) % fases.length];
    if (accion === "inhalar") return ESCALA_INHALADO;
    if (accion === "exhalar") return ESCALA_EXHALADO;
  }
  return ESCALA_EXHALADO;
}

export function RespiracionGuiada({ titulo, fases }: RespiracionGuiadaProps) {
  const [activo, setActivo] = useState(false);
  const [indice, setIndice] = useState(0);
  const fase = fases[indice];

  useEffect(() => {
    if (!activo) return;
    const temporizador = setTimeout(
      () => setIndice((actual) => (actual + 1) % fases.length),
      fase.segundos * 1000,
    );
    return () => clearTimeout(temporizador);
  }, [activo, indice, fase.segundos, fases.length]);

  function alternar() {
    setIndice(0);
    setActivo((anterior) => !anterior);
  }

  const escala = activo ? escalaPara(fases, indice) : ESCALA_EXHALADO;
  const segundosTransicion = activo && fase.accion !== "sostener" ? fase.segundos : 0.3;

  return (
    <Tarjeta className="flex flex-col items-center gap-4 py-6">
      <h2 className="font-semibold text-slate-900">{titulo}</h2>

      <div className="flex size-48 items-center justify-center" aria-hidden="true">
        <div
          className="size-48 rounded-full bg-blue-100 ring-8 ring-blue-50 ease-in-out motion-reduce:transition-none"
          style={{
            transform: `scale(${escala})`,
            transition: `transform ${segundosTransicion}s`,
          }}
        />
      </div>

      <p className="h-6 text-lg font-semibold text-blue-700" aria-live="polite">
        {activo ? `${fase.etiqueta} · ${fase.segundos} s` : "Listo para comenzar"}
      </p>

      <Boton onClick={alternar} className="gap-2">
        {activo ? (
          "Detener"
        ) : (
          <>
            Comenzar ejercicio
            <Play className="size-4 fill-current" aria-hidden="true" />
          </>
        )}
      </Boton>
    </Tarjeta>
  );
}
