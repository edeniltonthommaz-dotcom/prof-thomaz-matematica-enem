"use client";

import { useMemo, useSyncExternalStore } from "react";
import { calcularEstatisticas, subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import type { Categoria } from "@/lib/types";

export default function HomeStats({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const questaoIds = useMemo(() => categorias.flatMap((c) => c.questaoIds), [categorias]);
  const stats = useMemo(() => calcularEstatisticas(registros, questaoIds), [registros, questaoIds]);

  const cards = [
    { label: "Resolvidas", value: `${stats.respondidas} / ${questaoIds.length}` },
    { label: "Acertos", value: stats.acertoPct !== null ? `${stats.acertoPct}%` : "—" },
    { label: "Total no banco", value: `${questaoIds.length}` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-slate-400">{c.label}</p>
          <p className="text-2xl font-bold text-white">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
