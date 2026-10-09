-- Monitoreo del uso del teléfono y análisis con IA · Pulso · Equipo 01
-- Ejecutar después de db/schema.sql (las mismas tablas están también en schema.sql).
--
-- En el teléfono, la app observaría en segundo plano cada vez que la persona abre una app.
-- En el prototipo web esos datos son FICTICIOS (ver db/seed-uso-telefono.sql).
-- La IA busca cambios en la rutina (señales tempranas) y sugiere autocuidado. No diagnostica.

begin;

-- Cada vez que la persona abre una app y cuánto la usa (lo que captaría el monitoreo en segundo plano)
create table if not exists sesiones_telefono (
  sesion_telefono_id  bigint generated always as identity primary key,
  usuario_id          bigint not null references usuarios (usuario_id),
  aplicacion_id       bigint not null references aplicaciones (aplicacion_id),
  inicio              timestamptz not null,
  minuto              integer not null check (minuto between 0 and 1440),
  -- Solo para la demostración: anomalía sembrada a propósito (null = rutina normal).
  -- Sirve para comprobar si la IA la detecta; nunca se envía a la IA.
  anomalia_simulada   text,
  activo              boolean not null default true
);

-- Resultado de cada análisis de la IA sobre una ventana de uso
create table if not exists analisis_uso_telefono (
  analisis_uso_telefono_id  bigint generated always as identity primary key,
  usuario_id                bigint not null references usuarios (usuario_id),
  desde                     timestamptz not null,
  hasta                     timestamptz not null,
  nivel_atencion            text not null check (nivel_atencion in ('bajo', 'medio', 'alto')),
  senal_predominante        text
                            check (senal_predominante in ('bienestar', 'cansancio', 'animo_bajo', 'activacion', 'irritabilidad')),
  resumen                   text not null,
  sugerencias               text[] not null default '{}',
  sugerir_profesional       boolean not null default false,
  modelo                    text not null,
  creado_en                 timestamptz not null default now(),
  activo                    boolean not null default true,
  check (hasta > desde)
);

-- Anomalías que la IA encontró en un análisis (detección temprana)
create table if not exists anomalias_uso_telefono (
  anomalia_uso_telefono_id  bigint generated always as identity primary key,
  analisis_uso_telefono_id  bigint not null references analisis_uso_telefono (analisis_uso_telefono_id),
  tipo                      text not null
                            check (tipo in ('uso_nocturno', 'pico_uso', 'revision_frecuente',
                                            'menos_contacto', 'abandono_rutina', 'otro')),
  fecha                     date not null,
  severidad                 text not null check (severidad in ('leve', 'moderada', 'alta')),
  descripcion               text not null,
  activo                    boolean not null default true
);

create index if not exists sesiones_telefono_usuario_inicio_idx on sesiones_telefono (usuario_id, inicio);
create index if not exists sesiones_telefono_aplicacion_idx     on sesiones_telefono (aplicacion_id);
create index if not exists analisis_uso_telefono_usuario_idx    on analisis_uso_telefono (usuario_id, creado_en);
create index if not exists anomalias_uso_telefono_analisis_idx  on anomalias_uso_telefono (analisis_uso_telefono_id);

alter table sesiones_telefono      enable row level security;
alter table analisis_uso_telefono  enable row level security;
alter table anomalias_uso_telefono enable row level security;

commit;
