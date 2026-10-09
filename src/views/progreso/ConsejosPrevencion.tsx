import { Tarjeta } from "@/components/ui/Tarjeta";

export function ConsejosPrevencion({ consejos }: { consejos: readonly string[] }) {
  return (
    <Tarjeta aria-labelledby="titulo-consejos">
      <h2 id="titulo-consejos" className="mb-3 text-sm font-semibold text-slate-900">
        Para prevenir el estrés
      </h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
        {consejos.map((consejo) => (
          <li key={consejo}>{consejo}</li>
        ))}
      </ul>
    </Tarjeta>
  );
}
