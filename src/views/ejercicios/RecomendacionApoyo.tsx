import { Sparkles } from "lucide-react";
import type { MensajeApoyo } from "@/models/ejercicio.model";

export function RecomendacionApoyo({ titulo, detalle, derivar }: MensajeApoyo) {
  return (
    <section aria-labelledby="recomendacion-para-ti">
      <h2
        id="recomendacion-para-ti"
        className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900"
      >
        Recomendación para ti
        <Sparkles className="size-4 text-amber-500" aria-hidden="true" />
      </h2>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="font-semibold text-slate-900">{titulo}</p>
        <p className="mt-1 text-sm text-slate-600">{detalle}</p>
        {derivar && (
          <p className="mt-3 border-t border-blue-100 pt-3 text-xs text-slate-600">
            Si sientes que es demasiado, habla con alguien de confianza o busca apoyo profesional.
          </p>
        )}
      </div>
    </section>
  );
}
