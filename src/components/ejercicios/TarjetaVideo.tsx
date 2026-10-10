import { Clock } from "lucide-react";
import type { VideoRecomendado } from "@/models/autocuidado.model";

/** Reproduce el video dentro de Pulso con el dominio de privacidad mejorada de YouTube. */
export function TarjetaVideo({ video }: { video: VideoRecomendado }) {
  return (
    <section aria-labelledby="video-para-ti">
      <h2 id="video-para-ti" className="mb-3 text-sm font-semibold text-slate-900">
        Para ver ahora
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="aspect-video bg-slate-950">
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?playsinline=1&rel=0`}
            title={`Reproducir ${video.titulo}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="space-y-1.5 p-4">
          <h3 className="line-clamp-2 font-semibold text-slate-900">{video.titulo}</h3>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            {video.canal}
            {video.duracionMinutos !== null && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" aria-hidden="true" />
                {video.duracionMinutos} min
              </span>
            )}
          </p>
          <p className="text-sm text-slate-700">{video.motivo}</p>
        </div>
      </div>
    </section>
  );
}
