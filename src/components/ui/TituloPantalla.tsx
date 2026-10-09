interface TituloPantallaProps {
  titulo: string;
  subtitulo?: string;
}

export function TituloPantalla({ titulo, subtitulo }: TituloPantallaProps) {
  return (
    <header>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{titulo}</h1>
      {subtitulo && <p className="mt-1 text-sm text-slate-600">{subtitulo}</p>}
    </header>
  );
}
