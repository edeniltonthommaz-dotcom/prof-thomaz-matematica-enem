"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { Categoria } from "@/lib/types";
import { calcularEstatisticas, subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";

const TIER_CLASSES: Record<Categoria["tier"], string> = {
  "Altíssima": "text-cyan-400",
  Alta: "text-indigo-400",
  "Média-Alta": "text-amber-400",
  "Média": "text-slate-400",
};

export default function CategoryCard({
  categoria,
  questaoIds,
}: {
  categoria: Categoria;
  questaoIds: string[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const stats = useMemo(() => calcularEstatisticas(registros, questaoIds), [registros, questaoIds]);

  const total = questaoIds.length;
  const progressoPct = total > 0 ? Math.round((stats.respondidas / total) * 100) : 0;

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{categoria.nome}</h3>
      </div>
      <p className={`mb-2 text-xs font-medium ${TIER_CLASSES[categoria.tier]}`}>
        {categoria.tier} ({categoria.pesoProva})
      </p>
      <p className="mb-3 text-sm text-slate-400">{categoria.descricao}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {categoria.subtopicos.slice(0, 3).map((s) => (
          <span key={s} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
            {s}
          </span>
        ))}
        {categoria.subtopicos.length > 3 && (
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
            +{categoria.subtopicos.length - 3}
          </span>
        )}
      </div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>
          Progresso: {stats.respondidas}/{total}
        </span>
        <span>{progressoPct}%</span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progressoPct}%` }} />
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Acertos: {stats.acertoPct !== null ? `${stats.acertoPct}%` : "—"}
        </span>
        <Link
          href={`/assuntos/${categoria.id}`}
          className="inline-flex items-center rounded-full bg-accent-pale px-4 py-1.5 text-sm font-semibold text-accent-deep transition hover:bg-accent-soft"
        >
          Praticar →
        </Link>
      </div>
    </div>
  );
}
