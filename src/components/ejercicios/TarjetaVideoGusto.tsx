import { ExternalLink, Heart } from "lucide-react";
import type { VideoGusto } from "@/repositories/video-gusto.repository";

/** Un video según un gusto de la persona. Se reproduce aquí mismo con el reproductor de YouTube. */
export function TarjetaVideoGusto({ video }: { video: VideoGusto }) {
  const enlace = video.videoId
    ? `https://www.youtube.com/watch?v=${video.videoId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(video.consulta)}`;

  return (
    <section aria-labelledby="video-por-gusto">
      <h2 id="video-por-gusto" className="mb-3 text-sm font-semibold text-slate-900">
        Por lo que te gusta
      </h2>
      <div className="space-y-2 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
        {video.videoId && (
          <div className="aspect-video bg-slate-950">
            <iframe
              className="size-full"
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?playsinline=1&rel=0`}
              title={video.titulo}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
        <div className="space-y-2 p-4">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Heart className="size-3.5 fill-pink-400 text-pink-400" aria-hidden="true" />
            Tu gusto: {video.gusto}
          </p>
          <h3 className="font-semibold text-slate-900">{video.titulo}</h3>
          <p className="text-xs text-slate-500">{video.canal}</p>
          <a
            href={enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline focus-visible:outline-2 focus-visible:outline-rose-600"
          >
            Abrir en YouTube
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
