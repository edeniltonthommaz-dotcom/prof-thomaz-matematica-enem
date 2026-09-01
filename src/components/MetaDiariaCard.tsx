"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CheckCircle2, Pencil, Target } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import {
  calcularProgressoMetaDiaria,
  calcularDesempenhoPorCategoria,
  recomendarCategoria,
} from "@/lib/gamificacao";
import {
  subscribe as subscribeMeta,
  getSnapshot as getMetaSnapshot,
  getServerSnapshot as getMetaServerSnapshot,
  definirMetaDiaria,
  META_DIARIA_MIN,
  META_DIARIA_MAX,
} from "@/lib/metaDiaria";
import type { Categoria } from "@/lib/types";

const MINUTOS_POR_QUESTAO = 1.5;

export default function MetaDiariaCard({
  categorias,
}: {
  categorias: { categoria: Categoria; questaoIds: string[] }[];
}) {
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const metaDiaria = useSyncExternalStore(subscribeMeta, getMetaSnapshot, getMetaServerSnapshot);
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(() => String(metaDiaria));

  const progresso = useMemo(() => calcularProgressoMetaDiaria(registros, metaDiaria), [registros, metaDiaria]);
  const pct = Math.min(100, Math.round((progresso.atual / progresso.meta) * 100));

  function abrirEdicao() {
    setRascunho(String(metaDiaria));
    setEditando(true);
  }

  function salvarMeta() {
    const valor = Number(rascunho);
    if (Number.isFinite(valor)) definirMetaDiaria(valor);
    setEditando(false);
  }

  const desempenho = useMemo(
    () => calcularDesempenhoPorCategoria(registros, categorias),
    [registros, categorias]
  );
  const categoriaRecomendada = useMemo(() => recomendarCategoria(desempenho), [desempenho]);

  const questoesRestantes = Math.max(0, progresso.meta - progresso.atual);
  const tempoEstimadoMin = Math.max(1, Math.round(questoesRestantes * MINUTOS_POR_QUESTAO));

  const hrefComecar = categoriaRecomendada ? `/assuntos/${categoriaRecomendada.id}` : "/assuntos";

  return (
    <div id="meta-diaria" className="scroll-mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            progresso.completa ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-slate-400"
          }`}
        >
          {progresso.completa ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta de Hoje</p>
            {!editando && (
              <button
                type="button"
                onClick={abrirEdicao}
                aria-label="Editar meta diária"
                className="text-slate-500 transition hover:text-accent"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-sm text-white">
            {categoriaRecomendada ? categoriaRecomendada.nome : "Todos os assuntos dominados 🎉"}
          </p>

          {editando ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                salvarMeta();
              }}
              className="mt-2 flex items-center gap-2"
            >
              <label htmlFor="meta-diaria-input" className="text-xs text-slate-400">
                Quantas questões por dia?
              </label>
              <input
                id="meta-diaria-input"
                type="number"
                min={META_DIARIA_MIN}
                max={META_DIARIA_MAX}
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                autoFocus
                className="w-16 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-accent-pale px-3 py-1 text-xs font-semibold text-accent-deep transition hover:bg-accent-soft"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <>
              <div className="mb-1 mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {progresso.atual} de {progresso.meta} questões concluídas
                </span>
                <span>Tempo estimado: {tempoEstimadoMin} min</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
            </>
          )}
        </div>
      </div>

      <Link
        href={hrefComecar}
        className="btn-primary mt-4"
      >
        {progresso.atual > 0 ? "Continuar estudando" : "Começar agora"}
      </Link>
    </div>
  );
}
