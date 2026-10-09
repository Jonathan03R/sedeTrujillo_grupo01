// Voz del navegador (Web Speech API): leer en voz alta y escuchar. No instala nada: usa las voces y el
// micrófono del dispositivo. Reconocer voz funciona en Chrome y Edge; en otros navegadores no hay botón.
// En Chrome, el reconocimiento lo procesa Google: la pantalla se lo avisa a la persona.

interface ResultadoReconocimiento {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface Reconocedor {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((evento: ResultadoReconocimiento) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type ConstructorReconocedor = new () => Reconocedor;

const IDIOMA = "es-PE";
const ESPERA_ESCUCHA_MS = 12_000;
const ESPERA_VOCES_MS = 1_000;

function constructorReconocedor(): ConstructorReconocedor | null {
  const w = window as unknown as { SpeechRecognition?: ConstructorReconocedor; webkitSpeechRecognition?: ConstructorReconocedor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function vozDisponible(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && constructorReconocedor() !== null;
}

/** Las voces llegan de forma asíncrona la primera vez: se espera un momento a que carguen. */
function cargarVoces(): Promise<SpeechSynthesisVoice[]> {
  const sintesis = window.speechSynthesis;
  const ya = sintesis.getVoices();
  if (ya.length > 0) return Promise.resolve(ya);
  return new Promise((resolver) => {
    const terminar = () => resolver(sintesis.getVoices());
    sintesis.addEventListener("voiceschanged", terminar, { once: true });
    setTimeout(terminar, ESPERA_VOCES_MS);
  });
}

/** La mejor voz en español que tenga el dispositivo (prefiere las «naturales»); null si no hay ninguna. */
async function elegirVoz(): Promise<SpeechSynthesisVoice | null> {
  const puntaje = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online/i.test(v.name) ? 4 : 0) +
    (/google|microsoft/i.test(v.name) ? 2 : 0) +
    (/^es-(pe|mx|us|419|co|ar|cl)/i.test(v.lang) ? 1 : 0);
  const voces = (await cargarVoces()).filter((v) => v.lang.toLowerCase().startsWith("es"));
  return voces.sort((a, b) => puntaje(b) - puntaje(a))[0] ?? null;
}

let reconocedorActivo: Reconocedor | null = null;

/** Lee el texto en voz alta y termina cuando acaba de hablar. */
export async function hablar(texto: string): Promise<void> {
  const sintesis = window.speechSynthesis;
  sintesis.cancel();
  const voz = await elegirVoz();

  return new Promise((resolver) => {
    const frase = new SpeechSynthesisUtterance(texto);
    frase.lang = voz?.lang ?? IDIOMA;
    if (voz) frase.voice = voz;
    frase.rate = 0.95;
    // Red de seguridad: algunos navegadores no avisan cuando terminan de hablar.
    const seguridad = setTimeout(resolver, 30_000);
    const terminar = () => {
      clearTimeout(seguridad);
      resolver();
    };
    frase.onend = terminar;
    frase.onerror = terminar;
    sintesis.speak(frase);
  });
}

/** Escucha una respuesta. Devuelve el texto, o null si no se oyó nada, se negó el micrófono o se detuvo. */
export function escuchar(): Promise<string | null> {
  const Reconocimiento = constructorReconocedor();
  if (!Reconocimiento) return Promise.resolve(null);

  return new Promise((resolver) => {
    const reconocedor = new Reconocimiento();
    let texto: string | null = null;
    reconocedor.lang = IDIOMA;
    reconocedor.interimResults = false;
    reconocedor.continuous = false;
    reconocedor.maxAlternatives = 1;

    const limite = setTimeout(() => reconocedor.stop(), ESPERA_ESCUCHA_MS);
    reconocedor.onresult = (evento) => {
      texto = evento.results[0]?.[0]?.transcript?.trim() || null;
    };
    reconocedor.onerror = () => {
      texto = null;
    };
    reconocedor.onend = () => {
      clearTimeout(limite);
      if (reconocedorActivo === reconocedor) reconocedorActivo = null;
      resolver(texto);
    };

    reconocedorActivo = reconocedor;
    try {
      reconocedor.start();
    } catch {
      clearTimeout(limite);
      resolver(null);
    }
  });
}

/** Corta lo que se esté leyendo o escuchando. */
export function detenerVoz(): void {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  reconocedorActivo?.abort();
  reconocedorActivo = null;
}
