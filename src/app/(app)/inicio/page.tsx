import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerPantallaInicio } from "@/controllers/inicio.controller";
import { InicioView } from "@/views/inicio/InicioView";

async function Contenido() {
  return <InicioView {...await obtenerPantallaInicio()} />;
}

export default function PaginaInicio() {
  return (
    <ConCarga>
      <Contenido />
    </ConCarga>
  );
}
