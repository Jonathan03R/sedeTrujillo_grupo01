import { TarjetaLugar } from "@/components/ejercicios/TarjetaLugar";
import { TarjetaVideo } from "@/components/ejercicios/TarjetaVideo";
import { TarjetaVideoEmocion } from "@/components/ejercicios/TarjetaVideoEmocion";
import { EncabezadoPantalla } from "@/components/ui/EncabezadoPantalla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { AlternativaAutocuidado, IconoAlternativa, LugarRecomendado, VideoRecomendado } from "@/models/autocuidado.model";
import type { VideoEmocion } from "@/repositories/catalogo-estatico.repository";
import { DiarioPersonal } from "./DiarioPersonal";
import { PasosIdea } from "./PasosIdea";

interface IdeaViewProps {
  icono: IconoAlternativa;
  alternativa: AlternativaAutocuidado | null;
  /** Lugares: el de la IA (si lo hubo) y los estáticos de Trujillo según tus gustos. */
  lugares: LugarRecomendado[];
  /** Video que la IA eligió al registrar (si lo hubo). */
  video: VideoRecomendado | null;
  /** Videos estáticos de la emoción de hoy. */
  videosEmocion: VideoEmocion[];
}

function SinResultado({ texto }: { texto: string }) {
  return (
    <Tarjeta>
      <p className="text-sm text-slate-600">{texto}</p>
    </Tarjeta>
  );
}

/** Lo que se ve al tocar una tarjeta de «También puedes…». Cada ícono tiene su destino. */
function Destino({ icono, alternativa, lugares, video, videosEmocion }: IdeaViewProps) {
  switch (icono) {
    case "deporte":
    case "relajacion":
    case "caminar":
    case "naturaleza":
      return lugares.length > 0 ? (
        <div className="space-y-4">
          {lugares.map((lugar) => (
            <TarjetaLugar key={`${lugar.nombre}-${lugar.latitud}-${lugar.longitud}`} lugar={lugar} />
          ))}
        </div>
      ) : (
        <SinResultado texto="No hay lugares de Trujillo para tus gustos todavía." />
      );

    case "musica":
      return video || videosEmocion.length > 0 ? (
        <div className="space-y-4">
          {video && <TarjetaVideo video={video} />}
          {videosEmocion.map((v) => (
            <TarjetaVideoEmocion key={v.titulo} video={v} />
          ))}
        </div>
      ) : (
        <SinResultado texto="Registra una emoción para ver videos según cómo te sientes." />
      );

    case "escribir":
      return <DiarioPersonal />;

    default:
      return alternativa ? <PasosIdea alternativa={alternativa} /> : <SinResultado texto="Registra una emoción para preparar ideas para ti." />;
  }
}

export function IdeaView({ icono, alternativa, lugares, video, videosEmocion }: IdeaViewProps) {
  return (
    <div className="space-y-5">
      <EncabezadoPantalla titulo={alternativa?.titulo ?? "Idea para ti"} volverA="/inicio" />
      {alternativa && <p className="text-sm leading-relaxed text-slate-600">{alternativa.descripcion}</p>}
      <Destino icono={icono} alternativa={alternativa} lugares={lugares} video={video} videosEmocion={videosEmocion} />
    </div>
  );
}
