import { ExternalLink } from "lucide-react";
import type { VideoEmocion } from "@/repositories/catalogo-estatico.repository";

/** Un video de demostración según la emoción de hoy. El enlace abre una búsqueda de YouTube. */
export function TarjetaVideoEmocion({ video }: { video: VideoEmocion }) {
  const enlace = `https://www.youtube.com/results?search_query=${encodeURIComponent(video.consulta)}`;

  return (
    <div className="space-y-2 rounded-2xl border border-rose-100 bg-rose-50 p-4">
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
  );
}
