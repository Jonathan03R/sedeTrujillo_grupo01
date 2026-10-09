import Link from "next/link";
import { TarjetaEjercicio } from "@/components/ejercicios/TarjetaEjercicio";
import { Boton } from "@/components/ui/Boton";
import type { Ejercicio } from "@/models/ejercicio.model";

interface ResultadoRegistroEmocionalProps {
  recomendacion: Ejercicio;
  onReiniciar: () => void;
}

export function ResultadoRegistroEmocional({ recomendacion, onReiniciar }: ResultadoRegistroEmocionalProps) {
  return (
    <div className="space-y-4" aria-live="polite">
      <div>
        <h2 className="font-semibold text-slate-900">Emoción registrada ✔</h2>
        <p className="mt-1 text-sm text-slate-600">Gracias por escucharte. Te sugerimos este ejercicio:</p>
      </div>
      <TarjetaEjercicio ejercicio={recomendacion} />
      <Link
        href="/ejercicios"
        className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Ir a mi momento de calma
      </Link>
      <Boton variante="secundario" onClick={onReiniciar}>
        Registrar otra emoción
      </Boton>
    </div>
  );
}
