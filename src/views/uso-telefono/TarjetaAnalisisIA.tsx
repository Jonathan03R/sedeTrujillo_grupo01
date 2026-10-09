import { HeartHandshake, Sparkles } from "lucide-react";
import { Tarjeta } from "@/components/ui/Tarjeta";
import {
  ETIQUETAS_ANOMALIA,
  type AnalisisUsoTelefono,
  type NivelAtencion,
  type Senal,
  type Severidad,
} from "@/models/uso-telefono.model";
import { etiquetaDiaMes, fechaHoraLegible } from "@/lib/fechas";
import { BotonAnalizar } from "./BotonAnalizar";

const PRESENTACION_NIVEL: Record<NivelAtencion, { texto: string; clases: string }> = {
  bajo: { texto: "Tu rutina se ve estable", clases: "bg-emerald-50 text-emerald-700" },
  medio: { texto: "Notamos algunos cambios", clases: "bg-amber-50 text-amber-700" },
  alto: { texto: "Notamos cambios importantes", clases: "bg-rose-50 text-rose-700" },
};

const TEXTO_SENAL: Record<Senal, string> = {
  bienestar: "Bienestar",
  cansancio: "Cansancio",
  animo_bajo: "Ánimo bajo",
  activacion: "Inquietud",
  irritabilidad: "Irritabilidad",
};

const PUNTO_SEVERIDAD: Record<Severidad, string> = {
  leve: "bg-amber-300",
  moderada: "bg-amber-500",
  alta: "bg-rose-500",
};

export function TarjetaAnalisisIA({ analisis }: { analisis: AnalisisUsoTelefono | null }) {
  if (!analisis) {
    return (
      <Tarjeta aria-labelledby="titulo-analisis" className="space-y-3">
        <h2 id="titulo-analisis" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Sparkles className="size-4 text-blue-500" aria-hidden="true" />
          Análisis con IA
        </h2>
        <p className="text-sm text-slate-600">
          La IA compara tu semana con tu propia rutina para notar a tiempo cambios en tu descanso, tu tiempo de
          pantalla o tu contacto con otras personas, y te sugiere cómo cuidarte.
        </p>
        <BotonAnalizar hayAnalisis={false} />
      </Tarjeta>
    );
  }

  const nivel = PRESENTACION_NIVEL[analisis.nivelAtencion];

  return (
    <Tarjeta aria-labelledby="titulo-analisis" className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h2 id="titulo-analisis" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Sparkles className="size-4 text-blue-500" aria-hidden="true" />
          Análisis con IA
        </h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${nivel.clases}`}>{nivel.texto}</span>
      </div>

      <p className="text-sm leading-relaxed text-slate-700">{analisis.resumen}</p>

      {analisis.senalPredominante && (
        <p className="text-xs text-slate-500">
          Señal que más se repite:{" "}
          <span className="font-medium text-slate-700">{TEXTO_SENAL[analisis.senalPredominante]}</span>
        </p>
      )}

      {analisis.anomalias.length > 0 && (
        <section aria-labelledby="titulo-anomalias">
          <h3 id="titulo-anomalias" className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Cambios detectados
          </h3>
          <ul className="space-y-2">
            {analisis.anomalias.map((anomalia, i) => (
              <li key={`${anomalia.fecha}-${anomalia.tipo}-${i}`} className="flex gap-2.5 text-sm">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${PUNTO_SEVERIDAD[anomalia.severidad]}`}
                  aria-label={`Severidad ${anomalia.severidad}`}
                />
                <div>
                  <p className="font-medium text-slate-900">
                    {ETIQUETAS_ANOMALIA[anomalia.tipo]} ·{" "}
                    <span className="font-normal text-slate-500">
                      {etiquetaDiaMes(`${anomalia.fecha}T12:00:00-05:00`)}
                    </span>
                  </p>
                  <p className="text-slate-600">{anomalia.descripcion}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="titulo-sugerencias">
        <h3 id="titulo-sugerencias" className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Para cuidarte esta semana
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          {analisis.sugerencias.map((sugerencia) => (
            <li key={sugerencia}>{sugerencia}</li>
          ))}
        </ul>
      </section>

      {analisis.sugerirProfesional && (
        <p className="flex gap-2.5 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
          <HeartHandshake className="size-5 shrink-0" aria-hidden="true" />
          Hablar con un profesional de salud mental o con el servicio de bienestar de tu universidad puede ayudarte a
          entender estos cambios. No tienes que pasar por esto sin apoyo.
        </p>
      )}

      <p className="text-[11px] text-slate-400">Analizado el {fechaHoraLegible(analisis.creadoEn)}</p>
      <BotonAnalizar hayAnalisis />
    </Tarjeta>
  );
}
