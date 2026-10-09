import { obtenerRecomendacionActual } from "./recomendacion.controller";

export async function obtenerPantallaEjercicios() {
  return obtenerRecomendacionActual();
}
