import "server-only";
import { ETIQUETA_ACTIVIDAD, type ActividadLugar, type Lugar } from "@/models/autocuidado.model";
import type { Ubicacion } from "@/models/ubicacion.model";

// Lugares cercanos desde OpenStreetMap (Overpass API): gratis y sin llave.
// Datos © colaboradores de OpenStreetMap (licencia ODbL). Solo se envía un punto del mapa, nada que identifique a la persona.
// Los servidores públicos de Overpass a veces se saturan: si el primero falla se prueba el siguiente.
const SERVIDORES_OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
const ESPERA_MAXIMA_MS = 10_000;
const CANTIDAD_MAXIMA = 5;

const FILTROS: Record<ActividadLugar, string> = {
  basquet: '["sport"="basketball"]',
  futbol: '["sport"="soccer"]',
  voley: '["sport"="volleyball"]',
  parque: '["leisure"~"^(park|garden)$"]["name"]',
  gimnasio: '["leisure"="fitness_centre"]["name"]',
  biblioteca: '["amenity"="library"]["name"]',
  museo: '["tourism"="museum"]["name"]',
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
export function distanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const aRadianes = (grados: number) => (grados * Math.PI) / 180;
  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Pregunta a Overpass probando cada servidor; lanza si ninguno responde con datos válidos. */
async function consultarOverpass(consulta: string): Promise<ElementoOverpass[]> {
  let ultimoError: unknown;
  for (const servidor of SERVIDORES_OVERPASS) {
    try {
      const respuesta = await fetch(servidor, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Pulso-hackathon/1.0 (prototipo UCV)" },
        body: new URLSearchParams({ data: consulta }),
        signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
      });
      if (!respuesta.ok) throw new Error(`${servidor} respondió ${respuesta.status}`);
      // Con errores internos Overpass devuelve 200 con una página en vez de JSON: se cuenta como fallo.
      const { elements } = (await respuesta.json()) as { elements?: ElementoOverpass[] };
      if (!Array.isArray(elements)) throw new Error(`${servidor} no devolvió resultados`);
      return elements;
    } catch (error) {
      ultimoError = error;
    }
  }
  throw ultimoError;
}

/** Los lugares más cercanos según OpenStreetMap, de menor a mayor distancia. Lanza si Overpass no responde. */
async function buscarEnOverpass(
  actividad: ActividadLugar,
  radioMetros: number,
  { latitud, longitud }: Ubicacion,
): Promise<Lugar[]> {
  const consulta = `[out:json][timeout:10];(nwr${FILTROS[actividad]}(around:${radioMetros},${latitud},${longitud}););out center 40;`;

  const elements = await consultarOverpass(consulta);
  return elements
    .flatMap((elemento): Lugar[] => {
      const lat = elemento.lat ?? elemento.center?.lat;
      const lon = elemento.lon ?? elemento.center?.lon;
      const acceso = elemento.tags?.access;
      if (lat === undefined || lon === undefined || acceso === "private" || acceso === "no") return [];
      return [
        {
          id: `${elemento.type}/${elemento.id}`,
          nombre: elemento.tags?.name ?? ETIQUETA_ACTIVIDAD[actividad],
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

/**
 * Lugares de Trujillo puestos A MANO para cuando Overpass no responde o no encuentra nada.
 * Son datos de demostración: el de básquet es una cancha real de OpenStreetMap y el parque es la Plaza de Armas.
 * Para otras actividades no hay respaldo (se devuelve una lista vacía).
 */
const LUGARES_RESPALDO: Record<ActividadLugar, readonly Omit<Lugar, "distanciaMetros">[]> = {
  basquet: [
    { id: "manual/cancha-trujillo", nombre: "Cancha de básquet", actividad: "basquet", latitud: -8.1200453, longitud: -79.0302388 },
  ],
  parque: [
    { id: "manual/plaza-de-armas", nombre: "Plaza de Armas de Trujillo", actividad: "parque", latitud: -8.1117, longitud: -79.0288 },
  ],
  futbol: [],
  voley: [],
  gimnasio: [],
  biblioteca: [],
  museo: [],
};

/**
 * Los lugares más cercanos para esa actividad, de menor a mayor distancia, desde la ubicación de la persona.
 * Usa OpenStreetMap; si no responde o no hay nada, los lugares de respaldo de Trujillo dentro del radio. Nunca lanza.
 */
export async function buscarLugaresCercanos(actividad: ActividadLugar, radioMetros: number, ubicacion: Ubicacion, permitirRespaldo = true): Promise<Lugar[]> {
  try {
    const lugares = await buscarEnOverpass(actividad, radioMetros, ubicacion);
    if (lugares.length > 0) return lugares;
  } catch (error) {
    console.error(error); // el detalle queda en el servidor; se sigue con los lugares de respaldo
  }

  return (permitirRespaldo ? LUGARES_RESPALDO[actividad] : [])
    .map((lugar): Lugar => ({
      ...lugar,
      distanciaMetros: Math.round(distanciaMetros(ubicacion.latitud, ubicacion.longitud, lugar.latitud, lugar.longitud)),
    }))
    .filter((lugar) => lugar.distanciaMetros <= radioMetros)
    .sort((a, b) => a.distanciaMetros - b.distanciaMetros);
}
