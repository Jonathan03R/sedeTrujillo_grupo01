import { Suspense, type ReactNode } from "react";
import { CargandoPantalla } from "./CargandoPantalla";

/** Envuelve el contenido que lee datos por petición: la estructura sale al instante y el esqueleto se ve mientras llegan. */
export function ConCarga({ children }: { children: ReactNode }) {
  return <Suspense fallback={<CargandoPantalla />}>{children}</Suspense>;
}
