type TonoPaso = "azul" | "verde";

const TONOS: Record<TonoPaso, string> = {
  azul: "bg-blue-100 text-blue-700",
  verde: "bg-emerald-100 text-emerald-700",
};

interface TituloPasoProps {
  numero: number;
  titulo: string;
  tono?: TonoPaso;
  id?: string;
}

/** Encabezado de un bloque numerado: círculo con el número y la pregunta. */
export function TituloPaso({ numero, titulo, tono = "azul", id }: TituloPasoProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${TONOS[tono]}`}
      >
        {numero}
      </span>
      <h2 id={id} className="text-base font-bold text-slate-900">
        {titulo}
      </h2>
    </div>
  );
}
