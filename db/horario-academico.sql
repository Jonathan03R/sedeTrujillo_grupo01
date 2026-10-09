-- Horario académico de la persona y pregunta de seguimiento elegida por la IA · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Es seguro repetirlo.
--
-- La persona estudia: tiene clases ciertos días y horas (algunas de noche), exámenes y tareas por entregar.
-- El análisis interno de la IA cruza ese horario con el uso del teléfono y elige UNA pregunta de la tabla
-- preguntas (por ejemplo «¿Cómo dormiste anoche?») según lo que encontró. La persona la responde con un
-- emoji (tabla respuestas). Todo se ve en el Perfil. Los datos son FICTICIOS.

begin;

-- Clases de la semana. dia_semana: 1 = lunes ... 7 = domingo.
create table if not exists horarios_clases (
  horario_clase_id  bigint generated always as identity primary key,
  usuario_id        bigint not null references usuarios (usuario_id),
  curso             text not null,
  dia_semana        smallint not null check (dia_semana between 1 and 7),
  hora_inicio       time not null,
  hora_fin          time not null,
  activo            boolean not null default true,
  check (hora_fin > hora_inicio)
);

-- Exámenes y tareas por entregar
create table if not exists evaluaciones (
  evaluacion_id  bigint generated always as identity primary key,
  usuario_id     bigint not null references usuarios (usuario_id),
  tipo           text not null check (tipo in ('examen', 'tarea')),
  curso          text not null,
  titulo         text not null,
  fecha          date not null,
  activo         boolean not null default true
);

create index if not exists horarios_clases_usuario_idx on horarios_clases (usuario_id, dia_semana);
create index if not exists evaluaciones_usuario_fecha_idx on evaluaciones (usuario_id, fecha);

-- La pregunta (de la tabla preguntas) que la IA eligió en ese análisis y por qué
alter table analisis_uso_telefono add column if not exists pregunta_id bigint references preguntas (pregunta_id);
alter table analisis_uso_telefono add column if not exists motivo_pregunta text;

alter table horarios_clases enable row level security;
alter table evaluaciones    enable row level security;

commit;

notify pgrst, 'reload schema';
