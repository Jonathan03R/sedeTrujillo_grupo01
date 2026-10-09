-- Datos de demostración (FICTICIOS): una semana de uso del teléfono de Yoana.
-- Ejecutar después de db/uso-telefono.sql y db/seed-demo.sql.
--
-- La semana son los 7 días anteriores a hoy (hora de Lima), así que se puede volver a
-- ejecutar cualquier día: desactiva la semana anterior (borrado lógico) y siembra una nueva.
--
-- Rutina base (todos los días): mensajes al despertar, música de camino, clases,
-- redes al almuerzo, estudio por la tarde, YouTube/Netflix de noche, dormir ~23:15.
--
-- Anomalías sembradas a propósito (columna anomalia_simulada), cada vez más marcadas:
--   hace 4 días  uso_nocturno        TikTok e Instagram entre la 1:40 y las 3:35
--   hace 3 días  pico_uso            2 h 30 de TikTok en la tarde; no abre Classroom, Notion ni Duolingo
--   hace 2 días  revision_frecuente  abre Instagram/WhatsApp cada ~15 min (1-2 min cada vez) + desvelo
--   hace 1 día   menos_contacto      no abre WhatsApp en todo el día; maratón de Netflix y desvelo

begin;

-- Borrado lógico de la semana sembrada antes
update sesiones_telefono s
set activo = false
from usuarios u
where u.alias = 'Yoana' and s.usuario_id = u.usuario_id and s.activo;

with
yoana as (
  select usuario_id from usuarios where alias = 'Yoana' and activo
),
hoy as (
  select (now() at time zone 'America/Lima')::date as fecha
),
rutina (orden, hora, app, minuto) as (
  values
    (1,  '07:05', 'WhatsApp',          8),
    (2,  '07:30', 'Spotify',          25),
    (3,  '10:15', 'Google Classroom', 20),
    (4,  '13:10', 'Instagram',        18),
    (5,  '13:35', 'TikTok',           15),
    (6,  '16:00', 'Notion',           35),
    (7,  '16:45', 'Duolingo',         10),
    (8,  '19:20', 'WhatsApp',         15),
    (9,  '20:00', 'YouTube',          25),
    (10, '22:00', 'Netflix',          40),
    (11, '23:00', 'Instagram',        10)
),
base as (
  -- La rutina se repite 7 días con una variación pequeña (±4 min) para que no sea idéntica
  select d.dias_atras, r.hora, r.app,
         greatest(r.minuto + ((d.dias_atras * 7 + r.orden * 3) % 9) - 4, 1) as minuto,
         null::text as anomalia
  from generate_series(1, 7) as d(dias_atras)
  cross join rutina r
  where not (d.dias_atras = 3 and r.app in ('Google Classroom', 'Notion', 'Duolingo')) -- abandona el estudio
    and not (d.dias_atras = 1 and r.app = 'WhatsApp')                                   -- deja de escribir
    and not (d.dias_atras = 1 and r.app = 'Netflix')                                    -- reemplazado por la maratón
),
anomalias (dias_atras, hora, app, minuto, anomalia) as (
  values
    (4, '01:40', 'TikTok',    75,  'uso_nocturno'),
    (4, '03:00', 'Instagram', 35,  'uso_nocturno'),
    (3, '14:00', 'TikTok',    150, 'pico_uso'),
    (3, '17:00', 'Instagram', 45,  'pico_uso'),
    (2, '00:50', 'TikTok',    90,  'uso_nocturno'),
    (1, '21:30', 'Netflix',   190, 'menos_contacto'),
    (1, '02:10', 'YouTube',   80,  'uso_nocturno')
),
revisiones as (
  -- Hace 2 días: abre Instagram o WhatsApp cada ~15 min de 9:00 a 21:00, apenas 1-2 min cada vez
  select 2 as dias_atras,
         to_char(time '09:00' + n * interval '15 minutes' + (n % 4) * interval '2 minutes', 'HH24:MI') as hora,
         case when n % 2 = 0 then 'Instagram' else 'WhatsApp' end as app,
         1 + n % 2 as minuto,
         'revision_frecuente' as anomalia
  from generate_series(0, 47) as n
),
todas as (
  select dias_atras, hora, app, minuto, anomalia from base
  union all select dias_atras, hora, app, minuto, anomalia from anomalias
  union all select dias_atras, hora, app, minuto, anomalia from revisiones
)
insert into sesiones_telefono (usuario_id, aplicacion_id, inicio, minuto, anomalia_simulada)
select y.usuario_id,
       a.aplicacion_id,
       ((h.fecha - t.dias_atras) + t.hora::time) at time zone 'America/Lima',
       t.minuto,
       t.anomalia
from todas t
cross join yoana y
cross join hoy h
join aplicaciones a on a.nombre = t.app and a.activo;

-- Resumen diario por app (tabla usos_aplicaciones, la que usa vista_resumen_por_aplicaciones)
insert into usos_aplicaciones (usuario_id, aplicacion_id, fecha, minuto, apertura)
select s.usuario_id,
       s.aplicacion_id,
       (s.inicio at time zone 'America/Lima')::date,
       sum(s.minuto),
       count(*)
from sesiones_telefono s
join usuarios u on u.usuario_id = s.usuario_id
where u.alias = 'Yoana' and s.activo
group by 1, 2, 3
on conflict (usuario_id, aplicacion_id, fecha)
do update set minuto = excluded.minuto, apertura = excluded.apertura, activo = true;

commit;
