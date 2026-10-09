export interface OpcionPestana<T extends string> {
  id: T;
  etiqueta: string;
}

interface PestanasProps<T extends string> {
  etiqueta: string;
  opciones: readonly OpcionPestana<T>[];
  valor: T;
  onCambiar: (id: T) => void;
}

export function Pestanas<T extends string>({ etiqueta, opciones, valor, onCambiar }: PestanasProps<T>) {
  return (
    <div role="tablist" aria-label={etiqueta} className="flex gap-1 rounded-full bg-slate-100 p-1">
      {opciones.map((opcion) => {
        const seleccionada = opcion.id === valor;
        return (
          <button
            key={opcion.id}
            type="button"
            role="tab"
            aria-selected={seleccionada}
            onClick={() => onCambiar(opcion.id)}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              seleccionada ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {opcion.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
