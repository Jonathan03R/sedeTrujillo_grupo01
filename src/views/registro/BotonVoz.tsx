"use client";

import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { interpretarRespuestaVoz } from "@/controllers/interpretar-voz.action";
import type { Emocion, EmocionId, Intensidad } from "@/models/emocion.model";
import { PREGUNTA_REGISTRO } from "@/models/registro-emocional.model";
import { detenerVoz, escuchar, hablar, vozDisponible } from "./voz";

type Fase = "inactivo" | "hablando" | "escuchando" | "interpretando";

const TEXTO_FASE: Record<Fase, string> = {
  inactivo: "",
  hablando: "Te estoy leyendo…",
  escuchando: "Te escucho… habla ahora.",
  interpretando: "Entendiendo lo que dijiste…",
};

/** Cuántas veces seguidas se acepta no entender antes de pasar a la pantalla. */
const MAXIMO_FALLOS = 3;
const NEGATIVO = /\b(no|repite|repetir|otra vez|incorrecto|corrige|corregir)\b/i;
const AFIRMATIVO = /\b(s[ií]|claro|correcto|confirmo|confirmar|registra|registrar|dale|vale|ok|okey|exacto)\b/i;

interface BotonVozProps {
  emociones: readonly Emocion[];
  /** Marca en la pantalla lo que la IA entendió (lo que aún no se entendió llega como null). */
  onEntendido: (emocion: EmocionId | null, intensidad: Intensidad | null) => void;
  /** La persona confirmó con la voz: se registra. */
  onConfirmar: (emocion: EmocionId, intensidad: Intensidad) => void;
}

const sinSuscripcion = () => () => {};

/**
 * Botón de accesibilidad: lee la pregunta en voz alta, escucha la respuesta, la IA la traduce a una emoción y
 * una intensidad, la marca en pantalla y pide confirmación hablada antes de registrar. Es un complemento:
 * se puede seguir usando la pantalla con el teclado o el dedo.
 */
export function BotonVoz({ emociones, onEntendido, onConfirmar }: BotonVozProps) {
  const disponible = useSyncExternalStore(sinSuscripcion, vozDisponible, () => false);
  const [fase, setFase] = useState<Fase>("inactivo");
  const [escuchado, setEscuchado] = useState<string | null>(null);
  const cancelado = useRef(false);

  // Si la persona sale de la pantalla, se calla y deja de escuchar.
  useEffect(() => {
    const cancelar = cancelado;
    return () => {
      cancelar.current = true;
      detenerVoz();
    };
  }, []);

  const decir = async (texto: string) => {
    setFase("hablando");
    await hablar(texto);
  };
  const oir = async () => {
    setFase("escuchando");
    return escuchar();
  };

  function terminar() {
    setFase("inactivo");
  }

  async function conversar() {
    cancelado.current = false;
    setEscuchado(null);
    const lista = emociones.map((e) => e.etiqueta.toLowerCase()).join(", ");
    const etiquetaDe = (id: EmocionId) => emociones.find((e) => e.id === id)?.etiqueta.toLowerCase() ?? id;

    let emocion: EmocionId | null = null;
    let intensidad: Intensidad | null = null;
    let fallos = 0;

    await decir(`${PREGUNTA_REGISTRO} Puedes decir: ${lista}. Y dime qué tan intensa es, del 1 al 10.`);

    while (!cancelado.current) {
      if (emocion === null || intensidad === null) {
        const esperando = emocion === null && intensidad === null ? "ambas" : emocion === null ? "emocion" : "intensidad";
        const texto = await oir();
        if (cancelado.current) return terminar();

        if (!texto) {
          if (++fallos >= MAXIMO_FALLOS) {
            await decir("No logré escucharte. Puedes responder en la pantalla.");
            return terminar();
          }
          await decir("No te escuché bien. Inténtalo de nuevo.");
          continue;
        }

        setEscuchado(texto);
        setFase("interpretando");
        const respuesta = await interpretarRespuestaVoz(texto, esperando);
        if (cancelado.current) return terminar();
        if ("error" in respuesta) {
          await decir(`${respuesta.error} Puedes responder en la pantalla.`);
          return terminar();
        }

        const entendioAlgo = (respuesta.emocion !== null && emocion === null) || (respuesta.intensidad !== null && intensidad === null);
        emocion = respuesta.emocion ?? emocion;
        intensidad = respuesta.intensidad ?? intensidad;
        onEntendido(emocion, intensidad);

        if (emocion === null || intensidad === null) {
          if (!entendioAlgo && ++fallos >= MAXIMO_FALLOS) {
            await decir("No logré entenderte. Puedes responder en la pantalla.");
            return terminar();
          }
          await decir(emocion === null ? `No entendí la emoción. Puedes decir: ${lista}.` : "¿Qué tan intensa es, del 1 al 10?");
          continue;
        }
      }

      // Ya hay emoción e intensidad: se pide confirmación hablada antes de guardar nada.
      await decir(`Entendí ${etiquetaDe(emocion)}, nivel ${intensidad}. ¿Lo registro? Di sí o no.`);
      const respuesta = await oir();
      if (cancelado.current) return terminar();
      setEscuchado(respuesta);

      if (respuesta && NEGATIVO.test(respuesta)) {
        emocion = null;
        intensidad = null;
        fallos = 0;
        await decir("De acuerdo, empecemos de nuevo. ¿Qué emoción sientes y qué tan intensa es?");
        continue;
      }
      if (respuesta && AFIRMATIVO.test(respuesta)) {
        terminar();
        onConfirmar(emocion, intensidad);
        return;
      }
      if (++fallos >= MAXIMO_FALLOS) {
        await decir("Dejé tu respuesta marcada en la pantalla. Pulsa Registrar cuando quieras.");
        return terminar();
      }
      await decir("No te entendí. Di sí o no.");
    }
    terminar();
  }

  function alternar() {
    if (fase !== "inactivo") {
      cancelado.current = true;
      detenerVoz();
      terminar();
      return;
    }
    void conversar();
  }

  if (!disponible) {
    return (
      <p className="text-center text-xs text-slate-500">
        Para responder con la voz usa Chrome o Edge: tu navegador no la admite.
      </p>
    );
  }

  const activo = fase !== "inactivo";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={alternar}
        aria-pressed={activo}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          activo ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100" : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
        }`}
      >
        {activo ? <Square className="size-4 fill-current" aria-hidden="true" /> : <Mic className="size-4" aria-hidden="true" />}
        {activo ? "Detener" : "Escuchar y responder con voz"}
      </button>

      <div role="status" aria-live="polite" className="min-h-5 text-center text-xs text-slate-600">
        {TEXTO_FASE[fase]}
        {escuchado && <span className="block text-slate-500">Escuché: «{escuchado}»</span>}
      </div>

      {!activo && (
        <p className="text-center text-[11px] text-slate-400">
          Te lee la pregunta y escucha tu respuesta. Tu navegador procesa tu voz (en Chrome, con servicios de Google) y la IA de Pulso la
          interpreta.
        </p>
      )}
    </div>
  );
}
