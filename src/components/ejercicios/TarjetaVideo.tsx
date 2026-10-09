import { Clock, Play } from "lucide-react";
import Image from "next/image";
import { enlaceVideo, miniaturaVideo, type VideoRecomendado } from "@/models/autocuidado.model";

/** Un video de YouTube que la IA recomienda para acompañar el momento. Abre YouTube en otra pestaña. */
export function TarjetaVideo({ video }: { video: VideoRecomendado }) {
  return (
    <section aria-labelledby="video-para-ti">
      <h2 id="video-para-ti" className="mb-3 text-sm font-semibold text-slate-900">
        Para ver ahora
      </h2>
      <a
        href={enlaceVideo(video.videoId)}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <div className="relative aspect-video bg-slate-100">
          {/* unoptimized: la miniatura la sirve YouTube directamente, sin pasar por el optimizador de Next */}
          <Image src={miniaturaVideo(video.videoId)} alt="" fill unoptimized sizes="(max-width: 448px) 100vw, 448px" className="object-cover" />
          <span
            aria-hidden="true"
            className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <Play className="size-5 fill-current" />
          </span>
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
          <span className="sr-only">(se abre YouTube en una pestaña nueva)</span>
        </div>
      </a>
    </section>
  );
}
