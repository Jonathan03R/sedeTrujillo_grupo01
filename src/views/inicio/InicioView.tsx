import { HeartHandshake } from "lucide-react";
import { AlertaRoja } from "@/components/alertas/AlertaRoja";
import { AlternativasAutocuidado } from "@/components/ejercicios/AlternativasAutocuidado";
import { TarjetaLugar } from "@/components/ejercicios/TarjetaLugar";
import { TarjetaVideo } from "@/components/ejercicios/TarjetaVideo";
import { TarjetaVideoGusto } from "@/components/ejercicios/TarjetaVideoGusto";
import type { VideoGusto } from "@/repositories/video-gusto.repository";
import { TarjetaEstadoActual } from "@/components/emociones/TarjetaEstadoActual";
import { AvisoApoyo } from "@/components/ui/AvisoApoyo";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { EnlaceBoton } from "@/components/ui/EnlaceBoton";
import { TituloPantalla } from "@/components/ui/TituloPantalla";
import { responderAlerta } from "@/controllers/responder-notificacion.action";
import type { AlternativaAutocuidado, LugarRecomendado, VideoRecomendado } from "@/models/autocuidado.model";
import type { Emocion } from "@/models/emocion.model";
import type { Ejercicio, MensajeApoyo } from "@/models/ejercicio.model";
import type { Notificacion } from "@/models/notificacion.model";
import type { EstadoActual } from "@/models/progreso.model";
import { EjercicioDestacado } from "./EjercicioDestacado";

interface InicioViewProps {
  nombre: string;
  estado: EstadoActual | null;
  apoyo: MensajeApoyo | null;
  /** El ejercicio de hoy; null si la franja de intensidad de hoy solo lleva recomendación. */
  recomendado: Ejercicio | null;
  /** Mensaje de la IA para esta persona (null si no hubo personalización). */
  mensaje: string | null;
  alternativas: readonly AlternativaAutocuidado[];
  /** Lugar cercano y video que la IA buscó y eligió para esta persona (null si no hubo). */
  lugar: LugarRecomendado | null;
  video: VideoRecomendado | null;
  alertaRoja: { notificacion: Notificacion; emociones: readonly Emocion[] } | null;
  /** Video de demostración según un gusto de la persona (datos ficticios). */
  videoGusto: VideoGusto | null;
}

export function InicioView({ nombre, estado, apoyo, recomendado, mensaje, alternativas, lugar, video, alertaRoja, videoGusto }: InicioViewProps) {
  return (
    <div className="space-y-5">
      <TituloPantalla titulo={`Hola, ${nombre}`} subtitulo="Esto preparamos para ti hoy." />

      {alertaRoja && <AlertaRoja {...alertaRoja} onResponder={responderAlerta} />}
      {estado && <TarjetaEstadoActual {...estado} />}

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
      {lugar && <TarjetaLugar lugar={lugar} />}
      {video && <TarjetaVideo video={video} />}
      {videoGusto && <TarjetaVideoGusto video={videoGusto} />}

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
