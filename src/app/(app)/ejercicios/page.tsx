import { Suspense } from "react";
import { CargandoPantalla } from "@/components/ui/CargandoPantalla";
import { obtenerPantallaEjercicios } from "@/controllers/ejercicios.controller";
import { EjerciciosView } from "@/views/ejercicios/EjerciciosView";

async function Contenido() {
  return <EjerciciosView {...await obtenerPantallaEjercicios()} />;
}

export default function PaginaEjercicios() {
  return (
    <Suspense fallback={<CargandoPantalla />}>
      <Contenido />
    </Suspense>
  );
}
