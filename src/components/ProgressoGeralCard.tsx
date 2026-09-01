"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot, calcularEstatisticas } from "@/lib/progress";
import CircularProgress from "@/components/CircularProgress";
import type { Categoria } from "@/lib/types";

export default function ProgressoGeralCard({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const questaoIds = useMemo(() => categorias.flatMap((c) => c.questaoIds), [categorias]);
  const stats = useMemo(() => calcularEstatisticas(registros, questaoIds), [registros, questaoIds]);
  const total = questaoIds.length;
  const pct = total > 0 ? Math.round((stats.respondidas / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
      <CircularProgress pct={pct} label="concluído" corDestaque={pct >= 70 ? "verde" : "amarelo"} />
      <p className="mt-4 text-sm text-slate-300">
        {stats.respondidas} de {total} questões
      </p>
      <Link
        href="/desempenho"
        className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5"
      >
        Ver desempenho
      </Link>
    </div>
  );
}
