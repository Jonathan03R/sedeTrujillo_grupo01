import { Tarjeta } from "@/components/ui/Tarjeta";
import type { AlternativaAutocuidado } from "@/models/autocuidado.model";

export function PasosIdea({ alternativa }: { alternativa: AlternativaAutocuidado }) {
  const pasos = alternativa.pasos?.length ? alternativa.pasos : [
    { titulo: "Haz una pausa", detalle: alternativa.descripcion, minutos: 1 },
    { titulo: "Ve a tu ritmo", detalle: "Suelta los hombros y elige la parte que te resulte más cómoda.", minutos: 2 },
    { titulo: "Nota cómo estás", detalle: "Al terminar, decide si quieres repetirlo o probar otra opción.", minutos: 1 },
  ];
  return <Tarjeta className="rounded-3xl p-5">
    <h2 className="font-semibold text-slate-900">Prueba esto, paso a paso</h2>
    <ol className="mt-4 space-y-4">
      {pasos.map((paso, i) => <li key={`${paso.titulo}-${i}`} className="flex gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">{i + 1}</span>
        <div><h3 className="font-medium text-slate-900">{paso.titulo} <span className="text-xs font-normal text-slate-500">· {paso.minutos} min</span></h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{paso.detalle}</p></div>
      </li>)}
    </ol>
  </Tarjeta>;
}
