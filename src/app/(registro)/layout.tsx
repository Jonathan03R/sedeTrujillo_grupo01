import { ContenedorApp } from "@/components/layout/ContenedorApp";

// Pantalla de entrada: se ve sin menú de navegación.
export default function LayoutRegistro({ children }: LayoutProps<"/">) {
  return <ContenedorApp conNavegacion={false}>{children}</ContenedorApp>;
}
