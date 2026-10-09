import { Clock, MoonStar, Smartphone, Hand } from "lucide-react";
import { AvisoApoyo } from "@/components/ui/AvisoApoyo";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { TarjetaIndicador } from "@/components/ui/TarjetaIndicador";
import type { AnalisisUsoTelefono, ResumenDiaUso } from "@/models/uso-telefono.model";
import { GraficoUsoSemanal } from "./GraficoUsoSemanal";
import { TarjetaAnalisisIA } from "./TarjetaAnalisisIA";

interface UsoTelefonoViewProps {
  dias: readonly ResumenDiaUso[];
  promedioDiario: string | null;
  madrugada: string;
  aperturaPromedio: number;
  analisis: AnalisisUsoTelefono | null;
}

export function UsoTelefonoView({ dias, promedioDiario, madrugada, aperturaPromedio, analisis }: UsoTelefonoViewProps) {
  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo="Uso del teléfono" />

      <p className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
        <Smartphone className="size-4 shrink-0 text-blue-500" aria-hidden="true" />
        Monitoreo en segundo plano · en esta demostración los datos son simulados.
      </p>

      {dias.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">Aún no hay datos de uso del teléfono.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <TarjetaIndicador icono={Clock} etiqueta="Por día">
              <p className="text-sm font-semibold text-slate-900">{promedioDiario}</p>
            </TarjetaIndicador>
            <TarjetaIndicador icono={MoonStar} etiqueta="Madrugada">
              <p className="text-sm font-semibold text-slate-900">{madrugada}</p>
            </TarjetaIndicador>
            <TarjetaIndicador icono={Hand} etiqueta="Aperturas">
              <p className="text-sm font-semibold text-slate-900">{aperturaPromedio}/día</p>
            </TarjetaIndicador>
          </div>

          <GraficoUsoSemanal dias={dias} />
          <TarjetaAnalisisIA analisis={analisis} />
        </>
      )}

      <AvisoApoyo />
    </div>
  );
}
