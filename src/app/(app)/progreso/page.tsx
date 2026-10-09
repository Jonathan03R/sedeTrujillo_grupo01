import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerPantallaProgreso } from "@/controllers/progreso.controller";
import { ProgresoView } from "@/views/progreso/ProgresoView";

async function Contenido() {
  return <ProgresoView {...await obtenerPantallaProgreso()} />;
}

export default function PaginaProgreso() {
  return (
    <ConCarga>
      <Contenido />
    </ConCarga>
  );
}
