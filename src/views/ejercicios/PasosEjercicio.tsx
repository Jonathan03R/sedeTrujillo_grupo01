import { Tarjeta } from "@/components/ui/Tarjeta";

export function PasosEjercicio({ pasos }: { pasos: readonly string[] }) {
  return (
    <Tarjeta aria-labelledby="como-hacerlo">
      <h2 id="como-hacerlo" className="mb-3 text-sm font-semibold text-slate-900">
        Cómo hacerlo
      </h2>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
        {pasos.map((paso) => (
          <li key={paso}>{paso}</li>
        ))}
      </ol>
    </Tarjeta>
  );
}
