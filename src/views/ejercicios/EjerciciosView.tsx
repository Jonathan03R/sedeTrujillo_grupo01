import Link from "next/link";
import { AlternativasAutocuidado } from "@/components/ejercicios/AlternativasAutocuidado";
import { RecomendacionApoyo } from "@/components/ejercicios/RecomendacionApoyo";
import { TarjetaEjercicio } from "@/components/ejercicios/TarjetaEjercicio";
import { AlertaEmocional } from "@/components/emociones/AlertaEmocional";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { EnlaceBoton } from "@/components/ui/EnlaceBoton";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { AlternativaAutocuidado } from "@/models/autocuidado.model";
import type { AlertaEmocional as DatosAlerta, Ejercicio, MensajeApoyo } from "@/models/ejercicio.model";
import { EjercicioRecomendado } from "./EjercicioRecomendado";

interface EjerciciosViewProps {
  alerta: DatosAlerta | null;
  apoyo: MensajeApoyo | null;
  /** El ejercicio de hoy; null si la franja de intensidad de hoy solo lleva recomendación. */
  recomendado: Ejercicio | null;
  otros: readonly Ejercicio[];
  alternativas: readonly AlternativaAutocuidado[];
}

// Todo lo que cambia con el registro (título, mensaje, ejercicio e ideas) viene de la
// recomendación que armó la IA para ese registro. El catálogo solo aporta el ejercicio y sus datos.
export function EjerciciosView({ alerta, apoyo, recomendado, otros, alternativas }: EjerciciosViewProps) {
  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo="Mi momento de calma" volverA="/inicio" />

      {alerta ? (
        <AlertaEmocional {...alerta} />
      ) : (
        <Tarjeta>
          <p className="text-sm text-slate-600">Aún no registras cómo te sientes.</p>
          <Link href="/registro" className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline">
            Registrar mi emoción
          </Link>
        </Tarjeta>
      )}

      {apoyo && <RecomendacionApoyo {...apoyo} />}

      {recomendado && (
        <>
          <EjercicioRecomendado ejercicio={recomendado} />
          <EnlaceBoton href={`/ejercicios/${recomendado.id}`} tamano="grande">
            {recomendado.fases ? "Respiración guiada" : "Empezar ejercicio"}
          </EnlaceBoton>
        </>
      )}

      <AlternativasAutocuidado alternativas={alternativas} />

      {otros.length > 0 && (
      <section aria-labelledby="mas-ejercicios">
        <h2 id="mas-ejercicios" className="mb-3 text-sm font-semibold text-slate-900">
          Otros ejercicios para esta emoción
        </h2>
        <ul className="space-y-3">
          {otros.map((ejercicio) => (
            <li key={ejercicio.id}>
              <TarjetaEjercicio ejercicio={ejercicio} />
            </li>
          ))}
        </ul>
      </section>
      )}
    </div>
  );
}
