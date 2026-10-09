-- Funciones de la pregunta diaria · Pulso · Equipo 01
-- Todas las fechas se calculan en hora de Lima (UTC-5), igual que src/lib/fechas.ts.
-- Ejecutar después de db/schema.sql y db/seed.sql.
-- Los datos que generan son FICTICIOS.

begin;

-- Devuelve la pregunta del día para un usuario.
-- La pregunta se elige de forma determinista: cambia cada día y se repite en ciclo.
-- respondida = true si el usuario ya contestó esa pregunta hoy (hora de Lima).
create or replace function obtener_pregunta_del_dia(
  p_usuario_id bigint,
  p_fecha date default (now() at time zone 'America/Lima')::date
)
returns table (
  pregunta_id bigint,
  texto       text,
  respondida  boolean
)
language sql
stable
as $$
  with preguntas_activas as (
    select
      p.pregunta_id,
      p.texto,
      row_number() over (order by p.pregunta_id) - 1 as posicion,
      count(*) over () as total
    from preguntas p
    where p.activo
  ),
  elegida as (
    select pa.*
    from preguntas_activas pa
    where pa.posicion = mod(p_fecha - date '2026-01-01', pa.total)
  )
  select
    e.pregunta_id,
    e.texto,
    exists (
      select 1
      from respuestas r
      where r.usuario_id = p_usuario_id
        and r.pregunta_id = e.pregunta_id
        and r.activo
        and (r.respondido_en at time zone 'America/Lima')::date = p_fecha
    ) as respondida
  from elegida e;
$$;

-- Crea respuestas ficticias del usuario para los días anteriores a hoy.
-- No duplica: si un día ya tiene respuestas para ese usuario, lo omite.
-- Devuelve cuántas respuestas nuevas insertó.
create or replace function generar_respuestas_ficticias(
  p_usuario_id bigint,
  p_dias integer default 14
)
returns integer
language plpgsql
as $$
declare
  v_hoy        date := (now() at time zone 'America/Lima')::date;
  v_dia        date;
  v_insertadas integer := 0;
  v_filas      integer;
begin
  for v_dia in
    select generate_series(v_hoy - p_dias, v_hoy - 1, interval '1 day')::date
  loop
    -- Omite los días que ya tienen respuestas de este usuario.
    continue when exists (
      select 1
      from respuestas r
      where r.usuario_id = p_usuario_id
        and r.activo
        and (r.respondido_en at time zone 'America/Lima')::date = v_dia
    );

    insert into respuestas (usuario_id, pregunta_id, emoji_id, aplicacion_id, respondido_en)
    select
      p_usuario_id,
      pregunta.pregunta_id,
      emoji.emoji_id,
      app.aplicacion_id,
      (v_dia + time '08:00' + random() * interval '12 hours') at time zone 'America/Lima'
    from (
      select p.pregunta_id
      from preguntas p
      where p.activo
      order by p.pregunta_id
      limit 1 offset mod(v_dia - date '2026-01-01', (select count(*) from preguntas where activo))
    ) pregunta
    cross join lateral (
      select e.emoji_id
      from emojis e
      where e.activo
      order by random()
      limit 1
    ) emoji
    left join lateral (
      select a.aplicacion_id
      from aplicaciones a
      where a.activo and random() < 0.7
      order by random()
      limit 1
    ) app on true;

    get diagnostics v_filas = row_count;
    v_insertadas := v_insertadas + v_filas;
  end loop;

  return v_insertadas;
end;
$$;

commit;

-- Datos ficticios: 14 días de respuestas para la persona de demostración (usuario_id 1, Yoana).
-- Ejecutar una vez tras db/seed-demo.sql. Es seguro repetirlo: no duplica días.
-- select generar_respuestas_ficticias(1, 14);
