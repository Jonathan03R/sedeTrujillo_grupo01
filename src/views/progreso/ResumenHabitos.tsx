import { BarraProgreso } from "@/components/ui/BarraProgreso";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { Habito } from "@/models/progreso.model";

export function ResumenHabitos({ habitos }: { habitos: readonly Habito[] }) {
  return (
    <Tarjeta aria-labelledby="titulo-habitos">
      <h2 id="titulo-habitos" className="mb-3 text-sm font-semibold text-slate-900">
        Hábitos de autocuidado
      </h2>
      <ul className="space-y-4">
        {habitos.map((habito) => (
          <li key={habito.id}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-slate-700">{habito.nombre}</span>
              <span className="text-slate-500">
                {habito.completados}/{habito.meta}
              </span>
            </div>
            <BarraProgreso valor={habito.completados} maximo={habito.meta} etiqueta={habito.nombre} />
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}
