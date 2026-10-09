import { TONOS_EMOCION } from "@/components/emociones/tonos-emocion";
import { INTENSIDAD_MAXIMA } from "@/models/emocion.model";
import type { PuntoGrafico } from "@/models/progreso.model";

// Medidas internas del SVG (el gráfico escala al ancho disponible).
const ANCHO = 320;
const ALTO = 176;
const MARGEN = { izquierda: 26, derecha: 14, arriba: 18, abajo: 30 };
const RADIO = 11;
const ICONO = 17;
// Líneas guía del eje Y (intensidad de 1 a INTENSIDAD_MAXIMA).
const NIVELES = [1, 4, 7, 10];
const MAXIMO_ETIQUETAS = 7;

export function GraficoLineaEmocional({ puntos }: { puntos: readonly PuntoGrafico[] }) {
  if (puntos.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">Aún no hay registros en este periodo.</p>;
  }

  const areaAlto = ALTO - MARGEN.arriba - MARGEN.abajo;
  const xInicio = MARGEN.izquierda + RADIO + 2;
  const xFin = ANCHO - MARGEN.derecha - RADIO;
  const yBase = MARGEN.arriba + areaAlto;

  const x = (indice: number) =>
    puntos.length === 1 ? (xInicio + xFin) / 2 : xInicio + (indice * (xFin - xInicio)) / (puntos.length - 1);
  const y = (nivel: number) => MARGEN.arriba + ((INTENSIDAD_MAXIMA - nivel) / (INTENSIDAD_MAXIMA - 1)) * areaAlto;

  const trazos = puntos.map((p, i) => `${x(i)},${y(p.intensidad)}`);
  const area = `M${x(0)},${yBase} L${trazos.join(" L")} L${x(puntos.length - 1)},${yBase} Z`;
  const cadaCuantas = Math.ceil(puntos.length / MAXIMO_ETIQUETAS);
  const descripcion = puntos
    .map((p) => `${p.etiqueta}: ${p.emocion.etiqueta}, nivel ${p.intensidad}`)
    .join("; ");

  return (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label={`Intensidad emocional. ${descripcion}`} className="w-full">
      <defs>
        <linearGradient id="gradiente-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
        </linearGradient>
      </defs>

      {NIVELES.map((nivel) => (
        <g key={nivel}>
          <line x1={MARGEN.izquierda} x2={ANCHO - MARGEN.derecha} y1={y(nivel)} y2={y(nivel)} stroke="#f1f5f9" />
          <text x={MARGEN.izquierda - 8} y={y(nivel)} textAnchor="end" dominantBaseline="central" fontSize="9" fill="#94a3b8">
            {nivel}
          </text>
        </g>
      ))}

      {puntos.length > 1 && (
        <>
          <path d={area} fill="url(#gradiente-area)" />
          <polyline points={trazos.join(" ")} fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round" />
        </>
      )}

      {puntos.map((punto, i) => {
        const tono = TONOS_EMOCION[punto.emocion.id];
        const mostrarEtiqueta = i % cadaCuantas === 0 || i === puntos.length - 1;
        return (
          <g key={`${punto.etiqueta}-${i}`}>
            <circle cx={x(i)} cy={y(punto.intensidad)} r={RADIO} fill={tono.relleno} stroke={tono.trazo} strokeWidth="1.5" />
            <image
              href={punto.emocion.icono}
              x={x(i) - ICONO / 2}
              y={y(punto.intensidad) - ICONO / 2}
              width={ICONO}
              height={ICONO}
            />
            {mostrarEtiqueta && (
              <text x={x(i)} y={ALTO - 10} textAnchor="middle" fontSize="9" fill="#64748b">
                {punto.etiqueta}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
