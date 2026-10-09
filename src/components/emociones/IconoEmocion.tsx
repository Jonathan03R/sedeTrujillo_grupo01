import Image from "next/image";
import type { Emocion } from "@/models/emocion.model";

/** El rostro de una emoción (SVG de /public). Decorativo: el texto vecino ya nombra la emoción. */
export function IconoEmocion({ emocion, className = "size-14" }: { emocion: Emocion; className?: string }) {
  return <Image src={emocion.icono} alt="" width={96} height={96} className={className} />;
}
