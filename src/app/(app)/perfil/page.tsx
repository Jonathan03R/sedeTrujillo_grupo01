import { obtenerPantallaPerfil } from "@/controllers/perfil.controller";
import { PerfilView } from "@/views/perfil/PerfilView";

export default async function PaginaPerfil() {
  return <PerfilView {...await obtenerPantallaPerfil()} />;
}
