"use client";

import { useState } from "react";
import { Pestanas, type OpcionPestana } from "@/components/ui/Pestanas";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { PeriodoProgreso, PuntoGrafico } from "@/models/progreso.model";
import { GraficoLineaEmocional } from "./GraficoLineaEmocional";

const OPCIONES: readonly OpcionPestana<PeriodoProgreso>[] = [
  { id: "semana", etiqueta: "Semana" },
  { id: "mes", etiqueta: "Mes" },
  { id: "todos", etiqueta: "Todos" },
];

const TITULO_POR_PERIODO: Record<PeriodoProgreso, string> = {
  semana: "esta semana",
  mes: "este mes",
  todos: "en total",
};

export function GraficoPorPeriodo({ periodos }: { periodos: Record<PeriodoProgreso, readonly PuntoGrafico[]> }) {
  const [periodo, setPeriodo] = useState<PeriodoProgreso>("semana");

  return (
    <div className="space-y-3">
      <Pestanas etiqueta="Periodo" opciones={OPCIONES} valor={periodo} onCambiar={setPeriodo} />
      <Tarjeta role="tabpanel">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Mis emociones {TITULO_POR_PERIODO[periodo]}</h2>
        <GraficoLineaEmocional puntos={periodos[periodo]} />
      </Tarjeta>
    </div>
  );
}
