"use client";

import { MessageCircleQuestion } from "lucide-react";
import { useState, useTransition } from "react";
import type { EmojiRespuesta, PreguntaSeguimiento as DatosPregunta } from "@/models/pregunta.model";

interface PreguntaSeguimientoProps {
  pregunta: DatosPregunta;
  emojis: readonly EmojiRespuesta[];
  /** Guarda la respuesta (Server Action). */
  onResponder: (preguntaId: number, emojiId: number) => Promise<{ error: string } | undefined>;
}

/**
 * Una pregunta que la IA eligió de la tabla preguntas al cruzar el horario de la persona con el uso de su teléfono
 * (por ejemplo «¿Cómo dormiste anoche?»). Se responde con un toque en una carita de la tabla emojis.
 */
export function PreguntaSeguimiento({ pregunta, emojis, onResponder }: PreguntaSeguimientoProps) {
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  // Si todo sale bien, la acción refresca la pantalla y la tarjeta desaparece.
  function responder(emojiId: number) {
    setError(null);
    iniciarTransicion(async () => {
      const respuesta = await onResponder(pregunta.preguntaId, emojiId);
      if (respuesta) setError(respuesta.error);
    });
  }

  return (
    <section aria-labelledby="pregunta-seguimiento" className="space-y-3 rounded-3xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
          <MessageCircleQuestion className="size-5" />
        </span>
        <div>
          <h2 id="pregunta-seguimiento" className="text-base font-bold text-slate-900">
            {pregunta.texto}
          </h2>
          {pregunta.motivo && <p className="mt-1 text-sm text-slate-600">{pregunta.motivo}</p>}
        </div>
      </div>

      {/* Las caritas son la respuesta (tabla emojis): cada botón lleva su nombre para quien usa lector de pantalla. */}
      <ul className="grid grid-cols-3 gap-2">
        {emojis.map((emoji) => (
          <li key={emoji.id}>
            <button
              type="button"
              onClick={() => responder(emoji.id)}
              disabled={pendiente}
              aria-label={emoji.nombre}
              className="flex w-full flex-col items-center gap-1 rounded-2xl bg-white py-2.5 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {emoji.simbolo}
              </span>
              <span className="text-[11px] text-slate-600">{emoji.nombre}</span>
            </button>
          </li>
        ))}
      </ul>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
