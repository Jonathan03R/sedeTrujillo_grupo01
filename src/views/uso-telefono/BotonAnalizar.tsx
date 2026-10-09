"use client";

import { Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { Boton } from "@/components/ui/Boton";
import { analizarUsoTelefono } from "@/controllers/analizar-uso.action";

export function BotonAnalizar({ hayAnalisis }: { hayAnalisis: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  // Si todo sale bien, la acción refresca la pantalla con el análisis nuevo.
  function analizar() {
    setError(null);
    iniciarTransicion(async () => {
      const respuesta = await analizarUsoTelefono();
      if (respuesta) setError(respuesta.error);
    });
  }

  return (
    <div className="space-y-2">
      <Boton variante={hayAnalisis ? "secundario" : "primario"} onClick={analizar} disabled={pendiente}>
        <Sparkles className="size-4" aria-hidden="true" />
        {pendiente ? "Analizando tu semana…" : hayAnalisis ? "Analizar de nuevo" : "Analizar mi semana con IA"}
      </Boton>
      {pendiente && (
        <p role="status" className="text-center text-xs text-slate-500">
          Puede tardar alrededor de un minuto.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
