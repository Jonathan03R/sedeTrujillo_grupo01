import Image from "next/image";
import { AvisoApoyo } from "@/components/ui/AvisoApoyo";
import { IndicadorPasos } from "@/components/ui/IndicadorPasos";
import type { Emocion } from "@/models/emocion.model";
import { FormularioRegistro } from "./FormularioRegistro";

interface RegistroViewProps {
  nombre: string;
  emociones: readonly Emocion[];
}

export function RegistroView({ nombre, emociones }: RegistroViewProps) {
  return (
    <div className="space-y-4">
      <header className="relative min-h-36">
        <div className="space-y-4 pt-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Hola, {nombre} <span aria-hidden="true">👋</span>
          </h1>
          <IndicadorPasos total={2} actual={1} />
        </div>
        <Image
          src="/ilustraciones/yoana-abrazo.png"
          alt=""
          width={700}
          height={633}
          priority
          className="pointer-events-none absolute right-0 -bottom-4 h-auto w-40"
        />
      </header>

      <FormularioRegistro emociones={emociones} />
      <AvisoApoyo />
    </div>
  );
}
