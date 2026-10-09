import { HeartHandshake } from "lucide-react";
import { AlertaRoja } from "@/components/alertas/AlertaRoja";
import { AlternativasAutocuidado } from "@/components/ejercicios/AlternativasAutocuidado";
import { TarjetaEstadoActual } from "@/components/emociones/TarjetaEstadoActual";
import { AvisoApoyo } from "@/components/ui/AvisoApoyo";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { EnlaceBoton } from "@/components/ui/EnlaceBoton";
import { PreguntaSeguimiento } from "@/components/preguntas/PreguntaSeguimiento";
import { responderAlerta } from "@/controllers/responder-notificacion.action";
import { responderPregunta } from "@/controllers/responder-pregunta.action";
import type { AlternativaAutocuidado } from "@/models/autocuidado.model";
import type { Emocion } from "@/models/emocion.model";
import type { Ejercicio, MensajeApoyo } from "@/models/ejercicio.model";
import type { Notificacion } from "@/models/notificacion.model";
import type { EmojiRespuesta, PreguntaSeguimiento as DatosPregunta } from "@/models/pregunta.model";
import type { EstadoActual } from "@/models/progreso.model";
import { EjercicioDestacado } from "./EjercicioDestacado";

interface InicioViewProps {
  estado: EstadoActual | null;
  apoyo: MensajeApoyo | null;
  /** El ejercicio de hoy; null si la franja de intensidad de hoy solo lleva recomendación. */
  recomendado: Ejercicio | null;
  /** Mensaje de la IA para esta persona (null si no hubo personalización). */
  mensaje: string | null;
  alternativas: readonly AlternativaAutocuidado[];
  alertaRoja: { notificacion: Notificacion; emociones: readonly Emocion[] } | null;
  /** La pregunta que la IA eligió al cruzar el horario con el uso del teléfono (null si no hay). */
  preguntaSeguimiento: { pregunta: DatosPregunta; emojis: readonly EmojiRespuesta[] } | null;
}

export function InicioView({ estado, apoyo, recomendado, mensaje, alternativas, alertaRoja, preguntaSeguimiento }: InicioViewProps) {
  return (
    <div className="space-y-5">
      {alertaRoja && <AlertaRoja {...alertaRoja} onResponder={responderAlerta} />}
      {estado && <TarjetaEstadoActual {...estado} />}
      {preguntaSeguimiento && <PreguntaSeguimiento {...preguntaSeguimiento} onResponder={responderPregunta} />}

      {recomendado ? (
        <EjercicioDestacado ejercicio={recomendado} mensaje={mensaje} />
      ) : (
        apoyo && (
          <Tarjeta aria-labelledby="recomendacion-de-hoy" className="space-y-2 rounded-3xl border-blue-100 bg-blue-50/60 p-5">
            <h2 id="recomendacion-de-hoy" className="text-lg font-bold text-slate-900">
              {apoyo.titulo}
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">{mensaje ?? apoyo.detalle}</p>
          </Tarjeta>
        )
      )}
      <AlternativasAutocuidado alternativas={alternativas} />

      {apoyo?.derivar && (
        <p className="flex items-center gap-3 rounded-2xl bg-violet-50 p-4 text-sm text-slate-700">
          <HeartHandshake className="size-8 shrink-0 text-violet-500" aria-hidden="true" />
          <span>
            Si sientes que es muy complicado, puedes acercarte a un profesional de salud mental.{" "}
            <strong className="font-semibold text-slate-900">Tu bienestar también importa.</strong>
          </span>
        </p>
      )}

      <EnlaceBoton href="/registro" variante="secundario">
        Registrar otra emoción
      </EnlaceBoton>

      <AvisoApoyo />
    </div>
  );
}
