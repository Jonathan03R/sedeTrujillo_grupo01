import { AvisoApoyo } from "@/components/ui/AvisoApoyo";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { TituloPantalla } from "@/components/ui/TituloPantalla";
import { agregarGusto, quitarGusto } from "@/controllers/gustos.action";
import type { Gusto } from "@/models/gusto.model";
import type { Usuario } from "@/models/usuario.model";
import { MisGustos } from "./MisGustos";

interface PerfilViewProps {
  usuario: Usuario;
  iniciales: string;
  gustos: readonly Gusto[];
}

export function PerfilView({ usuario, iniciales, gustos }: PerfilViewProps) {
  return (
    <div className="space-y-5">
      <TituloPantalla titulo="Mi perfil" />

      <Tarjeta className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700"
        >
          {iniciales}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{usuario.alias}</p>
          {usuario.edad !== null && <p className="text-sm text-slate-500">{usuario.edad} años</p>}
        </div>
      </Tarjeta>

      <MisGustos gustos={gustos} onAgregar={agregarGusto} onQuitar={quitarGusto} />

      <Tarjeta aria-labelledby="titulo-datos">
        <h2 id="titulo-datos" className="mb-3 text-sm font-semibold text-slate-900">
          Mis datos
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Datos</dt>
            <dd className="text-slate-900">Ficticios (demostración)</dd>
          </div>
        </dl>
      </Tarjeta>

      <AvisoApoyo />
    </div>
  );
}
