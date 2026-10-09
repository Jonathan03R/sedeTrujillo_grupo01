import { redirect } from "next/navigation";

// La raíz solo reparte: src/proxy.ts decide entre /registro e /inicio antes de llegar aquí.
// Esto es el respaldo por si el proxy no se ejecuta.
export default function PaginaRaiz() {
  redirect("/registro");
}
