import { Check } from "lucide-react";
import type { Emocion, EmocionId } from "@/models/emocion.model";
import { IconoEmocion } from "./IconoEmocion";
import { TONOS_EMOCION } from "./tonos-emocion";

interface SelectorEmocionProps {
  emociones: readonly Emocion[];
  valor: EmocionId | null;
  onCambiar: (id: EmocionId) => void;
}

export function SelectorEmocion({ emociones, valor, onCambiar }: SelectorEmocionProps) {
  return (
    <div role="radiogroup" aria-label="Emoción" className="grid grid-cols-3 gap-3">
      {emociones.map((emocion) => {
        const seleccionada = emocion.id === valor;
        const tono = TONOS_EMOCION[emocion.id];
        return (
          <button
            key={emocion.id}
            type="button"
            role="radio"
            aria-checked={seleccionada}
            onClick={() => onCambiar(emocion.id)}
            className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-1 py-4 text-[13px] font-medium text-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${tono.tarjeta} ${
              seleccionada ? tono.seleccionada : "border-transparent hover:brightness-95"
            }`}
          >
            {seleccionada && (
              <span
                aria-hidden="true"
                className={`absolute top-2 right-2 flex size-6 items-center justify-center rounded-full text-white ${tono.insignia}`}
              >
                <Check className="size-4" strokeWidth={3} />
              </span>
            )}
            <IconoEmocion emocion={emocion} className="size-16" />
            {emocion.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
