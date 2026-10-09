-- Esquema principal · Pulso · Equipo 01
--
-- Convención:
--   * Tablas en plural y en español.
--   * Columnas en singular. La llave primaria es <singular_de_la_tabla>_id
--     (preguntas -> pregunta_id) y las llaves foráneas conservan ese mismo nombre.
--   * Borrado lógico: toda tabla tiene `activo boolean not null default true`.
--     No se borran filas; se pone activo = false.
--
-- Todos los datos son ficticios. La app apoya, no diagnostica:
-- detecta señales y niveles de atención, nunca nombra trastornos.

begin;

-- Quién responde (anónimo: solo un alias, sin datos personales reales)
create table usuarios (
  usuario_id  bigint generated always as identity primary key,
  alias       text not null unique,
  edad        smallint check (edad between 13 and 100),
  creado_en   timestamptz not null default now(),
  activo      boolean not null default true
);

-- Catálogo de apps del teléfono que se observan
create table aplicaciones (
  aplicacion_id  bigint generated always as identity primary key,
  nombre         text not null unique,
  categoria      text not null default 'otro'
                 check (categoria in ('redes_sociales', 'mensajeria', 'entretenimiento',
                                      'productividad', 'educacion', 'juegos', 'salud', 'otro')),
  activo         boolean not null default true
);

-- Comportamiento: cuánto tiempo usa cada usuario cada app, por día
create table usos_aplicaciones (
  uso_aplicacion_id  bigint generated always as identity primary key,
  usuario_id         bigint not null references usuarios (usuario_id),
  aplicacion_id      bigint not null references aplicaciones (aplicacion_id),
  fecha              date not null default current_date,
  minuto             integer not null check (minuto >= 0),
  apertura           integer not null default 0 check (apertura >= 0),
  activo             boolean not null default true,
  unique (usuario_id, aplicacion_id, fecha)
);

-- Catálogo de emojis con los que se responde.
-- valor: 1 = muy negativo, 5 = muy positivo.
-- senal: categoría de señal asociada (no es un diagnóstico).
create table emojis (
  emoji_id  bigint generated always as identity primary key,
  simbolo   text not null unique,
  nombre    text not null,
  valor     smallint not null check (valor between 1 and 5),
  senal     text not null default 'neutral'
            check (senal in ('bienestar', 'neutral', 'cansancio', 'animo_bajo', 'activacion', 'irritabilidad')),
  activo    boolean not null default true
);

-- Catálogo de emociones de la pantalla de registro (canvas · pantalla 1).
-- nombre: clave de la emoción y nombre del ícono en public/iconos/emociones/<nombre>.svg.
-- valor: 1 = muy negativo, 5 = muy positivo. orden: posición en la pantalla.
create table emociones (
  emocion_id  bigint generated always as identity primary key,
  nombre      text not null unique
              check (nombre in ('tranquilidad', 'felicidad', 'estres', 'tristeza', 'ansiedad', 'otra')),
  etiqueta    text not null,
  valor       smallint not null check (valor between 1 and 5),
  orden       smallint not null default 0,
  activo      boolean not null default true
);

-- Preguntas que la app hace al usuario
create table preguntas (
  pregunta_id  bigint generated always as identity primary key,
  texto        text not null unique,
  creado_en    timestamptz not null default now(),
  activo       boolean not null default true
);

-- Respuestas con emoji (se guardan para el análisis).
-- aplicacion_id es opcional: liga la respuesta a la app que se estaba usando.
create table respuestas (
  respuesta_id   bigint generated always as identity primary key,
  usuario_id     bigint not null references usuarios (usuario_id),
  pregunta_id    bigint not null references preguntas (pregunta_id),
  emoji_id       bigint not null references emojis (emoji_id),
  aplicacion_id  bigint references aplicaciones (aplicacion_id),
  respondido_en  timestamptz not null default now(),
  activo         boolean not null default true
);

-- Canvas · Paso 5: registro del estado emocional (pantalla 1 del MVP).
-- Cada fila es la respuesta a la pregunta fija de la pantalla de entrada, «¿Qué emoción sientes?»:
-- la respuesta es una emoción del catálogo (emocion_id) y su intensidad del 1 al 10 («¿Qué tan intensa es?»).
-- Solo se guardan esas dos respuestas. La IA usa estas filas en sus análisis.
-- (La pregunta del día, tablas preguntas/respuestas, es otro análisis aparte.)
create table registros_emocionales (
  registro_emocional_id  bigint generated always as identity primary key,
  usuario_id             bigint not null references usuarios (usuario_id),
  emocion_id             bigint not null references emociones (emocion_id),
  intensidad             smallint not null check (intensidad between 1 and 10),
  registrado_en          timestamptz not null default now(),
  activo                 boolean not null default true
);

-- Canvas · Paso 5: recomendaciones de autocuidado generadas por IA (pantalla 2 del MVP)
create table recomendaciones_autocuidado (
  recomendacion_autocuidado_id  bigint generated always as identity primary key,
  registro_emocional_id         bigint not null references registros_emocionales (registro_emocional_id),
  recomendacion                 text not null,
  ejercicio                     text,
  completado                    boolean not null default false,
  creado_en                     timestamptz not null default now(),
  activo                        boolean not null default true
);

-- Monitoreo del teléfono en segundo plano: cada vez que la persona abre una app.
-- En el prototipo web los datos son ficticios (db/seed-uso-telefono.sql).
-- anomalia_simulada: solo demostración, anomalía sembrada a propósito (null = rutina normal); nunca se envía a la IA.
create table sesiones_telefono (
  sesion_telefono_id  bigint generated always as identity primary key,
  usuario_id          bigint not null references usuarios (usuario_id),
  aplicacion_id       bigint not null references aplicaciones (aplicacion_id),
  inicio              timestamptz not null,
  minuto              integer not null check (minuto between 0 and 1440),
  anomalia_simulada   text,
  activo              boolean not null default true
);

-- Análisis de la IA sobre una ventana de uso del teléfono (detección temprana, no diagnóstico)
create table analisis_uso_telefono (
  analisis_uso_telefono_id  bigint generated always as identity primary key,
  usuario_id                bigint not null references usuarios (usuario_id),
  desde                     timestamptz not null,
  hasta                     timestamptz not null,
  nivel_atencion            text not null check (nivel_atencion in ('bajo', 'medio', 'alto')),
  senal_predominante        text
                            check (senal_predominante in ('bienestar', 'cansancio', 'animo_bajo', 'activacion', 'irritabilidad')),
  resumen                   text not null,
  sugerencias               text[] not null default '{}',
  sugerir_profesional       boolean not null default false,
  -- Cambios muy bruscos en la rutina: la app muestra una alerta roja y lanza una notificación
  alerta_roja               boolean not null default false,
  modelo                    text not null,
  creado_en                 timestamptz not null default now(),
  activo                    boolean not null default true,
  check (hasta > desde)
);

-- Anomalías que la IA encontró en cada análisis
create table anomalias_uso_telefono (
  anomalia_uso_telefono_id  bigint generated always as identity primary key,
  analisis_uso_telefono_id  bigint not null references analisis_uso_telefono (analisis_uso_telefono_id),
  tipo                      text not null
                            check (tipo in ('uso_nocturno', 'pico_uso', 'revision_frecuente',
                                            'menos_contacto', 'abandono_rutina', 'otro')),
  fecha                     date not null,
  severidad                 text not null check (severidad in ('leve', 'moderada', 'alta')),
  descripcion               text not null,
  activo                    boolean not null default true
);

-- Preguntas que la app puede lanzar según el tipo de cambio detectado.
-- Son otro catálogo que la pregunta del día (preguntas): no se mezclan.
create table preguntas_alerta (
  pregunta_alerta_id  bigint generated always as identity primary key,
  tipo_anomalia       text not null
                      check (tipo_anomalia in ('uso_nocturno', 'pico_uso', 'revision_frecuente',
                                               'menos_contacto', 'abandono_rutina', 'otro')),
  texto               text not null unique,
  activo              boolean not null default true
);

-- Notificación que recibe la persona cuando hay alerta roja
create table notificaciones (
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

-- Índices para las consultas de análisis
create index on preguntas_alerta (tipo_anomalia);
create index on notificaciones (usuario_id, creado_en);
create index on notificaciones (analisis_uso_telefono_id);
create index on sesiones_telefono (usuario_id, inicio);
create index on sesiones_telefono (aplicacion_id);
create index on analisis_uso_telefono (usuario_id, creado_en);
create index on anomalias_uso_telefono (analisis_uso_telefono_id);
create index on usos_aplicaciones (usuario_id, fecha);
create index on usos_aplicaciones (aplicacion_id);
create index on respuestas (usuario_id, respondido_en);
create index on respuestas (pregunta_id);
create index on respuestas (emoji_id);
create index on respuestas (aplicacion_id);
create index on registros_emocionales (usuario_id, registrado_en);
create index on registros_emocionales (emocion_id);
create index on recomendaciones_autocuidado (registro_emocional_id);

-- Análisis: valor emocional promedio de las respuestas por app, junto con el tiempo de uso total.
-- Solo cuenta filas activas.
create view vista_resumen_por_aplicaciones with (security_invoker = true) as
select
  a.aplicacion_id,
  a.nombre,
  a.categoria,
  coalesce(r.total_respuesta, 0) as total_respuesta,
  r.valor_promedio,
  coalesce(u.total_minuto, 0)    as total_minuto
from aplicaciones a
left join (
  select r.aplicacion_id, count(*) as total_respuesta, round(avg(e.valor), 2) as valor_promedio
  from respuestas r
  join emojis e on e.emoji_id = r.emoji_id
  where r.activo
  group by r.aplicacion_id
) r on r.aplicacion_id = a.aplicacion_id
left join (
  select aplicacion_id, sum(minuto) as total_minuto
  from usos_aplicaciones
  where activo
  group by aplicacion_id
) u on u.aplicacion_id = a.aplicacion_id
where a.activo;

-- Aproximación sin diagnosticar: nivel de atención por usuario en una ventana de 7 días.
-- Los umbrales son heurísticos y deben validarse con un profesional de salud mental.
create view vista_atencion_usuarios with (security_invoker = true) as
with respuestas_recientes as (
  select
    r.usuario_id,
    count(*) filter (where r.respondido_en >= now() - interval '7 days')                               as total_respuesta,
    avg(e.valor) filter (where r.respondido_en >= now() - interval '7 days')                           as valor_promedio,
    avg(e.valor) filter (where r.respondido_en <  now() - interval '7 days'
                           and r.respondido_en >= now() - interval '14 days')                          as valor_promedio_previo,
    count(*) filter (where r.respondido_en >= now() - interval '7 days' and e.senal = 'animo_bajo')    as n_animo_bajo,
    count(*) filter (where r.respondido_en >= now() - interval '7 days' and e.senal = 'activacion')    as n_activacion,
    count(*) filter (where r.respondido_en >= now() - interval '7 days' and e.senal = 'irritabilidad') as n_irritabilidad,
    count(*) filter (where r.respondido_en >= now() - interval '7 days' and e.senal = 'cansancio')     as n_cansancio
  from respuestas r
  join emojis e on e.emoji_id = r.emoji_id
  where r.activo
  group by r.usuario_id
),
registros_recientes as (
  select re.usuario_id, count(*) as total_registro_intenso
  from registros_emocionales re
  join emociones em on em.emocion_id = re.emocion_id
  where re.activo
    and re.registrado_en >= now() - interval '7 days'
    and re.intensidad >= 7
    and em.nombre in ('estres', 'ansiedad', 'tristeza')
  group by re.usuario_id
)
select
  u.usuario_id,
  u.alias,
  coalesce(rr.total_respuesta, 0)                as total_respuesta,
  round(rr.valor_promedio, 2)                    as valor_promedio,
  round(rr.valor_promedio_previo, 2)             as valor_promedio_previo,
  coalesce(rg.total_registro_intenso, 0)         as total_registro_intenso,
  case
    when coalesce(rr.n_animo_bajo, 0) + coalesce(rr.n_activacion, 0)
       + coalesce(rr.n_irritabilidad, 0) + coalesce(rr.n_cansancio, 0) = 0 then null
    when rr.n_animo_bajo    = greatest(rr.n_animo_bajo, rr.n_activacion, rr.n_irritabilidad, rr.n_cansancio) then 'animo_bajo'
    when rr.n_activacion    = greatest(rr.n_animo_bajo, rr.n_activacion, rr.n_irritabilidad, rr.n_cansancio) then 'activacion'
    when rr.n_irritabilidad = greatest(rr.n_animo_bajo, rr.n_activacion, rr.n_irritabilidad, rr.n_cansancio) then 'irritabilidad'
    else 'cansancio'
  end as senal_predominante,
  case
    when coalesce(rr.total_respuesta, 0) < 5                                         then 'sin_datos'
    when rr.valor_promedio <= 2 or coalesce(rg.total_registro_intenso, 0) >= 4       then 'alto'
    when rr.valor_promedio <= 2.8
      or (rr.valor_promedio_previo is not null and rr.valor_promedio_previo - rr.valor_promedio >= 1)
      or coalesce(rg.total_registro_intenso, 0) >= 2                                 then 'medio'
    else 'bajo'
  end as nivel_atencion
from usuarios u
left join respuestas_recientes rr on rr.usuario_id = u.usuario_id
left join registros_recientes  rg on rg.usuario_id = u.usuario_id
where u.activo;

-- Supabase expone el esquema public por API: se activa RLS sin políticas,
-- así solo se accede con la clave de servicio / conexión directa.
alter table usuarios                    enable row level security;
alter table aplicaciones                enable row level security;
alter table usos_aplicaciones           enable row level security;
alter table emojis                      enable row level security;
alter table emociones                   enable row level security;
alter table preguntas                   enable row level security;
alter table respuestas                  enable row level security;
alter table registros_emocionales       enable row level security;
alter table recomendaciones_autocuidado enable row level security;
alter table sesiones_telefono           enable row level security;
alter table analisis_uso_telefono       enable row level security;
alter table anomalias_uso_telefono      enable row level security;
alter table preguntas_alerta            enable row level security;
alter table notificaciones              enable row level security;

commit;
