-- Rachas de constancia · Pulso · Equipo 01
-- Una racha son los días seguidos con al menos un registro emocional (hora de Lima).
-- Se calcula en la base con una función; el resultado se guarda en la tabla rachas.
-- Es seguro repetirlo.

begin;

create table if not exists rachas (
  racha_id       bigint generated always as identity primary key,
  usuario_id     bigint not null unique references usuarios (usuario_id),
  racha_actual   integer not null default 0 check (racha_actual >= 0),
  mejor_racha    integer not null default 0 check (mejor_racha >= 0),
  ultimo_dia     date,
  actualizado_en timestamptz not null default now(),
  activo         boolean not null default true
);

alter table rachas enable row level security;

-- Recalcula la racha actual y la mejor racha de la persona y la guarda.
-- La racha actual cuenta hacia atrás desde el último día con registro, si ese día es hoy o ayer.
create or replace function recalcular_racha(
  p_usuario bigint,
  p_hoy date default (now() at time zone 'America/Lima')::date
) returns void
language plpgsql
as $$
declare
  dias date[];
  n integer;
  i integer;
  v_actual integer := 0;
  v_mejor integer := 0;
  v_seguida integer := 0;
begin
  select coalesce(array_agg(d order by d), '{}')
    into dias
    from (
      select distinct (registrado_en at time zone 'America/Lima')::date as d
      from registros_emocionales
      where usuario_id = p_usuario and activo
    ) s;
  n := coalesce(array_length(dias, 1), 0);

  -- Mejor racha: la secuencia más larga de días consecutivos en todo el historial
  for i in 1..n loop
    if i > 1 and dias[i] = dias[i - 1] + 1 then
      v_seguida := v_seguida + 1;
    else
      v_seguida := 1;
    end if;
    v_mejor := greatest(v_mejor, v_seguida);
  end loop;

  -- Racha actual: desde el último día con registro, si es hoy o ayer
  if n > 0 and dias[n] >= p_hoy - 1 then
    v_actual := 1;
    i := n;
    while i > 1 and dias[i - 1] = dias[i] - 1 loop
      v_actual := v_actual + 1;
      i := i - 1;
    end loop;
  end if;

  insert into rachas (usuario_id, racha_actual, mejor_racha, ultimo_dia, actualizado_en)
  values (p_usuario, v_actual, v_mejor, case when n > 0 then dias[n] end, now())
  on conflict (usuario_id) do update
    set racha_actual = excluded.racha_actual,
        mejor_racha = excluded.mejor_racha,
        ultimo_dia = excluded.ultimo_dia,
        actualizado_en = excluded.actualizado_en;
end;
$$;

-- Los 7 días de la semana (lunes a domingo) que contiene p_hoy, y si cada uno tuvo registro.
create or replace function racha_semana(
  p_usuario bigint,
  p_hoy date default (now() at time zone 'America/Lima')::date
) returns table (dia date, con_registro boolean, es_hoy boolean)
language sql
stable
as $$
  select
    d::date,
    exists (
      select 1 from registros_emocionales r
      where r.usuario_id = p_usuario and r.activo
        and (r.registrado_en at time zone 'America/Lima')::date = d::date
    ),
    d::date = p_hoy
  from generate_series(
    date_trunc('week', p_hoy)::date,
    date_trunc('week', p_hoy)::date + 6,
    interval '1 day'
  ) as d;
$$;

commit;

notify pgrst, 'reload schema';
