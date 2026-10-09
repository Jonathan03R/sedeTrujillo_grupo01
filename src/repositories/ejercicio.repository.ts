import type { Ejercicio } from "@/models/ejercicio.model";

// Catálogo fijo de ejercicios de autorregulación. Más adelante puede venir de la base de datos.
// QUÉ ejercicio recibe cada persona NO se decide aquí: lo dicta la tabla recomendaciones_ejercicios
// (emoción + franja de intensidad -> ejercicio), que referencia estos ids. Los pasos con «N segundos»
// en el texto duran ese tiempo en la sesión guiada; los demás duran 10 segundos.
// Son ejercicios de autocuidado, no tratamientos: la app apoya y no diagnostica.
const EJERCICIOS: readonly Ejercicio[] = [
  {
    id: "tres-respiraciones",
    titulo: "Tres respiraciones conscientes",
    descripcion: "Un minuto para bajar la tensión con una exhalación larga.",
    duracionMinutos: 1,
    tipo: "respiracion",
    fases: [
      { etiqueta: "Inhala", segundos: 4, accion: "inhalar" },
      { etiqueta: "Sostén", segundos: 2, accion: "sostener" },
      { etiqueta: "Exhala", segundos: 6, accion: "exhalar" },
    ],
  },
  {
    id: "caminata-consciente",
    titulo: "Caminata de atención",
    descripcion: "Camina despacio y fíjate en lo que sientes, ves y oyes.",
    duracionMinutos: 5,
    tipo: "autorregulacion",
    pasos: [
      "Camina despacio durante 60 segundos y siente cómo tus pies tocan el suelo.",
      "Durante 60 segundos, fíjate en 3 cosas que ves a tu alrededor.",
      "Durante 60 segundos, escucha los sonidos lejanos y los cercanos.",
      "Durante 60 segundos, suelta los hombros y respira hondo mientras caminas.",
      "Durante 60 segundos, camina aún más lento y termina con una respiración profunda.",
    ],
  },
  {
    id: "respiracion-cuadrada",
    titulo: "Respiración cuadrada",
    descripcion: "Inhala, sostén, exhala y sostén en tiempos iguales para bajar el ritmo.",
    duracionMinutos: 3,
    tipo: "respiracion",
    fases: [
      { etiqueta: "Inhala", segundos: 4, accion: "inhalar" },
      { etiqueta: "Sostén", segundos: 4, accion: "sostener" },
      { etiqueta: "Exhala", segundos: 4, accion: "exhalar" },
      { etiqueta: "Sostén", segundos: 4, accion: "sostener" },
    ],
  },
  {
    id: "relajacion-muscular",
    titulo: "Relajación muscular rápida",
    descripcion: "Tensa y suelta hombros, manos y mandíbula, uno por uno.",
    duracionMinutos: 5,
    tipo: "relajacion",
    pasos: [
      "Tensa los hombros 5 segundos y suéltalos.",
      "Aprieta las manos 5 segundos y suéltalas.",
      "Relaja la mandíbula y la frente.",
      "Respira lento tres veces.",
    ],
  },
  {
    id: "escribir-lo-que-sientes",
    titulo: "Escribe lo que sientes",
    descripcion: "Poner en palabras lo que pasa por tu mente ayuda a ordenarlo.",
    duracionMinutos: 2,
    tipo: "autorregulacion",
    pasos: [
      "Toma una hoja o abre tus notas y respira hondo una vez.",
      "Escribe durante 60 segundos lo que sientes, sin corregir nada.",
      "Escribe durante 30 segundos qué necesitas ahora mismo.",
      "Lee lo que escribiste y elige una cosa pequeña que puedas hacer hoy.",
    ],
  },
  {
    id: "respiracion-lenta",
    titulo: "Respiración lenta 4-7-8",
    descripcion: "Una exhalación larga ayuda al cuerpo a soltar la tensión.",
    duracionMinutos: 4,
    tipo: "respiracion",
    fases: [
      { etiqueta: "Inhala", segundos: 4, accion: "inhalar" },
      { etiqueta: "Sostén", segundos: 7, accion: "sostener" },
      { etiqueta: "Exhala", segundos: 8, accion: "exhalar" },
    ],
  },
  {
    id: "anclaje-5-4-3-2-1",
    titulo: "Anclaje 5-4-3-2-1",
    descripcion: "Nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas.",
    duracionMinutos: 3,
    tipo: "autorregulacion",
    pasos: [
      "Nombra 5 cosas que puedes ver.",
      "Nombra 4 cosas que puedes tocar.",
      "Nombra 3 sonidos que escuchas.",
      "Nombra 2 olores que percibes.",
      "Nombra 1 sabor que sientes.",
    ],
  },
  {
    id: "abrazo-mariposa",
    titulo: "Abrazo de mariposa",
    descripcion: "Un gesto con las manos que ayuda a calmar el cuerpo.",
    duracionMinutos: 2,
    tipo: "autorregulacion",
    pasos: [
      "Cruza los brazos sobre el pecho y apoya las manos cerca de los hombros.",
      "Durante 30 segundos, golpetea suave un hombro y luego el otro, al ritmo de tu respiración.",
      "Durante 30 segundos, respira lento y nota cómo se afloja tu pecho.",
      "Durante 30 segundos, repite en tu mente: «Estoy aquí y puedo ir poco a poco».",
    ],
  },
  {
    id: "contacto-cercano",
    titulo: "Escríbele a alguien de confianza",
    descripcion: "Compartir cómo estás puede aliviar más de lo que parece.",
    duracionMinutos: 3,
    tipo: "autorregulacion",
    pasos: [
      "Piensa en una persona con la que te sientas en confianza.",
      "Durante 60 segundos, escríbele un mensaje corto: «Hoy no estoy muy bien, ¿podemos hablar un rato?».",
      "Envíalo y respira hondo mientras esperas, sin presionarte.",
      "Si no responde pronto, puedes buscar a otra persona o al servicio de bienestar de tu universidad.",
    ],
  },
  {
    id: "pausa-gratitud",
    titulo: "Pausa de gratitud",
    descripcion: "Anota tres cosas pequeñas del día por las que te sientes agradecido.",
    duracionMinutos: 2,
    tipo: "autorregulacion",
    pasos: [
      "Respira profundo una vez.",
      "Piensa en tres cosas pequeñas del día que agradeces.",
      "Anótalas o dilas en voz alta.",
    ],
  },
  {
    id: "escaneo-corporal",
    titulo: "Escaneo corporal suave",
    descripcion: "Recorre tu cuerpo despacio y suelta lo que no necesitas.",
    duracionMinutos: 3,
    tipo: "relajacion",
    pasos: [
      "Siéntate en una posición cómoda y cierra los ojos si quieres.",
      "Durante 30 segundos, lleva tu atención a los pies y las piernas, y suéltalos.",
      "Durante 30 segundos, lleva tu atención al abdomen y al pecho, y suéltalos.",
      "Durante 30 segundos, relaja hombros, brazos y manos.",
      "Durante 30 segundos, relaja el cuello, la mandíbula y la cara.",
      "Respira hondo tres veces y abre los ojos cuando quieras.",
    ],
  },
  {
    id: "saborear-momento",
    titulo: "Saborea este momento",
    descripcion: "Detente un instante para notar lo bueno que sientes.",
    duracionMinutos: 2,
    tipo: "autorregulacion",
    pasos: [
      "Respira hondo y nota en qué parte del cuerpo sientes la alegría.",
      "Durante 30 segundos, fíjate en 3 detalles de este momento: lo que ves, oyes o tocas.",
      "Durante 30 segundos, sonríe y deja que el momento se quede un poco más.",
      "Piensa en una cosa que te gustaría repetir mañana.",
    ],
  },
  {
    id: "compartir-alegria",
    titulo: "Comparte tu alegría",
    descripcion: "Contarle a alguien cómo te sientes hace que el momento dure más.",
    duracionMinutos: 3,
    tipo: "autorregulacion",
    pasos: [
      "Piensa en alguien con quien te gustaría compartir cómo te sientes.",
      "Durante 60 segundos, escríbele o cuéntale qué te hizo sentir bien hoy.",
      "Pregúntale cómo está y escucha con calma.",
    ],
  },
  {
    id: "respiracion-ola",
    titulo: "Respiración de la ola",
    descripcion: "Inhala y exhala como una ola, sin prisa, para mantener la calma.",
    duracionMinutos: 3,
    tipo: "respiracion",
    fases: [
      { etiqueta: "Inhala", segundos: 5, accion: "inhalar" },
      { etiqueta: "Exhala", segundos: 5, accion: "exhalar" },
    ],
  },
];

export async function listarEjercicios(): Promise<readonly Ejercicio[]> {
  return EJERCICIOS;
}

/** El ejercicio con ese id, o null si no existe en el catálogo. */
export async function buscarEjercicio(id: string): Promise<Ejercicio | null> {
  return EJERCICIOS.find((e) => e.id === id) ?? null;
}
