import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerPantallaRegistro } from "@/controllers/registro.controller";
import { RegistroView } from "@/views/registro/RegistroView";

async function Contenido() {
  return <RegistroView {...await obtenerPantallaRegistro()} />;
}

export default function PaginaRegistro() {
  return (
    <ConCarga>
      <Contenido />
    </ConCarga>
  );
}
