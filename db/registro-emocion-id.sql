-- Migración: el registro emocional guarda la emoción del catálogo (emocion_id) · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Ejecutar después de db/emociones.sql.
-- Es seguro repetirlo.
--
-- La pantalla de entrada hace siempre la misma pregunta, «¿Qué emoción sientes?», y sus posibles
-- respuestas son las emociones de la tabla emociones. Cada registro queda ligado a esa fila para el
-- análisis de la IA. La pregunta del día (preguntas/respuestas) es otro análisis y no se toca.

begin;

alter table registros_emocionales add column if not exists emocion_id         bigint references emociones (emocion_id);
alter table registros_emocionales add column if not exists emocion_despues_id bigint references emociones (emocion_id);

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'registros_emocionales' and column_name = 'emocion') then
    update registros_emocionales r set emocion_id = e.emocion_id
    from emociones e where e.nombre = r.emocion and r.emocion_id is null;

    update registros_emocionales r set emocion_despues_id = e.emocion_id
    from emociones e where e.nombre = r.emocion_despues and r.emocion_despues_id is null;
  end if;
end $$;

alter table registros_emocionales alter column emocion_id set not null;
create index if not exists registros_emocionales_emocion_id_idx on registros_emocionales (emocion_id);

-- La vista deja de leer la columna de texto antes de borrarla
-- Aproximación sin diagnosticar: nivel de atención por usuario en una ventana de 7 días.
-- Los umbrales son heurísticos y deben validarse con un profesional de salud mental.
create or replace view vista_atencion_usuarios with (security_invoker = true) as
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
    and re.intensidad >= 4
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

alter table registros_emocionales drop column if exists emocion;
alter table registros_emocionales drop column if exists emocion_despues;

commit;

notify pgrst, 'reload schema';
