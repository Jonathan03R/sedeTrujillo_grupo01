"use client";

import { useState, useTransition } from "react";
import { EscalaIntensidad } from "@/components/emociones/EscalaIntensidad";
import { SelectorEmocion } from "@/components/emociones/SelectorEmocion";
import { Boton } from "@/components/ui/Boton";
import { registrarEmocion } from "@/controllers/registro.controller";
import type { Emocion, EmocionId, Intensidad } from "@/models/emocion.model";
import type { ResultadoRegistro } from "@/models/registro-emocional.model";
import { ResultadoRegistroEmocional } from "./ResultadoRegistroEmocional";

export function FormularioRegistro({ emociones }: { emociones: readonly Emocion[] }) {
  const [emocion, setEmocion] = useState<EmocionId | null>(null);
  const [intensidad, setIntensidad] = useState<Intensidad>(3);
  const [resultado, setResultado] = useState<ResultadoRegistro | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  function registrar() {
    iniciarTransicion(async () => {
      setResultado(await registrarEmocion(emocion, intensidad));
    });
  }

  function reiniciar() {
    setEmocion(null);
    setIntensidad(3);
    setResultado(null);
  }

  if (resultado?.ok) {
    return <ResultadoRegistroEmocional recomendacion={resultado.recomendacion} onReiniciar={reiniciar} />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">¿Qué emoción sientes?</h2>
        <SelectorEmocion emociones={emociones} valor={emocion} onCambiar={setEmocion} />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">¿Qué tan intensa es?</h2>
        <EscalaIntensidad valor={intensidad} onCambiar={setIntensidad} />
      </div>

      {resultado && !resultado.ok && (
        <p role="alert" className="text-sm text-red-700">
          {resultado.error}
        </p>
      )}

      <Boton onClick={registrar} disabled={!emocion || pendiente}>
        {pendiente ? "Registrando…" : "Registrar emoción"}
      </Boton>
    </div>
  );
}
