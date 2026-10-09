-- Migración: el registro guarda solo la emoción y su intensidad del 1 al 10 · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Ejecutar después de
-- db/registro-emocion-id.sql. Es seguro repetirlo: solo reescala una vez.
--
-- «¿Qué tan intensa es?» pasa de 1-5 a 1-10. Los registros viejos se multiplican por 2
-- (1 -> 2, 5 -> 10) para conservar su lugar en la escala.
-- Se quitan nivel_estres y emocion_despues: la pantalla no los pregunta ni se calculan.

begin;

alter table registros_emocionales drop column if exists nivel_estres;
alter table registros_emocionales drop column if exists emocion_despues;
alter table registros_emocionales drop column if exists emocion_despues_id;

do $$
begin
  -- Solo si la restricción todavía es la de 1-5 (así una segunda ejecución no vuelve a duplicar)
  if exists (select 1 from pg_constraint
             where conname = 'registros_emocionales_intensidad_check'
               and pg_get_constraintdef(oid) like '%<= 5%') then
    alter table registros_emocionales drop constraint registros_emocionales_intensidad_check;
    update registros_emocionales set intensidad = intensidad * 2;
    alter table registros_emocionales
      add constraint registros_emocionales_intensidad_check check (intensidad between 1 and 10);
  end if;
end $$;

-- El umbral de «registro intenso» pasa de 4 (de 5) a 7 (de 10)
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

commit;

notify pgrst, 'reload schema';
