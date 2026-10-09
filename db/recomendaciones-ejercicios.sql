-- Recomendación y ejercicio por emoción e intensidad · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Es seguro repetirlo.
--
-- Esta tabla decide qué recibe la persona según la emoción del día y su intensidad (1-10):
--   * Solo emociones del catálogo emociones; cada una tiene 3 franjas: 1-4 (baja), 5-7 (media) y 8-10 (alta).
--   * Cada franja tiene su recomendación y su ejercicio, todos DISTINTOS entre sí.
--   * ejercicio = id del ejercicio del catálogo de la app (src/repositories/ejercicio.repository.ts).
--     null = esa franja solo lleva recomendación, sin ejercicio (felicidad 8-10).
-- La IA personaliza el mensaje a partir de la recomendación, pero no cambia el ejercicio.
-- Son ejercicios de autocuidado: la app apoya y no diagnostica. Conviene que los valide un profesional.

begin;

create table if not exists recomendaciones_ejercicios (
  recomendacion_ejercicio_id  bigint generated always as identity primary key,
  emocion_id                  bigint not null references emociones (emocion_id),
  intensidad_desde            smallint not null check (intensidad_desde between 1 and 10),
  intensidad_hasta            smallint not null check (intensidad_hasta between 1 and 10),
  recomendacion               text not null,
  ejercicio                   text,
  activo                      boolean not null default true,
  check (intensidad_desde <= intensidad_hasta),
  unique (emocion_id, intensidad_desde)
);

create index if not exists recomendaciones_ejercicios_emocion_idx on recomendaciones_ejercicios (emocion_id);

alter table recomendaciones_ejercicios enable row level security;

insert into recomendaciones_ejercicios (emocion_id, intensidad_desde, intensidad_hasta, recomendacion, ejercicio)
select e.emocion_id, v.desde, v.hasta, v.recomendacion, v.ejercicio
from (values
  ('felicidad',    1,  4, 'Tu ánimo está en un buen punto. Dedica un momento a notar lo bueno que ya está pasando hoy.',                                    'saborear-momento'),
  ('felicidad',    5,  7, 'Se nota que hoy te sientes bien. Compartirlo con alguien puede hacer que esa alegría dure más.',                                 'compartir-alegria'),
  ('felicidad',    8, 10, '¡Qué gran momento! Disfrútalo sin prisa y recuerda qué lo hizo posible para volver a él cuando lo necesites.',                   null),
  ('tranquilidad', 1,  4, 'Estás en calma. Aprovecha para reconocer lo que hoy te hizo bien.',                                                             'pausa-gratitud'),
  ('tranquilidad', 5,  7, 'Tu cuerpo y tu mente están tranquilos. Un recorrido corporal ayuda a hacer más profunda esa calma.',                             'escaneo-corporal'),
  ('tranquilidad', 8, 10, 'Estás en una calma profunda. Una respiración lenta, como una ola, ayuda a mantenerla.',                                          'respiracion-ola'),
  ('estres',       1,  4, 'Hay algo de tensión. Con unas respiraciones conscientes puedes soltarla antes de que crezca.',                                   'tres-respiraciones'),
  ('estres',       5,  7, 'La tensión está subiendo. Respirar en tiempos iguales ayuda a recuperar el ritmo.',                                              'respiracion-cuadrada'),
  ('estres',       8, 10, 'La tensión es muy alta ahora. Una exhalación larga ayuda al cuerpo a soltar; ve paso a paso y, si te desborda, busca apoyo.',     'respiracion-lenta'),
  ('tristeza',     1,  4, 'Hay un poco de tristeza hoy. Moverte despacio y mirar a tu alrededor puede aliviar.',                                            'caminata-consciente'),
  ('tristeza',     5,  7, 'Lo que sientes pesa. Ponerlo en palabras ayuda a ordenarlo.',                                                                    'escribir-lo-que-sientes'),
  ('tristeza',     8, 10, 'Se siente muy fuerte. No tienes que cargar con esto a solas: hablar con alguien de confianza puede ayudar.',                     'contacto-cercano'),
  ('ansiedad',     1,  4, 'Hay inquietud en el cuerpo. Soltar la tensión muscular te ayuda a bajar el ritmo.',                                              'relajacion-muscular'),
  ('ansiedad',     5,  7, 'Tu mente va rápido. Volver a los sentidos te trae de vuelta al presente.',                                                       'anclaje-5-4-3-2-1'),
  ('ansiedad',     8, 10, 'La inquietud es muy intensa. Un gesto suave con las manos calma el cuerpo; ve despacio y, si lo necesitas, pide apoyo.',         'abrazo-mariposa')
) as v(emocion, desde, hasta, recomendacion, ejercicio)
join emociones e on e.nombre = v.emocion
where not exists (select 1 from recomendaciones_ejercicios);

commit;

notify pgrst, 'reload schema';
