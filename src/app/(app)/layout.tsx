import { ContenedorApp } from "@/components/layout/ContenedorApp";

export default function LayoutApp({ children }: LayoutProps<"/">) {
  return <ContenedorApp>{children}</ContenedorApp>;
}
