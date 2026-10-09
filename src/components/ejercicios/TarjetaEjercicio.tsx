import { ETIQUETA_TIPO_EJERCICIO, type Ejercicio } from "@/models/ejercicio.model";
import { Insignia } from "@/components/ui/Insignia";
import { Tarjeta } from "@/components/ui/Tarjeta";

export function TarjetaEjercicio({ ejercicio }: { ejercicio: Ejercicio }) {
  return (
    <Tarjeta>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{ejercicio.titulo}</h3>
        <span className="shrink-0 text-xs text-slate-500">{ejercicio.duracionMinutos} min</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{ejercicio.descripcion}</p>
      <div className="mt-3">
        <Insignia>{ETIQUETA_TIPO_EJERCICIO[ejercicio.tipo]}</Insignia>
      </div>
    </Tarjeta>
  );
}
