import { TarjetaLugar } from "@/components/ejercicios/TarjetaLugar";
import { TarjetaVideo } from "@/components/ejercicios/TarjetaVideo";
import { TarjetaVideoGusto } from "@/components/ejercicios/TarjetaVideoGusto";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { AlternativaAutocuidado, IconoAlternativa, LugarRecomendado, VideoRecomendado } from "@/models/autocuidado.model";
import type { VideoGusto } from "@/repositories/video-gusto.repository";

interface IdeaViewProps {
  icono: IconoAlternativa;
  alternativa: AlternativaAutocuidado | null;
  lugar: LugarRecomendado | null;
  video: VideoRecomendado | null;
  videoGusto: VideoGusto | null;
}

function SinResultado({ texto }: { texto: string }) {
  return (
    <Tarjeta>
      <p className="text-sm text-slate-600">{texto}</p>
    </Tarjeta>
  );
}

/**
 * Lo que se ve al tocar una tarjeta de «También puedes…». Cada ícono tiene su destino:
 *   deporte -> el lugar cercano (OpenStreetMap) · musica -> los videos (YouTube y los de tus gustos).
 * Los demás íconos todavía no tienen destino: agrega aquí un caso nuevo cuando lo tengan.
 */
function Destino({ icono, lugar, video, videoGusto }: Omit<IdeaViewProps, "alternativa">) {
  switch (icono) {
    case "deporte":
      return lugar ? <TarjetaLugar lugar={lugar} /> : <SinResultado texto="Todavía no encontramos un lugar cerca de ti para esto." />;

    case "musica":
      return video || videoGusto ? (
        <>
          {video && <TarjetaVideo video={video} />}
          {videoGusto && <TarjetaVideoGusto video={videoGusto} />}
        </>
      ) : (
        <SinResultado texto="Todavía no tenemos una playlist para ti." />
      );

    default:
      return <SinResultado texto="Pronto vas a encontrar más aquí." />;
  }
}

export function IdeaView({ icono, alternativa, lugar, video, videoGusto }: IdeaViewProps) {
  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo={alternativa?.titulo ?? "Idea para ti"} volverA="/inicio" />
      {alternativa && <p className="text-sm leading-relaxed text-slate-600">{alternativa.descripcion}</p>}
      <Destino icono={icono} lugar={lugar} video={video} videoGusto={videoGusto} />
    </div>
  );
}
