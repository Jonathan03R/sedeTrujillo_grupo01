import { INTENSIDADES, type Intensidad } from "@/models/emocion.model";

interface EscalaIntensidadProps {
  valor: Intensidad;
  onCambiar: (intensidad: Intensidad) => void;
}

export function EscalaIntensidad({ valor, onCambiar }: EscalaIntensidadProps) {
  return (
    <div>
      <div role="radiogroup" aria-label="Intensidad" className="flex justify-between gap-2">
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
              className={`size-11 rounded-full border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                seleccionada
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {intensidad}
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>Leve</span>
        <span>Intensa</span>
      </div>
    </div>
  );
}
