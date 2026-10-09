interface BarraProgresoProps {
  valor: number;
  maximo: number;
  etiqueta: string;
}

export function BarraProgreso({ valor, maximo, etiqueta }: BarraProgresoProps) {
  const porcentaje = Math.min(100, Math.round((valor / maximo) * 100));
  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={maximo}
      aria-valuenow={valor}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
    >
      <div className="h-full rounded-full bg-blue-600" style={{ width: `${porcentaje}%` }} />
    </div>
  );
}
