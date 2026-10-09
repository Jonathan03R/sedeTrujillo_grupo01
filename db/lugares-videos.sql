-- Lugar cercano y video recomendados por la IA · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Es seguro repetirlo.
--
-- Al registrar la emoción, la IA puede (si le sirve) buscar con herramientas reales un lugar cercano
-- para una actividad que le gusta a la persona (OpenStreetMap) y un video tranquilo (YouTube).
-- Lo que elige se guarda junto a la recomendación:
--   lugar: {nombre, actividad, distanciaMetros, latitud, longitud, motivo}
--   video: {videoId, titulo, canal, duracionMinutos, motivo}
-- null = la IA no recomendó ninguno.

begin;

alter table recomendaciones_autocuidado add column if not exists lugar jsonb;
alter table recomendaciones_autocuidado add column if not exists video jsonb;

commit;

notify pgrst, 'reload schema';
