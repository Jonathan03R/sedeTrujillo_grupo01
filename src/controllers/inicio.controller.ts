import { obtenerRacha } from "@/repositories/racha.repository";
import { obtenerAlertaPendiente } from "./alerta.controller";
import { obtenerPreguntaSeguimiento } from "./pregunta-seguimiento.controller";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

export async function obtenerPantallaInicio() {
  const [{ estado, apoyo, recomendado, mensaje, alternativas, recomendacionPendiente }, alertaRoja, preguntaSeguimiento, racha] = await Promise.all([
    obtenerRecomendacionActual(),
    obtenerAlertaPendiente(),
    obtenerPreguntaSeguimiento(),
    obtenerRacha(),
  ]);
  return { estado, apoyo, recomendado, mensaje, alternativas, alertaRoja, preguntaSeguimiento, recomendacionPendiente, racha };
}
