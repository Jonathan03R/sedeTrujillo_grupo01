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
- Flujo de entrada: la primera pantalla siempre es `/registro` (sin menú). `src/proxy.ts` consulta la BASE DE DATOS (no una cookie): si la persona no tiene un registro emocional activo de las últimas 4 h (`lib/checkin.ts`), redirige cualquier ruta de la app a `/registro`; sin respuestas, la pregunta inicial siempre aparece. Al registrar, la acción `registrar-emocion.action.ts` guarda y redirige a `/inicio` (con menú). No mostrar en la UI que el registro es «obligatorio».
- `lib/`: utilidades puras (por ejemplo `fechas.ts`). No leen el reloj: con Cache Components, `Date.now()`/`new Date()` en el render rompe el prerenderizado.
- Datos que cambian por petición (como los registros emocionales): el repositorio llama `await connection()` y la página envuelve el contenido en `<Suspense fallback={<CargandoPantalla />}>`.
- Los colores por emoción viven en `components/emociones/tonos-emocion.ts`; no repetirlos en cada componente.
- Qué recibe la persona lo dicta la tabla `recomendaciones_ejercicios` (`db/recomendaciones-ejercicios.sql`): por cada emoción del catálogo `emociones` hay 3 franjas de intensidad (1-4, 5-7, 8-10), cada una con su recomendación y su ejercicio, todos distintos; `ejercicio` es el id del catálogo de código (`repositories/ejercicio.repository.ts`) y es null en las franjas que solo llevan recomendación (felicidad 8-10). `plan-autocuidado.repository.ts` la lee; la IA solo personaliza el mensaje (no cambia el ejercicio) y, si no pudo, se muestra la recomendación base. Al añadir una emoción o un ejercicio, añadir sus franjas en la tabla.
- Autocuidado personalizado (IA en tiempo real): los gustos de la persona viven en la tabla `gustos` (`db/gustos-autocuidado.sql`, se ven y editan en el Perfil con `MisGustos`; el texto se valida con `limpiarGusto` porque viaja a la IA como dato). Al registrar la emoción, `registrar-emocion.action.ts` espera a `autocuidado.controller.ts`, que manda a Claude la emoción, la intensidad (1–10), la hora, los gustos y el último análisis de uso; la IA elige un ejercicio del catálogo y arma 4 ideas («También puedes…», iconos en `iconos-alternativa.ts`). Se guarda en `recomendaciones_autocuidado` (con `alternativas` jsonb) ligado al registro. Si la IA falla o tarda más de 45 s, Inicio y Ejercicios usan la recomendación fija de `recomendacion.controller.ts`. Regla: con intensidad alta la IA propone solo actividades suaves. La IA además puede llamar herramientas (`controllers/herramientas-autocuidado.ts`, ciclo de hasta 3 vueltas): `buscar_lugares_cercanos` (OpenStreetMap/Overpass, sin llave, `repositories/lugar.repository.ts`; la ubicación la pide el navegador con permiso al registrar (`pedirUbicacion` en `FormularioRegistro`, validada y redondeada con `limpiarUbicacion`, solo se usa para buscar y NO se guarda); sin permiso se usa la ficticia `UBICACION_DEMO` = Trujillo (`models/ubicacion.model.ts`)) y `buscar_videos` (YouTube Data API v3, `repositories/video.repository.ts`; solo se ofrece si existe `YOUTUBE_API_KEY`, secreta y solo servidor). La IA solo puede elegir ids que aparecieron de verdad en los resultados; el lugar y el video se guardan en `recomendaciones_autocuidado.lugar/video` y se muestran en Inicio (`TarjetaLugar`, `TarjetaVideo`); los enlaces se arman con coordenadas e id de video, nunca con texto de la IA.
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
