"use client";

import { ArrowRight, MapPin } from "lucide-react";
import { useState, useTransition } from "react";
import { EscalaIntensidad } from "@/components/emociones/EscalaIntensidad";
import { SelectorEmocion } from "@/components/emociones/SelectorEmocion";
import { Boton } from "@/components/ui/Boton";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { TituloPaso } from "@/components/ui/TituloPaso";
import { registrarEmocion } from "@/controllers/registrar-emocion.action";
import type { Emocion, EmocionId, Intensidad } from "@/models/emocion.model";
import type { Ubicacion } from "@/models/ubicacion.model";
import { BotonVoz } from "./BotonVoz";
import { PREGUNTA_REGISTRO } from "@/models/registro-emocional.model";

const ESPERA_UBICACION_MS = 8_000;

/** La ubicación del navegador, con permiso de la persona. null si la niega, no hay o tarda demasiado. */
function pedirUbicacion(): Promise<Ubicacion | null> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) return Promise.resolve(null);
  return new Promise((resolver) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolver({ latitud: coords.latitude, longitud: coords.longitude }),
      () => resolver(null),
      // Una posición reciente (hasta 10 min) alcanza: así no pide el GPS en cada registro.
      { timeout: ESPERA_UBICACION_MS, maximumAge: 600_000 },
    );
  });
}

export function FormularioRegistro({ emociones }: { emociones: readonly Emocion[] }) {
  const [emocion, setEmocion] = useState<EmocionId | null>(null);
  const [intensidad, setIntensidad] = useState<Intensidad>(5);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  // Si el registro es válido, la acción redirige a /inicio y este código no llega a ejecutar setError.
  function registrar(emocionElegida: EmocionId | null, intensidadElegida: Intensidad) {
    iniciarTransicion(async () => {
      // El navegador le pide permiso a la persona; si dice que no (o no hay), se sigue sin ubicación.
      const respuesta = await registrarEmocion(emocionElegida, intensidadElegida, await pedirUbicacion());
      setError(respuesta.error);
    });
  }

  return (
    <div className="space-y-4">
      <BotonVoz
        emociones={emociones}
        onEntendido={(emocionEntendida, intensidadEntendida) => {
          if (emocionEntendida) setEmocion(emocionEntendida);
          if (intensidadEntendida) setIntensidad(intensidadEntendida);
        }}
        onConfirmar={(emocionConfirmada, intensidadConfirmada) => {
          setEmocion(emocionConfirmada);
          setIntensidad(intensidadConfirmada);
          registrar(emocionConfirmada, intensidadConfirmada);
        }}
      />

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

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
        Al registrar, tu navegador puede pedirte tu ubicación para sugerirte lugares cercanos. Es opcional y no se guarda.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <Boton
        tamano="grande"
        onClick={() => registrar(emocion, intensidad)}
        disabled={!emocion || pendiente}
        className="relative shadow-lg shadow-blue-500/30"
      >
        {pendiente ? "Preparando tu momento de calma…" : "Registrar"}
        {!pendiente && <ArrowRight className="absolute right-6 size-6" aria-hidden="true" />}
      </Boton>
    </div>
  );
}
