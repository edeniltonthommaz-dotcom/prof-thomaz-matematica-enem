"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Categoria, Dificuldade, Questao, Resumo } from "@/lib/types";
import { DIFICULDADE_LABEL } from "@/components/DificuldadeBadge";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/progress";
import ResumoView from "@/components/ResumoView";

const ORDEM: Dificuldade[] = ["facil", "medio", "dificil"];
const SEM_QUESTOES: Questao[] = [];
type Aba = "teoria" | Dificuldade;

export default function CategoriaExplorer({
  categoria,
  porDificuldade,
  dificuldadeInicial,
  resumo,
}: {
  categoria: Categoria;
  porDificuldade: Record<Dificuldade, Questao[]>;
  dificuldadeInicial?: Dificuldade;
  resumo?: Resumo;
}) {
  const [aba, setAba] = useState<Aba>(dificuldadeInicial ?? "teoria");
  const registros = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const lista = aba === "teoria" ? SEM_QUESTOES : porDificuldade[aba];

  const primeiraPendente = useMemo(() => {
    return lista.find((q) => !registros[q.id]?.respondida) ?? lista[0];
  }, [lista, registros]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setAba("teoria")}
          className={`rounded-lg border px-4 py-2 text-sm transition ${
            aba === "teoria"
              ? "border-gray-400 bg-gray-400/10 text-white"
              : "border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/5"
          }`}
        >
          Teoria
        </button>
        {ORDEM.map((d) => {
          const count = porDificuldade[d].length;
          const respondidas = porDificuldade[d].filter((q) => registros[q.id]?.respondida).length;
          const ativa = aba === d;
          return (
            <button
              key={d}
              onClick={() => setAba(d)}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                ativa
                  ? "border-gray-400 bg-gray-400/10 text-white"
                  : "border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/5"
              }`}
            >
              {DIFICULDADE_LABEL[d]}{" "}
              <span className="ml-1 text-xs text-slate-400">
                ({respondidas}/{count})
              </span>
            </button>
          );
        })}
      </div>

      {aba === "teoria" ? (
        <div className="mb-8">
          <ResumoView resumo={resumo} />
        </div>
      ) : (
        <>
          {primeiraPendente && (
            <Link
              href={`/assuntos/${categoria.id}/${primeiraPendente.id}`}
              className="mb-6 inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
            >
              Praticar nível {DIFICULDADE_LABEL[aba].toLowerCase()} →
            </Link>
          )}

          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {lista.map((q, i) => {
              const r = registros[q.id];
              const base = "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium";
              const estilo = !r?.respondida
                ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"
                : r.correta
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                : "border-rose-500/40 bg-rose-500/15 text-rose-400";
              return (
                <Link key={q.id} href={`/assuntos/${categoria.id}/${q.id}`} className={`${base} ${estilo}`}>
                  {i + 1}
                </Link>
              );
            })}
          </div>

          {lista.length === 0 && (
            <p className="text-sm text-slate-400">Ainda não há questões cadastradas neste nível.</p>
          )}
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {categoria.subtopicos.map((s) => (
          <span key={s} className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
