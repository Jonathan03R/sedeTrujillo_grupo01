# Canvas del reto · Equipo Pulso · Reto 2

Hackathon de Salud Mental con IA · UCV

## Paso 1 · El reto

**Pregunta del reto:** ¿Cómo podemos utilizar la tecnología para ayudar a las personas a reconocer tempranamente cambios en su bienestar emocional antes de que se conviertan en una barrera para su vida académica, social o personal?

**¿Por qué elegimos este reto?**
Creemos firmemente que la prevención y la detección temprana en salud mental son más efectivas que la intervención reactiva ante una crisis. Buscamos actuar a tiempo, antes de que los problemas escalen y dejen consecuencias irreversibles.

**¿Qué parte del reto vamos a resolver?**
La detección temprana de cambios emocionales, la autorregulación de las emociones, el autocuidado mediante hábitos saludables y la gestión emocional para reconocer y comprender las emociones.

## Paso 2 · Persona usuaria

- **Nombre y edad:** Yoana Castillo García, 21 años (ficticia)
- **Su frase:** «Quiero sentirme mejor conmigo misma, aprender a manejar mis emociones y encontrar la calma incluso en los días más difíciles.»
- **Perfil:** Estudiante universitaria que combina sus estudios con responsabilidades personales. En ocasiones experimenta estrés, ansiedad y frustración por tareas, exámenes y falta de tiempo. Usa su celular diariamente y busca soluciones prácticas para cuidar su bienestar emocional.
- **Necesita:** Identificar sus emociones a tiempo, controlar el estrés, aprender técnicas de respiración y relajación, y recibir orientación accesible para prevenir el agotamiento emocional.
- **Le frustra:** Sentirse abrumada por sus responsabilidades, no saber cómo manejar sus emociones, acumular preocupaciones y no tener a quién acudir cuando necesita apoyo.
- **Le motiva:** Sentirse tranquila, mejorar su bienestar emocional, cumplir sus metas, desarrollar hábitos saludables y contar con una IA que le ayude a reconocer sus emociones y practicar estrategias de autorregulación.

## Paso 3 · El problema (POV)

- **Yo, como…** estudiante universitaria que experimenta estrés y cambios emocionales durante sus actividades académicas y personales.
- **Necesito…** reconocer a tiempo mis cambios emocionales y aprender a regular mis emociones para mantener mi bienestar.
- **Porque…** muchas veces no identifico las señales de estrés a tiempo ni sé cómo manejarlas antes de que afecten mis estudios, mis relaciones y mi vida personal.

**Insight:** Las personas no siempre reconocen que su bienestar emocional está cambiando hasta que el estrés comienza a afectar sus actividades diarias; necesitan aprender a escucharse y actuar a tiempo.

## Paso 4 · MVP: 3 pantallas y 1 flujo

1. **Pantalla 1 · Registro del estado emocional**
   - Opciones: tranquila, feliz, estresada, triste o ansiosa.
   - Escala de intensidad emocional del 1 al 5.
   - Botón «Registrar emoción».

2. **Pantalla 2 · Mi momento de calma**
   - Recomendaciones personalizadas mediante IA generativa.
   - Ejercicio guiado de respiración.
   - Técnicas breves de relajación y autorregulación.
   - Botón «Comenzar ejercicio».

3. **Pantalla 3 · Mi progreso emocional**
   - Historial de emociones registradas.
   - Gráfico de cambios emocionales.
   - Resumen de hábitos de autocuidado.
   - Recomendaciones para prevenir el estrés.

**Criterio de éxito:** Al menos el 80 % de los participantes logra completar el registro emocional y recibir una recomendación de autorregulación en menos de 2 minutos. Este criterio es medible durante la prueba del prototipo; el 80 % es una meta propuesta, no un resultado comprobado.

**Fuera del MVP (después):**
- Diagnóstico automático de trastornos mentales.
- Integración con historias clínicas.
- Monitoreo continuo mediante sensores o dispositivos portátiles.

## Paso 5 · Datos ficticios

**Tabla 1: `registro_emocional`**

| Columna | Descripción |
|---|---|
| `id` | Identificador del registro |
| `fecha_hora` | Fecha y hora del registro |
| `emocion` | Emoción seleccionada |
| `intensidad` | Nivel del 1 al 5 |
| `nivel_estres` | Nivel de estrés percibido |
| `emocion_despues` | Emoción después del ejercicio |

**Tabla 2 (opcional): `recomendacion_autocuidado`**

| Columna | Descripción |
|---|---|
| `id` | Identificador |
| `registro_id` | Registro emocional relacionado |
| `recomendacion` | Consejo generado por IA |
| `ejercicio` | Técnica sugerida |
| `completado` | Indica si realizó el ejercicio |

**Qué mostrar en la aplicación:**
- Un saludo y la pregunta «¿Cómo te sientes hoy?».
- Un selector de emociones y una escala de intensidad.
- Un indicador visual del estado emocional registrado.
- Una recomendación personalizada de IA y un ejercicio de autorregulación.
- Un resumen del progreso emocional semanal.

## Revisión antes de la Ronda 1

- [ ] Tenemos un reto elegido y una sola parte que resolver.
- [ ] La persona tiene nombre y sabemos qué le frustra.
- [ ] El problema está en una frase (Yo, como… necesito… porque…).
- [ ] El MVP son 3 pantallas y 1 flujo, con criterio de éxito.
- [ ] Anotamos lo que queda fuera del MVP.
- [ ] Tenemos tablas y filas de datos ficticios (nunca reales).
- [ ] Cumple las 3 reglas de oro: ficticio, apoya no diagnostica, deriva.

Mentor revisó: ______ · Hora: ______
