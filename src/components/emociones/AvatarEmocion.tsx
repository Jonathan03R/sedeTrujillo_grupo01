import type { Emocion } from "@/models/emocion.model";
import { IconoEmocion } from "./IconoEmocion";
import { TONOS_EMOCION } from "./tonos-emocion";

type Tamano = "sm" | "md" | "lg";

const TAMANOS: Record<Tamano, { circulo: string; icono: string }> = {
  sm: { circulo: "size-10", icono: "size-7" },
  md: { circulo: "size-12", icono: "size-8" },
  lg: { circulo: "size-14", icono: "size-10" },
};

export function AvatarEmocion({ emocion, tamano = "md" }: { emocion: Emocion; tamano?: Tamano }) {
  const tono = TONOS_EMOCION[emocion.id];
  const medidas = TAMANOS[tamano];
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full border ${tono.fondo} ${tono.borde} ${medidas.circulo}`}
    >
      <IconoEmocion emocion={emocion} className={medidas.icono} />
    </span>
  );
}
