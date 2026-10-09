// Esqueleto que se muestra mientras una pantalla espera sus datos.
export function CargandoPantalla() {
  return (
    <div role="status" aria-label="Cargando" className="animate-pulse space-y-5 motion-reduce:animate-none">
      <div className="mx-auto h-6 w-40 rounded-lg bg-slate-200" />
      <div className="h-24 rounded-2xl bg-slate-200" />
      <div className="h-32 rounded-2xl bg-slate-200" />
      <div className="h-40 rounded-2xl bg-slate-200" />
    </div>
  );
}
