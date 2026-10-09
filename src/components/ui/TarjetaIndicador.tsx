import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Tarjeta } from "./Tarjeta";

interface TarjetaIndicadorProps {
  icono: LucideIcon;
  etiqueta: string;
  /** Valor principal del indicador. */
  children: ReactNode;
  detalle?: string;
}

export function TarjetaIndicador({ icono: Icono, etiqueta, children, detalle }: TarjetaIndicadorProps) {
  return (
    <Tarjeta className="p-3">
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <Icono className="size-3.5 text-blue-500" aria-hidden="true" />
        {etiqueta}
      </p>
      <div className="mt-2">{children}</div>
      {detalle && <p className="mt-1 text-xs text-slate-500">{detalle}</p>}
    </Tarjeta>
  );
}
