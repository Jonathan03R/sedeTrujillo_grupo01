import { SignalHigh, SignalLow } from "lucide-react";
import { INTENSIDADES, INTENSIDAD_MAXIMA, type Intensidad } from "@/models/emocion.model";

interface EscalaIntensidadProps {
  valor: Intensidad;
  onCambiar: (intensidad: Intensidad) => void;
}

// Escala del 1 al 10 en dos filas de 5 para que quepa en el ancho de un teléfono.
export function EscalaIntensidad({ valor, onCambiar }: EscalaIntensidadProps) {
  return (
    <div>
      <div role="radiogroup" aria-label="Intensidad" className="grid grid-cols-5 place-items-center gap-2.5">
        {INTENSIDADES.map((intensidad) => {
          const seleccionada = intensidad === valor;
          return (
            <button
              key={intensidad}
              type="button"
              role="radio"
              aria-checked={seleccionada}
              aria-label={`Intensidad ${intensidad} de ${INTENSIDAD_MAXIMA}`}
              onClick={() => onCambiar(intensidad)}
              className={`flex size-12 items-center justify-center rounded-full border text-lg font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                seleccionada
                  ? "scale-110 border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
          Muy intensa
        </span>
      </div>
    </div>
  );
}
