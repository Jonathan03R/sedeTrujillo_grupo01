import "server-only";
import { ETIQUETA_ACTIVIDAD, type ActividadLugar, type Lugar } from "@/models/autocuidado.model";

// Lugares cercanos desde OpenStreetMap (Overpass API): gratis y sin llave.
// Datos © colaboradores de OpenStreetMap (licencia ODbL).
const URL_OVERPASS = "https://overpass-api.de/api/interpreter";
const ESPERA_MAXIMA_MS = 12_000;
const CANTIDAD_MAXIMA = 5;

/**
 * Ubicación FICTICIA de la persona de demostración: Plaza de Armas de Trujillo, Perú.
 * Es lo único que se envía a Overpass (nada que identifique a la persona).
 * TODO: usar la ubicación real del teléfono, con permiso de la persona, cuando exista la app móvil.
 */
export const UBICACION_DEMO = { latitud: -8.1117, longitud: -79.0288 } as const;

const FILTROS: Record<ActividadLugar, string> = {
  basquet: '["sport"="basketball"]',
  futbol: '["sport"="soccer"]',
  voley: '["sport"="volleyball"]',
  parque: '["leisure"~"^(park|garden)$"]["name"]',
  gimnasio: '["leisure"="fitness_centre"]["name"]',
};

interface ElementoOverpass {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Distancia en metros entre dos puntos (fórmula de haversine). */
function distanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const aRadianes = (grados: number) => (grados * Math.PI) / 180;
  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Los lugares más cercanos para esa actividad, de menor a mayor distancia. Lanza si Overpass no responde. */
export async function buscarLugaresCercanos(actividad: ActividadLugar, radioMetros: number): Promise<Lugar[]> {
  const { latitud, longitud } = UBICACION_DEMO;
  const consulta = `[out:json][timeout:10];(nwr${FILTROS[actividad]}(around:${radioMetros},${latitud},${longitud}););out center 40;`;

  const respuesta = await fetch(URL_OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Pulso-hackathon/1.0 (prototipo UCV)" },
    body: new URLSearchParams({ data: consulta }),
    signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
  });
  if (!respuesta.ok) throw new Error(`Overpass respondió ${respuesta.status}`);

  const { elements } = (await respuesta.json()) as { elements?: ElementoOverpass[] };
  return (elements ?? [])
    .flatMap((elemento): Lugar[] => {
      const lat = elemento.lat ?? elemento.center?.lat;
      const lon = elemento.lon ?? elemento.center?.lon;
      const acceso = elemento.tags?.access;
      if (lat === undefined || lon === undefined || acceso === "private" || acceso === "no") return [];
      return [
        {
          id: `${elemento.type}/${elemento.id}`,
          nombre: elemento.tags?.name ?? `${ETIQUETA_ACTIVIDAD[actividad]} (sin nombre)`,
          actividad,
          distanciaMetros: Math.round(distanciaMetros(latitud, longitud, lat, lon)),
          latitud: lat,
          longitud: lon,
        },
      ];
    })
    .sort((a, b) => a.distanciaMetros - b.distanciaMetros)
    .slice(0, CANTIDAD_MAXIMA);
}
