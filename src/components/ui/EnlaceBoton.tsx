import Link from "next/link";
import type { ComponentProps } from "react";
import { clasesBoton, type TamanoBoton, type VarianteBoton } from "./estilos-boton";

interface EnlaceBotonProps extends ComponentProps<typeof Link> {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
}

/** Un enlace de navegación con aspecto de botón. */
export function EnlaceBoton({ variante = "primario", tamano = "normal", className = "", ...props }: EnlaceBotonProps) {
  return <Link className={clasesBoton(variante, tamano, className)} {...props} />;
}
