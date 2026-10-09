import type { Emocion } from "@/models/emocion.model";
import { TONOS_EMOCION } from "./tonos-emocion";

type Tamano = "sm" | "md" | "lg";

const TAMANOS: Record<Tamano, string> = {
  sm: "size-10 text-xl",
  md: "size-12 text-2xl",
  lg: "size-14 text-3xl",
};

export function AvatarEmocion({ emocion, tamano = "md" }: { emocion: Emocion; tamano?: Tamano }) {
  const tono = TONOS_EMOCION[emocion.id];
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full border ${tono.fondo} ${tono.borde} ${TAMANOS[tamano]}`}
    >
      {emocion.emoji}
    </span>
  );
}
