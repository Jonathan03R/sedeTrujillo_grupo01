import Link from "next/link";
import { TarjetaEjercicio } from "@/components/ejercicios/TarjetaEjercicio";
import { AlertaEmocional } from "@/components/emociones/AlertaEmocional";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { AlertaEmocional as DatosAlerta, Ejercicio, MensajeApoyo } from "@/models/ejercicio.model";
import { EjercicioRecomendado } from "./EjercicioRecomendado";
import { PasosEjercicio } from "./PasosEjercicio";
import { RecomendacionApoyo } from "./RecomendacionApoyo";
import { RespiracionGuiada } from "./RespiracionGuiada";

interface EjerciciosViewProps {
  alerta: DatosAlerta | null;
  apoyo: MensajeApoyo | null;
  recomendado: Ejercicio;
  otros: readonly Ejercicio[];
}

export function EjerciciosView({ alerta, apoyo, recomendado, otros }: EjerciciosViewProps) {
  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo="Mi momento de calma" volverA="/" />

      {alerta ? (
        <AlertaEmocional {...alerta} />
      ) : (
        <Tarjeta>
          <p className="text-sm text-slate-600">Aún no registras cómo te sientes.</p>
          <Link href="/" className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline">
            Registrar mi emoción
          </Link>
        </Tarjeta>
      )}

      {apoyo && <RecomendacionApoyo {...apoyo} />}

      <EjercicioRecomendado ejercicio={recomendado} />

      {recomendado.fases ? (
        <RespiracionGuiada titulo={recomendado.titulo} fases={recomendado.fases} />
      ) : (
        recomendado.pasos && <PasosEjercicio pasos={recomendado.pasos} />
      )}

      <section aria-labelledby="mas-ejercicios">
        <h2 id="mas-ejercicios" className="mb-3 text-sm font-semibold text-slate-900">
          Más ejercicios
        </h2>
        <ul className="space-y-3">
          {otros.map((ejercicio) => (
            <li key={ejercicio.id}>
              <TarjetaEjercicio ejercicio={ejercicio} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
