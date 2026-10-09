"use client";

import { ArrowRight } from "lucide-react";
import { useState, useTransition } from "react";
import { EscalaIntensidad } from "@/components/emociones/EscalaIntensidad";
import { SelectorEmocion } from "@/components/emociones/SelectorEmocion";
import { Boton } from "@/components/ui/Boton";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { TituloPaso } from "@/components/ui/TituloPaso";
import { registrarEmocion } from "@/controllers/registrar-emocion.action";
import type { Emocion, EmocionId, Intensidad } from "@/models/emocion.model";
import { PREGUNTA_REGISTRO } from "@/models/registro-emocional.model";

export function FormularioRegistro({ emociones }: { emociones: readonly Emocion[] }) {
  const [emocion, setEmocion] = useState<EmocionId | null>(null);
  const [intensidad, setIntensidad] = useState<Intensidad>(5);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  // Si el registro es válido, la acción redirige a /inicio y este código no llega a ejecutar setError.
  function registrar() {
    iniciarTransicion(async () => {
      const respuesta = await registrarEmocion(emocion, intensidad);
      setError(respuesta.error);
    });
  }

  return (
    <div className="space-y-4">
      <Tarjeta aria-labelledby="paso-emocion" className="rounded-3xl p-5">
        <TituloPaso id="paso-emocion" numero={1} titulo={PREGUNTA_REGISTRO} />
        <div className="mt-4">
          <SelectorEmocion emociones={emociones} valor={emocion} onCambiar={setEmocion} />
        </div>
      </Tarjeta>

      <Tarjeta aria-labelledby="paso-intensidad" className="rounded-3xl p-5">
        <TituloPaso id="paso-intensidad" numero={2} titulo="¿Qué tan intensa es?" tono="verde" />
        <div className="mt-4">
          <EscalaIntensidad valor={intensidad} onCambiar={setIntensidad} />
        </div>
      </Tarjeta>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <Boton
        tamano="grande"
        onClick={registrar}
        disabled={!emocion || pendiente}
        className="relative shadow-lg shadow-blue-500/30"
      >
        {pendiente ? "Preparando tu momento de calma…" : "Registrar"}
        {!pendiente && <ArrowRight className="absolute right-6 size-6" aria-hidden="true" />}
      </Boton>
    </div>
  );
}
