"use client";

import { Plus, X } from "lucide-react";
import { useState, useTransition } from "react";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { MAXIMO_GUSTOS, SUGERENCIAS_GUSTOS, type Gusto } from "@/models/gusto.model";

interface MisGustosProps {
  gustos: readonly Gusto[];
  /** Server Actions (ver controllers/gustos.action.ts). */
  onAgregar: (texto: string) => Promise<{ error: string } | undefined>;
  onQuitar: (gustoId: number) => Promise<{ error: string } | undefined>;
}

/** Lo que le gusta a la persona. La IA lo usa para personalizar sus ejercicios y ideas de autocuidado. */
export function MisGustos({ gustos, onAgregar, onQuitar }: MisGustosProps) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  const tieneGusto = (nombre: string) => gustos.some((g) => g.texto.toLowerCase() === nombre.toLowerCase());
  const sugerencias = SUGERENCIAS_GUSTOS.filter((nombre) => !tieneGusto(nombre));
  const lleno = gustos.length >= MAXIMO_GUSTOS;

  function agregar(nuevo: string) {
    setError(null);
    iniciarTransicion(async () => {
      const respuesta = await onAgregar(nuevo);
      if (respuesta) setError(respuesta.error);
      else setTexto("");
    });
  }

  function quitar(gustoId: number) {
    setError(null);
    iniciarTransicion(async () => {
      const respuesta = await onQuitar(gustoId);
      if (respuesta) setError(respuesta.error);
    });
  }

  return (
    <Tarjeta aria-labelledby="titulo-gustos" className="space-y-4">
      <div>
        <h2 id="titulo-gustos" className="text-sm font-semibold text-slate-900">
          Lo que me gusta
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Con esto tus ejercicios e ideas de autocuidado se arman a tu medida.
        </p>
      </div>

      {gustos.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {gustos.map((gusto) => (
            <li
              key={gusto.id}
              className="flex items-center gap-1 rounded-full bg-blue-50 py-1 pr-1 pl-3 text-sm font-medium text-blue-800"
            >
              {gusto.texto}
              <button
                type="button"
                onClick={() => quitar(gusto.id)}
                disabled={pendiente}
                aria-label={`Quitar ${gusto.texto}`}
                className="flex size-6 items-center justify-center rounded-full text-blue-500 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">Aún no agregas nada. Cuéntanos qué disfrutas.</p>
      )}

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          if (texto.trim()) agregar(texto);
        }}
        className="flex gap-2"
      >
        <input
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          maxLength={40}
          disabled={lleno}
          placeholder={lleno ? "Llegaste al máximo" : "Por ejemplo: me gusta el básquet"}
          aria-label="Agregar algo que me gusta"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={pendiente || lleno || !texto.trim()}
          aria-label="Agregar"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      {!lleno && sugerencias.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-slate-500">Ideas:</p>
          <ul className="flex flex-wrap gap-2">
            {sugerencias.map((nombre) => (
              <li key={nombre}>
                <button
                  type="button"
                  onClick={() => agregar(nombre)}
                  disabled={pendiente}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50"
                >
                  + {nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Tarjeta>
  );
}
