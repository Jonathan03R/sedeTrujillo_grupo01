import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Cliente de la API de Claude. La llave es secreta: solo en el servidor y nunca con prefijo NEXT_PUBLIC_.
// `server-only` hace fallar el build si algún componente de cliente lo importa.
export const MODELO_IA = "claude-opus-5-5";

let cliente: Anthropic | undefined;

export function obtenerClienteIA(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Falta la variable de entorno ANTHROPIC_API_KEY. Revisa tu archivo .env (ver .env.example).");
  cliente ??= new Anthropic({ apiKey });
  return cliente;
}
