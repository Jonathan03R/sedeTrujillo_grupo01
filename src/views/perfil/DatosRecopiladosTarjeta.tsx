import { Tarjeta } from "@/components/ui/Tarjeta";
import type { DatosRecopilados } from "@/models/perfil.model";
import type { NivelAtencion } from "@/models/uso-telefono.model";

const TEXTO_NIVEL: Record<NivelAtencion, string> = {
  bajo: "Rutina estable",
  medio: "Algunos cambios",
  alto: "Cambios importantes",
};

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{etiqueta}</dt>
      <dd className="text-right text-slate-900">{valor}</dd>
    </div>
  );
}

/** Lo que Pulso ha recopilado, a la vista de la persona. */
export function DatosRecopiladosTarjeta({ datos }: { datos: DatosRecopilados }) {
  return (
    <Tarjeta aria-labelledby="titulo-recopilado">
      <h2 id="titulo-recopilado" className="mb-1 text-sm font-semibold text-slate-900">
        Lo que Pulso ha recopilado
      </h2>
      <p className="mb-3 text-xs text-slate-500">Datos de demostración. Los usamos para acompañarte, no para diagnosticar.</p>
      <dl className="space-y-2 text-sm">
        <Fila etiqueta="Pantalla por día (7 días)" valor={datos.promedioDiario ?? "Sin datos"} />
        <Fila etiqueta="Uso de madrugada (7 días)" valor={datos.madrugada} />
        <Fila etiqueta="Veces que abres el teléfono" valor={datos.promedioDiario ? `${datos.aperturaPromedio} por día` : "Sin datos"} />
        <Fila
          etiqueta="Último análisis"
          valor={datos.ultimoAnalisis ? `${TEXTO_NIVEL[datos.ultimoAnalisis.nivel]} · ${datos.ultimoAnalisis.cuando}` : "Aún no hay"}
        />
        <Fila etiqueta="Registros de emoción" valor={String(datos.registrosEmocionales)} />
        <Fila etiqueta="Preguntas que respondiste" valor={String(datos.respuestas)} />
        <Fila etiqueta="Cosas que te gustan" valor={String(datos.gustos)} />
        {datos.preguntaPendiente && <Fila etiqueta="Pregunta pendiente" valor={datos.preguntaPendiente} />}
      </dl>
    </Tarjeta>
  );
}
