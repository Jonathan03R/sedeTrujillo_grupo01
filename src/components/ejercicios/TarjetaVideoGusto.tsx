import { ExternalLink, Heart } from "lucide-react";
import type { VideoGusto } from "@/repositories/video-gusto.repository";

/** Un video de demostración según un gusto de la persona. El enlace abre una búsqueda de YouTube. */
export function TarjetaVideoGusto({ video }: { video: VideoGusto }) {
  const enlace = `https://www.youtube.com/results?search_query=${encodeURIComponent(video.consulta)}`;

  return (
    <section aria-labelledby="video-por-gusto">
      <h2 id="video-por-gusto" className="mb-3 text-sm font-semibold text-slate-900">
        Por lo que te gusta
      </h2>
      <div className="space-y-2 rounded-2xl border border-rose-100 bg-rose-50 p-4">
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
          Buscar en YouTube
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </div>
    </section>
  );
}
