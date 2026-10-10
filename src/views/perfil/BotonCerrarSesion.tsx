import { LogOut } from "lucide-react";
import { cerrarSesion } from "@/controllers/acceso.action";

/** Cierra la sesión de demostración y vuelve a la pantalla de acceso. */
export function BotonCerrarSesion() {
  return (
    <form action={cerrarSesion}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Cerrar sesión
      </button>
    </form>
  );
}
