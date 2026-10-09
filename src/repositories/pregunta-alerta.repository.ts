import type { PreguntaAlerta } from "@/models/notificacion.model";
import type { TipoAnomalia } from "@/models/uso-telefono.model";
import { lanzarSiHayError, obtenerClienteServidor } from "@/lib/supabase/servidor";

// Tabla preguntas_alerta (ver db/alertas.sql). Solo filas con activo = true.
interface FilaPreguntaAlerta {
  pregunta_alerta_id: number;
  tipo_anomalia: TipoAnomalia;
  texto: string;
}

export async function listarPreguntasAlerta(): Promise<readonly PreguntaAlerta[]> {
  const { data, error } = await obtenerClienteServidor()
    .from("preguntas_alerta")
    .select("pregunta_alerta_id, tipo_anomalia, texto")
    .eq("activo", true)
    .order("pregunta_alerta_id", { ascending: true })
    .overrideTypes<FilaPreguntaAlerta[]>();

  lanzarSiHayError("listar preguntas de alerta", error);
  return (data ?? []).map((fila) => ({ id: fila.pregunta_alerta_id, tipo: fila.tipo_anomalia, texto: fila.texto }));
}
