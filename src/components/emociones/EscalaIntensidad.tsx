import { SignalHigh, SignalLow } from "lucide-react";
import { INTENSIDADES, type Intensidad } from "@/models/emocion.model";

interface EscalaIntensidadProps {
  valor: Intensidad;
  onCambiar: (intensidad: Intensidad) => void;
}

export function EscalaIntensidad({ valor, onCambiar }: EscalaIntensidadProps) {
  return (
    <div>
      <div role="radiogroup" aria-label="Intensidad" className="flex items-center justify-between">
        {INTENSIDADES.map((intensidad) => {
          const seleccionada = intensidad === valor;
          return (
            <button
              key={intensidad}
              type="button"
              role="radio"
              aria-checked={seleccionada}
              aria-label={`Intensidad ${intensidad} de 5`}
              onClick={() => onCambiar(intensidad)}
              className={`flex items-center justify-center rounded-full border font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                seleccionada
                  ? "size-16 border-blue-500 bg-blue-500 text-2xl text-white shadow-lg shadow-blue-500/30"
                  : "size-12 border-slate-200 bg-slate-50 text-lg text-slate-600 hover:bg-slate-100"
              }`}
            >
              {intensidad}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <SignalLow className="size-5 text-slate-500" aria-hidden="true" />
          Leve
        </span>
        <span className="flex items-center gap-1.5">
          <SignalHigh className="size-5 text-slate-500" aria-hidden="true" />
          Intensa
        </span>
      </div>
    </div>
  );
}
