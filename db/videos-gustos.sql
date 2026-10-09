-- Videos de demostración según los gustos de la persona · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Es seguro repetirlo.
--
-- DATOS FICTICIOS. Cada fila liga un gusto (texto igual al de la tabla gustos) a un video de
-- demostración. El enlace NO es a un video concreto: abre una búsqueda de YouTube con la consulta,
-- así no dependemos de ids de video que no hemos verificado.

begin;

create table if not exists videos_gustos (
  video_gusto_id  bigint generated always as identity primary key,
  gusto           text not null,
  titulo          text not null,
  canal           text not null,
  consulta        text not null,
  activo          boolean not null default true
);

create index if not exists videos_gustos_gusto_idx on videos_gustos (lower(gusto));

alter table videos_gustos enable row level security;

-- Datos de demostración (FICTICIOS): se insertan solo si la tabla está vacía
insert into videos_gustos (gusto, titulo, canal, consulta)
select v.gusto, v.titulo, v.canal, v.consulta
from (values
  ('Básquet',  'Tiros libres para principiantes (demo)',        'Canal de demostración (ficticio)', 'tiros libres básquet principiantes'),
  ('Básquet',  'Estiramientos después de jugar (demo)',         'Canal de demostración (ficticio)', 'estiramientos después de básquet'),
  ('Deportes', 'Caminata suave de 10 minutos (demo)',           'Canal de demostración (ficticio)', 'caminata suave 10 minutos'),
  ('Deportes', 'Rutina de movilidad para el cuello (demo)',     'Canal de demostración (ficticio)', 'movilidad cuello rutina suave'),
  ('Música',   'Música relajante para estudiar (demo)',         'Canal de demostración (ficticio)', 'música relajante para estudiar'),
  ('Música',   'Piano tranquilo para respirar (demo)',          'Canal de demostración (ficticio)', 'piano tranquilo respirar'),
  ('Dibujar',  'Dibujo guiado para principiantes (demo)',       'Canal de demostración (ficticio)', 'dibujo guiado principiantes'),
  ('Dibujar',  'Acuarela relajante paso a paso (demo)',         'Canal de demostración (ficticio)', 'acuarela relajante paso a paso')
) as v(gusto, titulo, canal, consulta)
where not exists (select 1 from videos_gustos);

commit;

notify pgrst, 'reload schema';
