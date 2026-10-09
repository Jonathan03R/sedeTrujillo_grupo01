-- Gustos de la persona y autocuidado personalizado con IA · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Es seguro repetirlo.
--
-- Los gustos («me gusta el básquet», «dibujar»…) se guardan una vez y se ven y editan en el Perfil.
-- Al registrar la emoción del día, la IA los combina con la emoción y su intensidad (1-10) y arma, en
-- tiempo real, un ejercicio de autorregulación y 4 ideas de autocuidado para ESA persona. El resultado
-- se guarda en recomendaciones_autocuidado, ligado al registro emocional. No diagnostica.

begin;

create table if not exists gustos (
  gusto_id    bigint generated always as identity primary key,
  usuario_id  bigint not null references usuarios (usuario_id),
  texto       text not null check (char_length(texto) between 2 and 40),
  creado_en   timestamptz not null default now(),
  activo      boolean not null default true
);

-- Un mismo gusto no se repite por persona (sin distinguir mayúsculas)
create unique index if not exists gustos_usuario_texto_idx on gustos (usuario_id, lower(texto)) where activo;

-- recomendacion: mensaje personalizado · ejercicio: id del ejercicio del catálogo de la app
-- alternativas: las ideas de autocuidado [{titulo, descripcion, icono}] · modelo: modelo de IA que las generó
alter table recomendaciones_autocuidado add column if not exists alternativas jsonb not null default '[]'::jsonb;
alter table recomendaciones_autocuidado add column if not exists modelo text;

alter table gustos enable row level security;

commit;

notify pgrst, 'reload schema';
