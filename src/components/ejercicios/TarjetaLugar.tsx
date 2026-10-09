import { ExternalLink, MapPin } from "lucide-react";
import { ETIQUETA_ACTIVIDAD, enlaceLugar, type LugarRecomendado } from "@/models/autocuidado.model";

function textoDistancia(metros: number): string {
  return metros < 1000 ? `a ${Math.round(metros / 10) * 10} m` : `a ${(metros / 1000).toFixed(1).replace(".", ",")} km`;
}

/** Un lugar real y cercano que la IA recomienda según lo que le gusta a la persona. */
export function TarjetaLugar({ lugar }: { lugar: LugarRecomendado }) {
  return (
    <section aria-labelledby="lugar-cercano">
      <h2 id="lugar-cercano" className="mb-3 text-sm font-semibold text-slate-900">
        Cerca de ti
      </h2>
      <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600"
          >
            <MapPin className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900">{lugar.nombre}</h3>
            <p className="text-xs text-slate-500">
              {ETIQUETA_ACTIVIDAD[lugar.actividad]} · {textoDistancia(lugar.distanciaMetros)}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-700">{lugar.motivo}</p>
        <a
          href={enlaceLugar(lugar)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          Cómo llegar
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </div>
    </section>
  );
}
