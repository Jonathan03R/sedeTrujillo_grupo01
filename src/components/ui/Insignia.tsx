import type { ReactNode } from "react";

export function Insignia({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
      {children}
    </span>
  );
}
