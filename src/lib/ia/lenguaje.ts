// Red de seguridad para la regla de oro 2 (la app no diagnostica): si un texto de la IA nombra un
// trastorno o una condición clínica, no se guarda ni se muestra. Complementa las instrucciones a la IA.
const LENGUAJE_CLINICO = /trastorno|depresi[oó]n|adicci[oó]n|insomnio|ludopat|tdah|diagn[oó]stic/i;

export function contieneLenguajeClinico(textos: readonly string[]): boolean {
  return textos.some((texto) => LENGUAJE_CLINICO.test(texto));
}

/** El texto sin espacios de más, o null si está vacío o pasa del largo permitido. */
export function textoValido(valor: unknown, maximo: number): string | null {
  return typeof valor === "string" && valor.trim().length > 0 && valor.trim().length <= maximo ? valor.trim() : null;
}
