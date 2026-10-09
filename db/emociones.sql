-- Migración: catálogo de emociones · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql y seed.sql ya lo incluyen).
-- Ejecutar una vez en Supabase > SQL Editor. Es seguro repetirlo.
-- nombre = clave de la emoción y nombre del ícono en public/iconos/emociones/<nombre>.svg.

begin;

create table if not exists emociones (
  emocion_id  bigint generated always as identity primary key,
  nombre      text not null unique
              check (nombre in ('tranquilidad', 'felicidad', 'estres', 'tristeza', 'ansiedad', 'otra')),
  etiqueta    text not null,
  valor       smallint not null check (valor between 1 and 5),
  orden       smallint not null default 0,
  activo      boolean not null default true
);

insert into emociones (nombre, etiqueta, valor, orden) values
  ('felicidad',    'Felicidad',    5, 1),
  ('tranquilidad', 'Tranquilidad', 4, 2),
  ('estres',       'Estrés',       2, 3),
  ('tristeza',     'Tristeza',     1, 4),
  ('ansiedad',     'Ansiedad',     1, 5),
  ('otra',         'Otra',         3, 6)
on conflict (nombre) do nothing;

-- Igual que el resto de tablas: solo se accede con la clave de servicio.
alter table emociones enable row level security;

commit;

-- Que la API de Supabase vea la tabla nueva sin esperar.
notify pgrst, 'reload schema';
