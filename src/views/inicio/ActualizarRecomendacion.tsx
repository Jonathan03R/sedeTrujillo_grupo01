"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Refresca la recomendación solo mientras generación sigue pendiente. */
export function ActualizarRecomendacion() {
  const router = useRouter();
  useEffect(() => {
    const inicio = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - inicio > 30_000) window.clearInterval(timer);
      else router.refresh();
    }, 3_000);
    return () => window.clearInterval(timer);
  }, [router]);
  return <p role="status" className="rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-800">Preparando música e ideas para este momento…</p>;
}
