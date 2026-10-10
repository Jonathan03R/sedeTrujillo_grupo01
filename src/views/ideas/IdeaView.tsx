import { TarjetaLugar } from "@/components/ejercicios/TarjetaLugar";
import { TarjetaVideo } from "@/components/ejercicios/TarjetaVideo";
import { TarjetaVideoGusto } from "@/components/ejercicios/TarjetaVideoGusto";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { AlternativaAutocuidado, IconoAlternativa, LugarRecomendado, VideoRecomendado } from "@/models/autocuidado.model";
import type { VideoGusto } from "@/repositories/video-gusto.repository";
import { DiarioPersonal } from "./DiarioPersonal";
import { PasosIdea } from "./PasosIdea";

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
 * Cada tarjeta muestra resultados preparados al registrar la emoción.
 */
function Destino({ icono, alternativa, lugar, video, videoGusto }: IdeaViewProps) {
  switch (icono) {
    case "deporte":
    case "relajacion":
    case "caminar":
    case "naturaleza":
      return lugar ? <TarjetaLugar lugar={lugar} /> : <SinResultado texto="Para buscar lugares cercanos necesitamos permiso de ubicación. Tu ubicación no se guarda." />;

    case "musica":
      return video || videoGusto ? (
        <>
          {video && <TarjetaVideo video={video} />}
          {videoGusto && <TarjetaVideoGusto video={videoGusto} />}
        </>
      ) : (
        <SinResultado texto="Todavía no tenemos una playlist para ti." />
      );

    case "escribir":
      return <DiarioPersonal />;

    default:
      return alternativa ? <PasosIdea alternativa={alternativa} /> : <SinResultado texto="Registra una emoción para preparar ideas para ti." />;
  }
}

export function IdeaView({ icono, alternativa, lugar, video, videoGusto }: IdeaViewProps) {
  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo={alternativa?.titulo ?? "Idea para ti"} volverA="/inicio" />
      {alternativa && <p className="text-sm leading-relaxed text-slate-600">{alternativa.descripcion}</p>}
      <Destino icono={icono} alternativa={alternativa} lugar={lugar} video={video} videoGusto={videoGusto} />
    </div>
  );
}
