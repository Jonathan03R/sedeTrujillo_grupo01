import { obtenerAlertaPendiente } from "./alerta.controller";
import { obtenerPreguntaSeguimiento } from "./pregunta-seguimiento.controller";
import { obtenerRecomendacionActual } from "./recomendacion.controller";

export async function obtenerPantallaInicio() {
  const [{ estado, apoyo, recomendado, mensaje, alternativas }, alertaRoja, preguntaSeguimiento] = await Promise.all([
    obtenerRecomendacionActual(),
    obtenerAlertaPendiente(),
    obtenerPreguntaSeguimiento(),
  ]);
  return { estado, apoyo, recomendado, mensaje, alternativas, alertaRoja, preguntaSeguimiento };
}
