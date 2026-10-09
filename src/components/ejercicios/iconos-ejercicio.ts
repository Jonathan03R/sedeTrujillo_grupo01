import { Brain, Flower2, Wind, type LucideIcon } from "lucide-react";
import type { TipoEjercicio } from "@/models/ejercicio.model";

export const ICONO_POR_TIPO: Record<TipoEjercicio, LucideIcon> = {
  respiracion: Wind,
  relajacion: Flower2,
  autorregulacion: Brain,
};
