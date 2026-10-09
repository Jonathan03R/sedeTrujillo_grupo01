import { obtenerPantallaInicio } from "@/controllers/inicio.controller";
import { InicioView } from "@/views/inicio/InicioView";

export default async function PaginaInicio() {
  return <InicioView {...await obtenerPantallaInicio()} />;
}
