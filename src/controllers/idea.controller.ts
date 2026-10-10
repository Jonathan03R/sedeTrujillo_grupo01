import { esIconoAlternativa } from "@/models/autocuidado.model";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

/**
 * La pantalla de una idea de «También puedes…». El destino depende del ícono de la tarjeta:
 * Carga solo resultados preparados al registrar la emoción.
 * Devuelve null si el ícono no existe.
 */
export async function obtenerIdea(icono: string) {
  if (!esIconoAlternativa(icono)) return null;

  const { alternativas, lugar, video } = await obtenerRecomendacionActual();

  return {
    icono,
    alternativa: alternativas.find((a) => a.icono === icono) ?? null,
    lugar,
    video,
    videoGusto: null,
  };
}
