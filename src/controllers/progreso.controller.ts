import { buscarEmocion } from "@/models/emocion.model";
import type {
  EstadoActual,
  PeriodoProgreso,
  PuntoGrafico,
  RegistroReciente,
  Tendencia,
} from "@/models/progreso.model";
import type { RegistroEmocional } from "@/models/registro-emocional.model";
import { diaLocal, etiquetaDiaMes, etiquetaDiaSemana, fechaHoraLegible } from "@/lib/fechas";
import { listarHabitos } from "@/repositories/habito.repository";
import { listarRegistros } from "@/repositories/registro-emocional.repository";

const CONSEJOS_PREVENCION = [
  "Haz una pausa de 5 minutos entre tareas largas.",
  "Respira profundo antes de un examen o una entrega.",
  "Duerme a la misma hora para recuperar energía.",
];

const CANTIDAD_RECIENTES = 4;
const CAMBIO_MINIMO_TENDENCIA = 0.5;

function aPuntos(
  registros: readonly RegistroEmocional[],
  etiquetar: (iso: string) => string,
): PuntoGrafico[] {
  return registros.map((registro) => ({
    etiqueta: etiquetar(registro.registradoEn),
    intensidad: registro.intensidad,
    emocion: buscarEmocion(registro.emocion),
  }));
}

function promedioAnimo(registros: readonly RegistroEmocional[]): number {
  const suma = registros.reduce((total, r) => total + buscarEmocion(r.emocion).valor, 0);
  return suma / registros.length;
}

function calcularTendencia(
  semana: readonly RegistroEmocional[],
  semanaPrevia: readonly RegistroEmocional[],
): Tendencia | null {
  if (semana.length === 0 || semanaPrevia.length === 0) return null;
  const cambio = promedioAnimo(semana) - promedioAnimo(semanaPrevia);
  if (cambio >= CAMBIO_MINIMO_TENDENCIA) return "mejora";
  if (cambio <= -CAMBIO_MINIMO_TENDENCIA) return "baja";
  return "estable";
}

export async function obtenerPantallaProgreso() {
  const [lista, habitos] = await Promise.all([listarRegistros(), listarHabitos()]);
  const registros = [...lista].sort((a, b) => Date.parse(a.registradoEn) - Date.parse(b.registradoEn));
  const ultimo = registros[registros.length - 1];

  // Los rangos parten del último registro (no del reloj) para que la pantalla sea determinista.
  const diaReferencia = ultimo ? diaLocal(ultimo.registradoEn) : 0;
  const dentro = (r: RegistroEmocional, desdeExclusivo: number, hastaInclusivo: number) => {
    const dia = diaLocal(r.registradoEn);
    return dia > diaReferencia - desdeExclusivo && dia <= diaReferencia - hastaInclusivo;
  };

  const semana = registros.filter((r) => dentro(r, 7, 0));
  const semanaPrevia = registros.filter((r) => dentro(r, 14, 7));
  const mes = registros.filter((r) => dentro(r, 30, 0));

  const periodos: Record<PeriodoProgreso, PuntoGrafico[]> = {
    semana: aPuntos(semana, etiquetaDiaSemana),
    mes: aPuntos(mes, etiquetaDiaMes),
    todos: aPuntos(registros, etiquetaDiaMes),
  };

  const estadoActual: EstadoActual | null = ultimo
    ? { emocion: buscarEmocion(ultimo.emocion), intensidad: ultimo.intensidad }
    : null;

  const recientes: RegistroReciente[] = [...registros]
    .reverse()
    .slice(0, CANTIDAD_RECIENTES)
    .map((r) => ({
      id: r.id,
      emocion: buscarEmocion(r.emocion),
      intensidad: r.intensidad,
      fechaTexto: fechaHoraLegible(r.registradoEn),
    }));

  return {
    periodos,
    estadoActual,
    tendencia: calcularTendencia(semana, semanaPrevia),
    recientes,
    habitos,
    consejos: CONSEJOS_PREVENCION,
  };
}
