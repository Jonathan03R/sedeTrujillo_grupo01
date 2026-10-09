import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerPantallaRegistro } from "@/controllers/registro.controller";
import { RegistroView } from "@/views/registro/RegistroView";

// Registrar emoción llama a la IA en tiempo real (~20 s, hasta 60 s con herramientas): la Server Action
// hereda este límite. Sin esto, Vercel corta la función a los pocos segundos.
export const maxDuration = 60;

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
