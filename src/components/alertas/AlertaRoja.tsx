"use client";

import { TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { SelectorEmocion } from "@/components/emociones/SelectorEmocion";
import { Boton } from "@/components/ui/Boton";
import type { Emocion, EmocionId } from "@/models/emocion.model";
import type { Notificacion } from "@/models/notificacion.model";

interface AlertaRojaProps {
  notificacion: Notificacion;
  emociones: readonly Emocion[];
  /** Guarda la emoción elegida como respuesta (Server Action). */
  onResponder: (notificacionId: number, emocion: EmocionId) => Promise<{ error: string } | undefined>;
}

/** Alerta visual (roja, con ícono) que lanza el análisis interno de la IA cuando hay cambios muy bruscos. */
export function AlertaRoja({ notificacion, emociones, onResponder }: AlertaRojaProps) {
  const [emocion, setEmocion] = useState<EmocionId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  // Si todo sale bien, la acción refresca la pantalla y la alerta desaparece.
  function responder() {
    if (!emocion) return;
    setError(null);
    iniciarTransicion(async () => {
      const respuesta = await onResponder(notificacion.id, emocion);
      if (respuesta) setError(respuesta.error);
    });
  }

  return (
    <section role="alert" aria-labelledby="titulo-alerta" className="space-y-4 rounded-3xl border-2 border-red-300 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
          <TriangleAlert className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="titulo-alerta" className="text-sm font-bold text-red-900">
            Notamos un cambio en tu rutina
          </h2>
          <p className="mt-1 text-sm text-red-900/80">{notificacion.mensaje}</p>
        </div>
      </div>

      <p className="text-base font-semibold text-slate-900">{notificacion.pregunta}</p>
      <SelectorEmocion emociones={emociones} valor={emocion} onCambiar={setEmocion} />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <Boton onClick={responder} disabled={!emocion || pendiente} className="bg-red-600 hover:bg-red-700">
        {pendiente ? "Guardando…" : "Responder"}
      </Boton>
    </section>
  );
}
