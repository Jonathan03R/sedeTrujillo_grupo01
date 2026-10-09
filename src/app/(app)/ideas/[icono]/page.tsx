import { notFound } from "next/navigation";
import { ConCarga } from "@/components/ui/ConCarga";
import { obtenerIdea } from "@/controllers/idea.controller";
import { IdeaView } from "@/views/ideas/IdeaView";

async function Contenido({ params }: { params: Promise<{ icono: string }> }) {
  const { icono } = await params;
  const datos = await obtenerIdea(icono);
  if (!datos) notFound();
  return <IdeaView {...datos} />;
}

export default function PaginaIdea({ params }: { params: Promise<{ icono: string }> }) {
  return (
    <ConCarga>
      <Contenido params={params} />
    </ConCarga>
  );
}
