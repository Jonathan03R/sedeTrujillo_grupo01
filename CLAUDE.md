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
- `repositories/`: acceso a datos. Usuarios y registros emocionales leen/escriben en Supabase con `lib/supabase/servidor.ts` (llave `service_role`, solo servidor, protegido con `server-only`). Ejercicios y hábitos siguen siendo catálogos fijos en código. Las variables viven en `.env` (ignorado por git; plantilla en `.env.example`). Nunca poner `SUPABASE_SERVICE_ROLE_KEY` con prefijo `NEXT_PUBLIC_`.
- La persona de demostración es el usuario con alias `Yoana` (`db/seed-demo.sql`). La tabla `usuarios` solo guarda alias: el alias es el nombre visible.
- `controllers/`: validan, deciden y arman los datos de cada pantalla. `registro.controller.ts` es la Server Action (`"use server"`) y valida todo lo que recibe.
- `views/<pantalla>/`: la pantalla y sus piezas propias. Solo presentan; no consultan datos.
- `components/`: piezas reutilizables sin lógica de negocio (`ui/`, `layout/`, `emociones/`, `ejercicios/`).
- `app/(app)/`: rutas delgadas. Cada `page.tsx` solo llama a un controlador y pinta una vista.
- Flujo de entrada: la primera pantalla siempre es `/registro` (sin menú). `src/proxy.ts` redirige cualquier ruta de la app a `/registro` si falta la cookie de check-in (`lib/checkin.ts`, vale 4 h). Al registrar, la acción `registrar-emocion.action.ts` guarda, pone la cookie y redirige a `/inicio` (con menú). No mostrar en la UI que el registro es «obligatorio».
- `lib/`: utilidades puras (por ejemplo `fechas.ts`). No leen el reloj: con Cache Components, `Date.now()`/`new Date()` en el render rompe el prerenderizado.
- Datos que cambian por petición (como los registros emocionales): el repositorio llama `await connection()` y la página envuelve el contenido en `<Suspense fallback={<CargandoPantalla />}>`.
- Los colores por emoción viven en `components/emociones/tonos-emocion.ts`; no repetirlos en cada componente.
- Pantalla de entrada: la pregunta es fija (`PREGUNTA_REGISTRO`, «¿Qué emoción sientes?») y sus respuestas son las emociones de la tabla `emociones`; junto con «¿Qué tan intensa es?» (escala 1–10, `INTENSIDADES`) se guardan en `registros_emocionales` solo como `emocion_id` + `intensidad`, y la IA las usa en sus análisis. El `valor` de cada emoción (1–5, agradable/desagradable) es otra escala. La pregunta del día (`preguntas`/`respuestas`) es otro análisis y no se muestra en el registro.
- Uso del teléfono (`/uso`): el monitoreo en segundo plano se simula con `sesiones_telefono` (`db/uso-telefono.sql`, datos en `db/seed-uso-telefono.sql`, con anomalías sembradas en `anomalia_simulada`, que nunca se envía a la IA). El análisis con IA es INTERNO (sin botón): `registrar-emocion.action.ts` lo dispara con `after()` y `analisis-uso.controller.ts` manda la semana a Claude (`lib/ia/cliente.ts`, llave `ANTHROPIC_API_KEY` solo en servidor), valida la respuesta y la guarda en `analisis_uso_telefono` + `anomalias_uso_telefono`. Máximo uno por hora. Con cambios muy bruscos la IA marca `alerta_roja` y se crea una fila en `notificaciones` con una pregunta de `preguntas_alerta` (`db/alertas.sql`) elegida según el cambio; se muestra como `AlertaRoja` (rojo, con ícono) en Inicio y Uso y se responde con una emoción. `preguntas_alerta` es distinta de la pregunta del día (`preguntas`).
- Los íconos de emociones son SVG en `public/iconos/emociones/<id>.svg` (uno por `EmocionId`, ruta en `Emocion.icono`); la ilustración de bienvenida está en `public/ilustraciones/`. Mostrarlos con `IconoEmocion`/`AvatarEmocion`, no con emojis de texto. Al añadir una emoción: modelo, ícono SVG, tono, mensaje en `recomendacion.controller.ts` y las restricciones `check` de `db/schema.sql` (y en la base real).
- Nombres en español. Una responsabilidad por archivo; si una pieza se usa en dos pantallas, va a `components/`.

Convención de la base de datos ([db/schema.sql](db/schema.sql)):
- Tablas en plural y en español; columnas en singular.
- La llave primaria es `<singular_de_la_tabla>_id` (`preguntas` → `pregunta_id`); las llaves foráneas usan el mismo nombre.
- Borrado lógico: toda tabla tiene `activo boolean not null default true`. No se borran filas; se pone `activo = false` y las consultas filtran por `activo`.

Cómo aproximarse sin diagnosticar:
- La app detecta **señales** (`bienestar`, `cansancio`, `animo_bajo`, `activacion`, `irritabilidad`) y un **nivel de atención** (`bajo`, `medio`, `alto`), calculados en `vista_atencion_usuarios` ([db/schema.sql](db/schema.sql)).
- Nunca mostrar al usuario el nombre de un trastorno («tienes ansiedad», «depresión», etc.). Usar lenguaje como «notamos que últimamente te has sentido más inquieto» y, si el nivel es medio o alto, sugerir hablar con un profesional.
- Los umbrales son heurísticos y deben validarse con un profesional de salud mental.
