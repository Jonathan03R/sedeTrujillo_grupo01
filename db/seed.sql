-- Catálogos iniciales (datos ficticios / de configuración)
-- senal: categoría de señal asociada al emoji (no es un diagnóstico)

insert into emojis (simbolo, nombre, valor, senal) values
  ('😄', 'muy feliz',   5, 'bienestar'),
  ('🙂', 'contento',    4, 'bienestar'),
  ('😌', 'tranquilo',   4, 'bienestar'),
  ('😐', 'neutral',     3, 'neutral'),
  ('😴', 'cansado',     2, 'cansancio'),
  ('😟', 'preocupado',  2, 'activacion'),
  ('😰', 'ansioso',     1, 'activacion'),
  ('😢', 'triste',      1, 'animo_bajo'),
  ('😡', 'enojado',     1, 'irritabilidad')
on conflict (simbolo) do nothing;

-- nombre = archivo del ícono en public/iconos/emociones/<nombre>.svg
insert into emociones (nombre, etiqueta, valor, orden) values
  ('felicidad',    'Felicidad',    5, 1),
  ('tranquilidad', 'Tranquilidad', 4, 2),
  ('estres',       'Estrés',       2, 3),
  ('tristeza',     'Tristeza',     1, 4),
  ('ansiedad',     'Ansiedad',     1, 5),
  ('otra',         'Otra',         3, 6)
on conflict (nombre) do nothing;

insert into aplicaciones (nombre, categoria) values
  ('Instagram',        'redes_sociales'),
  ('TikTok',           'redes_sociales'),
  ('Facebook',         'redes_sociales'),
  ('WhatsApp',         'mensajeria'),
  ('YouTube',          'entretenimiento'),
  ('Netflix',          'entretenimiento'),
  ('Spotify',          'entretenimiento'),
  ('Roblox',           'juegos'),
  ('Google Classroom', 'educacion'),
  ('Duolingo',         'educacion'),
  ('Notion',           'productividad')
on conflict (nombre) do nothing;

insert into preguntas (texto) values
  ('¿Cómo te sientes ahora mismo?'),
  ('¿Cómo te sentiste después de usar esta app?'),
  ('¿Cómo estuvo tu día en la universidad?'),
  ('¿Cómo dormiste anoche?'),
  ('¿Cómo te sientes con el tiempo que pasaste hoy en el celular?')
on conflict (texto) do nothing;
