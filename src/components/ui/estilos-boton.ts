export type VarianteBoton = "primario" | "secundario";
export type TamanoBoton = "normal" | "grande";

const BASE =
  "inline-flex w-full items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTES: Record<VarianteBoton, string> = {
  primario: "bg-blue-600 text-white hover:bg-blue-700",
  secundario: "bg-blue-50 text-blue-700 hover:bg-blue-100",
};

const TAMANOS: Record<TamanoBoton, string> = {
  normal: "rounded-xl px-4 py-3 text-sm",
  grande: "rounded-full px-6 py-3.5 text-lg",
};

/** Estilos compartidos por Boton y EnlaceBoton para que se vean igual. */
export function clasesBoton(variante: VarianteBoton = "primario", tamano: TamanoBoton = "normal", extra = ""): string {
  return `${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${extra}`.trim();
}
