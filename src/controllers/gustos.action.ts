"use server";

import { refresh } from "next/cache";
import { limpiarGusto } from "@/models/gusto.model";
import { agregarGusto as guardarGusto, quitarGusto as borrarGusto } from "@/repositories/gusto.repository";

// Server Actions: se pueden invocar con un POST directo, por eso validan todo lo que reciben.
// TODO: verificar la sesión del usuario cuando exista autenticación.
export type ErrorGusto = { error: string } | undefined;

export async function agregarGusto(texto: unknown): Promise<ErrorGusto> {
  const limpio = limpiarGusto(texto);
  if (!limpio) return { error: "Escribe entre 2 y 40 letras o números, sin símbolos raros." };

  try {
    const resultado = await guardarGusto(limpio);
    if (resultado === "repetido") return { error: "Ya lo tienes en tu lista." };
    if (resultado === "limite") return { error: "Llegaste al máximo de gustos. Quita alguno para agregar otro." };
  } catch (error) {
    console.error(error); // el detalle queda en el servidor; a la persona se le muestra un mensaje simple
    return { error: "No pudimos guardar tu gusto. Inténtalo de nuevo en un momento." };
  }

  refresh();
}

export async function quitarGusto(gustoId: unknown): Promise<ErrorGusto> {
  if (typeof gustoId !== "number" || !Number.isInteger(gustoId) || gustoId <= 0) {
    return { error: "No pudimos quitar ese gusto." };
  }

  try {
    await borrarGusto(gustoId);
  } catch (error) {
    console.error(error);
    return { error: "No pudimos quitar tu gusto. Inténtalo de nuevo en un momento." };
  }

  refresh();
}
