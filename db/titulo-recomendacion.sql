-- Título de la recomendación generado por la IA · Pulso · Equipo 01
-- Para una base que ya existe (en una nueva, schema.sql ya lo incluye). Es seguro repetirlo.
-- La IA escribe un título corto para la pantalla de Ejercicios («Mi momento de calma»).
-- Las recomendaciones anteriores quedan con titulo null y la app usa el texto fijo como respaldo.

begin;

alter table recomendaciones_autocuidado add column if not exists titulo text;

commit;

notify pgrst, 'reload schema';
