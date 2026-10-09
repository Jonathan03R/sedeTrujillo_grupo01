-- Alertas y notificaciones de la detección temprana · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Ejecutar después de
-- db/uso-telefono.sql y db/emociones.sql. Es seguro repetirlo.
--
-- El análisis de la IA es interno (corre solo, sin botón). Si encuentra cambios muy bruscos en la
-- rutina marca alerta_roja y la app lanza UNA notificación con una pregunta del catálogo
-- preguntas_alerta, elegida según el cambio detectado (p. ej. se desveló -> pregunta sobre el sueño).
-- La persona responde eligiendo una emoción del catálogo emociones. No diagnostica.

begin;

alter table analisis_uso_telefono add column if not exists alerta_roja boolean not null default false;

-- Preguntas que la app puede lanzar según el tipo de cambio detectado.
-- Son otro catálogo que la pregunta del día (preguntas): no se mezclan.
create table if not exists preguntas_alerta (
  pregunta_alerta_id  bigint generated always as identity primary key,
  tipo_anomalia       text not null
                      check (tipo_anomalia in ('uso_nocturno', 'pico_uso', 'revision_frecuente',
                                               'menos_contacto', 'abandono_rutina', 'otro')),
  texto               text not null unique,
  activo              boolean not null default true
);

-- Notificación que recibe la persona cuando hay alerta roja
create table if not exists notificaciones (
  notificacion_id           bigint generated always as identity primary key,
  usuario_id                bigint not null references usuarios (usuario_id),
  analisis_uso_telefono_id  bigint not null references analisis_uso_telefono (analisis_uso_telefono_id),
  pregunta_alerta_id        bigint not null references preguntas_alerta (pregunta_alerta_id),
  mensaje                   text not null,
  respuesta_emocion_id      bigint references emociones (emocion_id),
  respondida_en             timestamptz,
  creado_en                 timestamptz not null default now(),
  activo                    boolean not null default true,
  check ((respuesta_emocion_id is null) = (respondida_en is null))
);

create index if not exists preguntas_alerta_tipo_idx            on preguntas_alerta (tipo_anomalia);
create index if not exists notificaciones_usuario_creado_idx    on notificaciones (usuario_id, creado_en);
create index if not exists notificaciones_analisis_idx          on notificaciones (analisis_uso_telefono_id);

alter table preguntas_alerta enable row level security;
alter table notificaciones   enable row level security;

insert into preguntas_alerta (tipo_anomalia, texto) values
  ('uso_nocturno',       'Últimamente has dormido más tarde de lo habitual. ¿Cómo te sientes hoy?'),
  ('uso_nocturno',       'Notamos que usaste el teléfono de madrugada. ¿Qué emoción te acompaña ahora?'),
  ('pico_uso',           'Pasaste bastante más tiempo en el teléfono que de costumbre. ¿Cómo te sientes en este momento?'),
  ('revision_frecuente', 'Has revisado el teléfono muchas veces seguidas. ¿Qué emoción sientes ahora?'),
  ('menos_contacto',     'Últimamente hablas menos con tus personas cercanas. ¿Cómo te sientes con eso?'),
  ('abandono_rutina',    'Tu rutina cambió estos días. ¿Cómo te estás sintiendo?'),
  ('otro',               'Notamos un cambio en tu rutina. ¿Cómo te sientes hoy?')
on conflict (texto) do nothing;

commit;

notify pgrst, 'reload schema';
