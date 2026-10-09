import { AlertaRoja } from "@/components/alertas/AlertaRoja";
import { TarjetaEjercicio } from "@/components/ejercicios/TarjetaEjercicio";
import { RecomendacionApoyo } from "@/components/ejercicios/RecomendacionApoyo";
import { AlertaEmocional } from "@/components/emociones/AlertaEmocional";
import { AvisoApoyo } from "@/components/ui/AvisoApoyo";
import { EnlaceBoton } from "@/components/ui/EnlaceBoton";
import { TituloPantalla } from "@/components/ui/TituloPantalla";
import { responderAlerta } from "@/controllers/responder-notificacion.action";
import type { Emocion } from "@/models/emocion.model";
import type { AlertaEmocional as DatosAlerta, Ejercicio, MensajeApoyo } from "@/models/ejercicio.model";
import type { Notificacion } from "@/models/notificacion.model";

interface InicioViewProps {
  nombre: string;
  alerta: DatosAlerta | null;
  apoyo: MensajeApoyo | null;
  recomendado: Ejercicio;
  alertaRoja: { notificacion: Notificacion; emociones: readonly Emocion[] } | null;
}

export function InicioView({ nombre, alerta, apoyo, recomendado, alertaRoja }: InicioViewProps) {
  return (
    <div className="space-y-5">
      <TituloPantalla titulo={`Hola, ${nombre}`} subtitulo="Esto preparamos para ti hoy." />

      {alertaRoja && <AlertaRoja {...alertaRoja} onResponder={responderAlerta} />}
      {alerta && <AlertaEmocional {...alerta} />}
      {apoyo && <RecomendacionApoyo {...apoyo} />}

      <section aria-labelledby="para-ti-ahora" className="space-y-3">
        <h2 id="para-ti-ahora" className="text-sm font-semibold text-slate-900">
          Para ti ahora
        </h2>
        <TarjetaEjercicio ejercicio={recomendado} />
        <EnlaceBoton href="/ejercicios">Ir a mi momento de calma</EnlaceBoton>
      </section>

      <EnlaceBoton href="/registro" variante="secundario">
        Registrar otra emoción
      </EnlaceBoton>

      <AvisoApoyo />
    </div>
  );
}
