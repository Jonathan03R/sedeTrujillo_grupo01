import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerPantallaUsoTelefono } from "@/controllers/uso-telefono.controller";
import { UsoTelefonoView } from "@/views/uso-telefono/UsoTelefonoView";

async function Contenido() {
  return <UsoTelefonoView {...await obtenerPantallaUsoTelefono()} />;
}

export default function PaginaUsoTelefono() {
  return (
    <ConCarga>
      <Contenido />
    </ConCarga>
  );
}
