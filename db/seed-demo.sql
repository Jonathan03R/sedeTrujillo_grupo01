-- Datos de demostración (FICTICIOS): la persona del canvas y su historial emocional.
-- Idempotente: no duplica el usuario ni vuelve a insertar el historial si ya existe.
-- El alias es el nombre que se muestra en la app (la tabla usuarios no guarda nombres reales).

insert into usuarios (alias, edad) values ('Yoana', 21)
on conflict (alias) do nothing;

insert into registros_emocionales (usuario_id, emocion_id, intensidad, registrado_en)
select u.usuario_id, e.emocion_id, v.intensidad, v.registrado_en::timestamptz
from usuarios u
cross join (values
  ('estres',       8, '2026-09-14T20:10:00-05:00'),
  ('ansiedad',     6, '2026-09-16T09:00:00-05:00'),
  ('tristeza',     6, '2026-09-19T19:30:00-05:00'),
  ('estres',       8, '2026-09-22T08:45:00-05:00'),
  ('ansiedad',     8, '2026-09-24T21:15:00-05:00'),
  ('estres',       8, '2026-09-26T10:00:00-05:00'),
  ('ansiedad',     8, '2026-09-28T22:00:00-05:00'),
  ('estres',       6, '2026-09-30T13:20:00-05:00'),
  ('tristeza',     4, '2026-10-02T19:00:00-05:00'),
  ('estres',       8, '2026-10-03T08:40:00-05:00'),
  ('ansiedad',     6, '2026-10-04T21:00:00-05:00'),
  ('estres',      10, '2026-10-05T09:15:00-05:00'),
  ('tristeza',     4, '2026-10-06T18:30:00-05:00'),
  ('tranquilidad', 6, '2026-10-07T12:00:00-05:00'),
  ('estres',      10, '2026-10-08T20:15:00-05:00'),
  ('tranquilidad', 4, '2026-10-09T10:30:00-05:00')
) as v(emocion, intensidad, registrado_en)
join emociones e on e.nombre = v.emocion
where u.alias = 'Yoana'
  and not exists (select 1 from registros_emocionales r where r.usuario_id = u.usuario_id);

-- Gustos de Yoana (FICTICIOS). Se ven y editan en el Perfil; la IA los usa para personalizar el autocuidado.
insert into gustos (usuario_id, texto)
select u.usuario_id, g.texto
from usuarios u
cross join (values ('Básquet'), ('Deportes'), ('Música'), ('Dibujar')) as g(texto)
where u.alias = 'Yoana'
  and not exists (select 1 from gustos x where x.usuario_id = u.usuario_id and lower(x.texto) = lower(g.texto) and x.activo);
