import { notFound } from "next/navigation";
import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerSesionGuiada } from "@/controllers/sesion-guiada.controller";
import { SesionGuiada } from "@/views/ejercicios/SesionGuiada";

async function Contenido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const datos = await obtenerSesionGuiada(id);
  if (!datos) notFound();
  return <SesionGuiada {...datos} />;
}

export default function PaginaSesionGuiada({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ConCarga>
      <Contenido params={params} />
    </ConCarga>
  );
}
