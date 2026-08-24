"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { CheckCircle2, Target } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import {
  calcularProgressoMetaDiaria,
  calcularDesempenhoPorCategoria,
  recomendarCategoria,
} from "@/lib/gamificacao";
import type { Categoria } from "@/lib/types";

const MINUTOS_POR_QUESTAO = 1.5;

export default function MetaDiariaCard({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const progresso = useMemo(() => calcularProgressoMetaDiaria(registros), [registros]);
  const pct = Math.min(100, Math.round((progresso.atual / progresso.meta) * 100));

  const desempenho = useMemo(
    () => calcularDesempenhoPorCategoria(registros, categorias),
    [registros, categorias]
  );
  const categoriaRecomendada = useMemo(() => recomendarCategoria(desempenho), [desempenho]);

  const questoesRestantes = Math.max(0, progresso.meta - progresso.atual);
  const tempoEstimadoMin = Math.max(1, Math.round(questoesRestantes * MINUTOS_POR_QUESTAO));

  const hrefComecar = categoriaRecomendada ? `/assuntos/${categoriaRecomendada.id}` : "/assuntos";

  return (
    <div id="meta-diaria" className="scroll-mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            progresso.completa ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-slate-400"
          }`}
        >
          {progresso.completa ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta de Hoje</p>
          <p className="text-sm text-white">
            {categoriaRecomendada ? categoriaRecomendada.nome : "Todos os assuntos dominados 🎉"}
          </p>
          <div className="mb-1 mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>
              {progresso.atual} de {progresso.meta} questões concluídas
            </span>
            <span>Tempo estimado: {tempoEstimadoMin} min</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <Link
        href={hrefComecar}
        className="mt-4 inline-block rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:opacity-90"
      >
        {progresso.atual > 0 ? "Continuar estudando" : "Começar agora"}
      </Link>
    </div>
  );
}
