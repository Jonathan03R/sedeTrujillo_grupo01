import { AvatarEmocion } from "@/components/emociones/AvatarEmocion";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { RegistroReciente } from "@/models/progreso.model";

export function ListaRegistrosRecientes({ registros }: { registros: readonly RegistroReciente[] }) {
  return (
    <section aria-labelledby="titulo-recientes">
      <h2 id="titulo-recientes" className="mb-2 text-sm font-semibold text-slate-900">
        Mis registros recientes
      </h2>
      <Tarjeta className="py-1">
        {registros.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">Aún no tienes registros.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {registros.map((registro) => (
              <li key={registro.id} className="flex items-center gap-3 py-3">
                <AvatarEmocion emocion={registro.emocion} tamano="sm" />
                <div>
                  <p className="text-xs text-slate-500">{registro.fechaTexto}</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {registro.emocion.etiqueta} ({registro.intensidad})
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </section>
  );
}
