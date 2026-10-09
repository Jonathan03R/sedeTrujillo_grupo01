import { ChartColumn, Droplet, House, User, type LucideIcon } from "lucide-react";

export interface ItemNavegacion {
  href: string;
  etiqueta: string;
  icono: LucideIcon;
  /** Si el ícono se rellena cuando la pestaña está activa (los de líneas abiertas no). */
  rellenar: boolean;
}

export const ITEMS_NAVEGACION: readonly ItemNavegacion[] = [
  { href: "/", etiqueta: "Inicio", icono: House, rellenar: true },
  { href: "/ejercicios", etiqueta: "Ejercicios", icono: Droplet, rellenar: true },
  { href: "/progreso", etiqueta: "Progreso", icono: ChartColumn, rellenar: false },
  { href: "/perfil", etiqueta: "Perfil", icono: User, rellenar: true },
];
