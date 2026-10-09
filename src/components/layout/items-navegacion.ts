import { ChartColumn, Droplet, House, Smartphone, User, type LucideIcon } from "lucide-react";

export interface ItemNavegacion {
  href: string;
  etiqueta: string;
  icono: LucideIcon;
  /** Si el ícono se rellena cuando la pestaña está activa (los de líneas abiertas no). */
  rellenar: boolean;
}

export const ITEMS_NAVEGACION: readonly ItemNavegacion[] = [
  { href: "/inicio", etiqueta: "Inicio", icono: House, rellenar: true },
  { href: "/ejercicios", etiqueta: "Ejercicios", icono: Droplet, rellenar: true },
  { href: "/progreso", etiqueta: "Progreso", icono: ChartColumn, rellenar: false },
  { href: "/uso", etiqueta: "Uso", icono: Smartphone, rellenar: false },
  { href: "/perfil", etiqueta: "Perfil", icono: User, rellenar: true },
];
