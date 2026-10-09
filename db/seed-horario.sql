-- Datos de demostración (FICTICIOS): el horario de Yoana como estudiante.
-- Ejecutar después de db/horario-academico.sql y db/seed-demo.sql.
--
-- Las clases son semanales. Los exámenes y tareas se calculan a partir de HOY (hora de Lima), así que se puede
-- volver a ejecutar cualquier día: desactiva lo anterior (borrado lógico) y siembra de nuevo.

begin;

update horarios_clases h set activo = false from usuarios u where u.alias = 'Yoana' and h.usuario_id = u.usuario_id and h.activo;
update evaluaciones e set activo = false from usuarios u where u.alias = 'Yoana' and e.usuario_id = u.usuario_id and e.activo;

insert into horarios_clases (usuario_id, curso, dia_semana, hora_inicio, hora_fin)
select u.usuario_id, v.curso, v.dia, v.inicio::time, v.fin::time
from usuarios u
cross join (values
  ('Algoritmos',                1, '08:00', '10:00'),
  ('Base de Datos',             1, '14:00', '16:00'),
  ('Ingeniería de Software',    2, '19:00', '22:00'),  -- clase de noche
  ('Cálculo II',                3, '10:00', '12:00'),
  ('Redes de Computadoras',     3, '18:30', '21:30'),  -- clase de noche
  ('Inteligencia Artificial',   4, '19:00', '22:00'),  -- clase de noche
  ('Inglés',                    5, '08:00', '10:00')
) as v(curso, dia, inicio, fin)
where u.alias = 'Yoana';

insert into evaluaciones (usuario_id, tipo, curso, titulo, fecha)
select u.usuario_id, v.tipo, v.curso, v.titulo, (now() at time zone 'America/Lima')::date + v.dias
from usuarios u
cross join (values
  ('tarea',  'Inglés',                  'Ensayo sobre tecnología',         1),
  ('tarea',  'Redes de Computadoras',   'Informe de laboratorio',          2),
  ('examen', 'Base de Datos',           'Examen parcial',                  3),
  ('tarea',  'Ingeniería de Software',  'Entrega 1 del proyecto',          5),
  ('examen', 'Cálculo II',              'Examen parcial',                  9)
) as v(tipo, curso, titulo, dias)
where u.alias = 'Yoana';

commit;
