import { AvisoApoyo } from "@/components/ui/AvisoApoyo";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { TituloPantalla } from "@/components/ui/TituloPantalla";
import type { Emocion } from "@/models/emocion.model";
import { FormularioRegistro } from "./FormularioRegistro";

interface InicioViewProps {
  nombre: string;
  emociones: readonly Emocion[];
}

export function InicioView({ nombre, emociones }: InicioViewProps) {
  return (
    <div className="space-y-5">
      <TituloPantalla titulo={`Hola, ${nombre}`} subtitulo="¿Cómo te sientes hoy?" />
      <Tarjeta>
        <FormularioRegistro emociones={emociones} />
      </Tarjeta>
      <AvisoApoyo />
    </div>
  );
}
