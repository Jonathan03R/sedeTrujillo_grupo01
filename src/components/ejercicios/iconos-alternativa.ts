import {
  Dumbbell,
  Flower2,
  Footprints,
  Gamepad2,
  Heart,
  MessageCircle,
  Moon,
  Music,
  NotebookPen,
  Palette,
  Trees,
  type LucideIcon,
} from "lucide-react";
import type { IconoAlternativa } from "@/models/autocuidado.model";

export const ICONO_POR_ALTERNATIVA: Record<IconoAlternativa, LucideIcon> = {
  relajacion: Flower2,
  musica: Music,
  ideas: Heart,
  escribir: NotebookPen,
  deporte: Dumbbell,
  caminar: Footprints,
  arte: Palette,
  amistad: MessageCircle,
  naturaleza: Trees,
  juego: Gamepad2,
  descanso: Moon,
};

/** Colores pastel que se reparten entre las ideas, en orden. */
export const COLORES_ALTERNATIVA: readonly string[] = [
  "bg-violet-50 text-violet-600",
  "bg-rose-50 text-rose-500",
  "bg-emerald-50 text-emerald-600",
  "bg-orange-50 text-orange-500",
];
