import { connection } from "next/server";
import { esEmocionId, esValorEmocion, rutaIconoEmocion, type Emocion, type EmocionId } from "@/models/emocion.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";

// Tabla emociones (ver db/schema.sql): las opciones que la persona marca al registrarse.
// El ícono se amarra por el nombre (public/iconos/emociones/<nombre>.svg). Solo filas con activo = true.
interface FilaEmocion {
  nombre: string;
  etiqueta: string;
  valor: number;
}

export async function listarEmociones(): Promise<readonly Emocion[]> {
  await connection(); // el catálogo se puede editar en la base: leerlo en cada petición
  const { data, error } = await obtenerClienteServidor()
    .from("emociones")
    .select("nombre, etiqueta, valor")
    .eq("activo", true)
    .order("orden", { ascending: true })
    .overrideTypes<FilaEmocion[]>();

  lanzarSiHayError("listar emociones", error);

  // Descarta filas que la app no sabe pintar (sin ícono ni colores propios).
  return (data ?? []).flatMap((fila) =>
    esEmocionId(fila.nombre) && esValorEmocion(fila.valor)
      ? [{ id: fila.nombre, etiqueta: fila.etiqueta, icono: rutaIconoEmocion(fila.nombre), valor: fila.valor }]
      : [],
  );
}

/** Id de la emoción en el catálogo, o null si no existe o está inactiva. */
export async function buscarIdEmocionActiva(emocion: EmocionId): Promise<number | null> {
  const { data, error } = await obtenerClienteServidor()
    .from("emociones")
    .select("emocion_id")
    .eq("nombre", emocion)
    .eq("activo", true)
    .maybeSingle<{ emocion_id: number }>();

  lanzarSiHayError("buscar la emoción", error);
  return data?.emocion_id ?? null;
}
