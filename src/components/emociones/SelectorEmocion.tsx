import type { Emocion, EmocionId } from "@/models/emocion.model";

interface SelectorEmocionProps {
  emociones: readonly Emocion[];
  valor: EmocionId | null;
  onCambiar: (id: EmocionId) => void;
}

export function SelectorEmocion({ emociones, valor, onCambiar }: SelectorEmocionProps) {
  return (
    <div role="radiogroup" aria-label="Emoción" className="grid grid-cols-2 gap-2">
      {emociones.map((emocion) => {
        const seleccionada = emocion.id === valor;
        return (
          <button
            key={emocion.id}
            type="button"
            role="radio"
            aria-checked={seleccionada}
            onClick={() => onCambiar(emocion.id)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors last:odd:col-span-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              seleccionada
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {emocion.emoji}
            </span>
            {emocion.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
