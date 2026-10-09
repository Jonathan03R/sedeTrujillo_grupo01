import { Activity, ArrowRight, ChartColumn, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { AvatarEmocion } from "@/components/emociones/AvatarEmocion";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { TarjetaIndicador } from "@/components/ui/TarjetaIndicador";
import type {
  EstadoActual,
  Habito,
  PeriodoProgreso,
  PuntoGrafico,
  RegistroReciente,
  Tendencia,
} from "@/models/progreso.model";
import { ConsejosPrevencion } from "./ConsejosPrevencion";
import { GraficoPorPeriodo } from "./GraficoPorPeriodo";
import { ListaRegistrosRecientes } from "./ListaRegistrosRecientes";
import { ResumenHabitos } from "./ResumenHabitos";

const PRESENTACION_TENDENCIA: Record<Tendencia, { texto: string; icono: LucideIcon; color: string }> = {
  mejora: { texto: "Mejora", icono: TrendingUp, color: "text-emerald-600" },
  estable: { texto: "Estable", icono: ArrowRight, color: "text-slate-600" },
  baja: { texto: "Más tensión", icono: TrendingDown, color: "text-amber-600" },
};

interface ProgresoViewProps {
  periodos: Record<PeriodoProgreso, readonly PuntoGrafico[]>;
  estadoActual: EstadoActual | null;
  tendencia: Tendencia | null;
  recientes: readonly RegistroReciente[];
  habitos: readonly Habito[];
  consejos: readonly string[];
}

export function ProgresoView({ periodos, estadoActual, tendencia, recientes, habitos, consejos }: ProgresoViewProps) {
  const presentacion = tendencia ? PRESENTACION_TENDENCIA[tendencia] : null;

  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo="Mi progreso" />

      <GraficoPorPeriodo periodos={periodos} />

      <div className="grid grid-cols-2 gap-3">
        <TarjetaIndicador icono={ChartColumn} etiqueta="Estado actual">
          {estadoActual ? (
            <div className="flex items-center gap-2">
              <AvatarEmocion emocion={estadoActual.emocion} tamano="sm" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{estadoActual.emocion.etiqueta}</p>
                <p className="text-xs text-slate-500">Nivel {estadoActual.intensidad}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sin registros</p>
          )}
        </TarjetaIndicador>

        <TarjetaIndicador
          icono={Activity}
          etiqueta="Tendencia"
          detalle={presentacion ? "Comparado con la semana anterior" : "Faltan registros para comparar"}
        >
          {presentacion ? (
            <p className={`flex items-center gap-1.5 text-sm font-semibold ${presentacion.color}`}>
              <presentacion.icono className="size-4" aria-hidden="true" />
              {presentacion.texto}
            </p>
          ) : (
            <p className="text-sm text-slate-500">–</p>
          )}
        </TarjetaIndicador>
      </div>

      <ListaRegistrosRecientes registros={recientes} />
      <ResumenHabitos habitos={habitos} />
      <ConsejosPrevencion consejos={consejos} />
    </div>
  );
}
