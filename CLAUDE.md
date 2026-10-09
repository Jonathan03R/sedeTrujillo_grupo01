# Equipo Pulso · Reto 2 · Hackathon de Salud Mental con IA (UCV)

El canvas completo del reto está en [docs/canvas-reto.md](docs/canvas-reto.md). Léelo antes de proponer cambios.

Resumen:
- Reto: ayudar a las personas a reconocer tempranamente cambios en su bienestar emocional.
- Persona: Yoana, 21 años, estudiante universitaria con estrés y ansiedad (ficticia).
- MVP: 3 pantallas (registro emocional, momento de calma, progreso emocional) y 1 flujo.
- Éxito: al menos 80 % de participantes completa el registro y recibe una recomendación en menos de 2 minutos (meta propuesta, no comprobada).

Reglas de oro del proyecto:
1. Los datos son ficticios; nunca usar datos reales de personas.
2. La app apoya la autorregulación; no diagnostica trastornos mentales.
3. Ante señales de riesgo, la app deriva a ayuda profesional.

Arquitectura web (Next.js 16 + Tailwind, MVC en `src/`). Leer `node_modules/next/dist/docs/` antes de usar APIs de Next (ver AGENTS.md):
- `models/`: tipos y reglas del dominio. Sin React ni acceso a datos.
- `repositories/`: acceso a datos. Hoy devuelven datos ficticios; se cambian por Supabase sin tocar el resto.
- `controllers/`: validan, deciden y arman los datos de cada pantalla. `registro.controller.ts` es la Server Action (`"use server"`) y valida todo lo que recibe.
- `views/<pantalla>/`: la pantalla y sus piezas propias. Solo presentan; no consultan datos.
- `components/`: piezas reutilizables sin lógica de negocio (`ui/`, `layout/`, `emociones/`, `ejercicios/`).
- `app/(app)/`: rutas delgadas. Cada `page.tsx` solo llama a un controlador y pinta una vista.
- `lib/`: utilidades puras (por ejemplo `fechas.ts`). No leen el reloj: con Cache Components, `Date.now()`/`new Date()` en el render rompe el prerenderizado.
- Datos que cambian por petición (como los registros emocionales): el repositorio llama `await connection()` y la página envuelve el contenido en `<Suspense fallback={<CargandoPantalla />}>`.
- Los colores por emoción viven en `components/emociones/tonos-emocion.ts`; no repetirlos en cada componente.
- Nombres en español. Una responsabilidad por archivo; si una pieza se usa en dos pantallas, va a `components/`.

Convención de la base de datos ([db/schema.sql](db/schema.sql)):
- Tablas en plural y en español; columnas en singular.
- La llave primaria es `<singular_de_la_tabla>_id` (`preguntas` → `pregunta_id`); las llaves foráneas usan el mismo nombre.
- Borrado lógico: toda tabla tiene `activo boolean not null default true`. No se borran filas; se pone `activo = false` y las consultas filtran por `activo`.

Cómo aproximarse sin diagnosticar:
- La app detecta **señales** (`bienestar`, `cansancio`, `animo_bajo`, `activacion`, `irritabilidad`) y un **nivel de atención** (`bajo`, `medio`, `alto`), calculados en `vista_atencion_usuarios` ([db/schema.sql](db/schema.sql)).
- Nunca mostrar al usuario el nombre de un trastorno («tienes ansiedad», «depresión», etc.). Usar lenguaje como «notamos que últimamente te has sentido más inquieto» y, si el nivel es medio o alto, sugerir hablar con un profesional.
- Los umbrales son heurísticos y deben validarse con un profesional de salud mental.
