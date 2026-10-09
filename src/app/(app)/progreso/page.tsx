import { Suspense } from "react";
import { CargandoPantalla } from "@/components/ui/CargandoPantalla";
import { obtenerPantallaProgreso } from "@/controllers/progreso.controller";
import { ProgresoView } from "@/views/progreso/ProgresoView";

async function Contenido() {
  return <ProgresoView {...await obtenerPantallaProgreso()} />;
}

export default function PaginaProgreso() {
  return (
    <Suspense fallback={<CargandoPantalla />}>
      <Contenido />
    </Suspense>
  );
}
