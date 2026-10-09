import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerPantallaPerfil } from "@/controllers/perfil.controller";
import { PerfilView } from "@/views/perfil/PerfilView";

async function Contenido() {
  return <PerfilView {...await obtenerPantallaPerfil()} />;
}

export default function PaginaPerfil() {
  return (
    <ConCarga>
      <Contenido />
    </ConCarga>
  );
}
