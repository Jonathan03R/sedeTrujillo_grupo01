-- Catálogo estático de prueba · Pulso · Equipo 01
-- Lugares de Trujillo ligados a un gusto y videos ligados a una emoción. DATOS FICTICIOS / DE PRUEBA.
-- Los videos abren una búsqueda de YouTube (no se verificaron ids). Las coordenadas de la cancha vienen de
-- OpenStreetMap; la de la Plaza de Armas es aproximada.

begin;

create table if not exists lugares_trujillo (
  lugar_id     bigint generated always as identity primary key,
  gusto        text not null,
  nombre       text not null,
  descripcion  text not null,
  latitud      numeric(9,6) not null,
  longitud     numeric(9,6) not null,
  activo       boolean not null default true
);

create table if not exists videos_emociones (
  video_emocion_id  bigint generated always as identity primary key,
  emocion           text not null check (emocion in ('felicidad', 'tranquilidad', 'estres', 'tristeza', 'ansiedad')),
  titulo            text not null,
  canal             text not null,
  consulta          text not null,
  activo            boolean not null default true
);

alter table lugares_trujillo enable row level security;
alter table videos_emociones enable row level security;

insert into lugares_trujillo (gusto, nombre, descripcion, latitud, longitud)
select v.gusto, v.nombre, v.descripcion, v.lat, v.lon
from (values
  ('Básquet',  'Cancha de básquet (demo)',       'Cancha registrada en OpenStreetMap, zona centro de Trujillo.', -8.1200453, -79.0302388),
  ('Deportes', 'Cancha de básquet (demo)',       'Cancha registrada en OpenStreetMap, zona centro de Trujillo.', -8.1200453, -79.0302388),
  ('Deportes', 'Plaza de Armas (demo)',          'Espacio abierto para caminar despacio al aire libre.',          -8.1117,     -79.0288),
  ('Dibujar',  'Plaza de Armas (demo)',          'Espacio abierto y tranquilo para dibujar al aire libre.',       -8.1117,     -79.0288)
) as v(gusto, nombre, descripcion, lat, lon)
where not exists (select 1 from lugares_trujillo);

insert into videos_emociones (emocion, titulo, canal, consulta)
select v.emocion, v.titulo, v.canal, v.consulta
from (values
  ('felicidad',    'Canciones para un buen día (demo)',        'Canal de demostración (ficticio)', 'canciones para un buen día'),
  ('felicidad',    'Baile para celebrar (demo)',               'Canal de demostración (ficticio)', 'baile para celebrar'),
  ('tranquilidad', 'Sonidos de naturaleza para relajarse (demo)', 'Canal de demostración (ficticio)', 'sonidos de naturaleza relajarse'),
  ('tranquilidad', 'Estiramiento suave de cuello (demo)',      'Canal de demostración (ficticio)', 'estiramiento suave cuello'),
  ('estres',       'Respiración guiada para el estrés (demo)', 'Canal de demostración (ficticio)', 'respiración guiada estrés'),
  ('estres',       'Pausa de 5 minutos para soltar tensión (demo)', 'Canal de demostración (ficticio)', 'pausa 5 minutos relajarse'),
  ('tristeza',     'Cómo hablar de lo que sientes (demo)',     'Canal de demostración (ficticio)', 'cómo hablar de lo que sientes'),
  ('tristeza',     'Música para días tristes (demo)',          'Canal de demostración (ficticio)', 'música para días tristes'),
  ('ansiedad',     'Anclaje 5-4-3-2-1 guiado (demo)',          'Canal de demostración (ficticio)', 'anclaje 5 4 3 2 1 guiado'),
  ('ansiedad',     'Música suave para calmar la ansiedad (demo)', 'Canal de demostración (ficticio)', 'música suave para calmar la ansiedad')
) as v(emocion, titulo, canal, consulta)
where not exists (select 1 from videos_emociones);

commit;

notify pgrst, 'reload schema';
