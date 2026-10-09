import type { ComponentPropsWithoutRef } from "react";
import { clasesBoton, type TamanoBoton, type VarianteBoton } from "./estilos-boton";

interface BotonProps extends ComponentPropsWithoutRef<"button"> {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
}

export function Boton({ variante = "primario", tamano = "normal", className = "", type = "button", ...props }: BotonProps) {
  return <button type={type} className={clasesBoton(variante, tamano, className)} {...props} />;
}
