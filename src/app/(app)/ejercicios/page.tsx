import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerPantallaEjercicios } from "@/controllers/ejercicios.controller";
import { EjerciciosView } from "@/views/ejercicios/EjerciciosView";

async function Contenido() {
  return <EjerciciosView {...await obtenerPantallaEjercicios()} />;
}

export default function PaginaEjercicios() {
  return (
    <ConCarga>
      <Contenido />
    </ConCarga>
  );
}
