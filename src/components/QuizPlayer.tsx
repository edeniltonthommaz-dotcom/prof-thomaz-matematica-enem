"use client";

import Link from "next/link";
import { useState } from "react";
import { Alternativa, Questao } from "@/lib/types";
import DificuldadeBadge from "@/components/DificuldadeBadge";
import SolidoDiagram from "@/components/SolidoDiagram";
import GraficoDiagram from "@/components/GraficoDiagram";
import { registrarResposta } from "@/lib/progress";

export default function QuizPlayer({
  questao,
  categoriaId,
  categoriaNome,
  prevId,
  nextId,
  posicao,
  total,
}: {
  questao: Questao;
  categoriaId: string;
  categoriaNome: string;
  prevId?: string;
  nextId?: string;
  posicao: number;
  total: number;
}) {
  const [selecionada, setSelecionada] = useState<Alternativa["letra"] | null>(null);
  const [respondida, setRespondida] = useState(false);

  function escolher(letra: Alternativa["letra"]) {
    if (respondida) return;
    setSelecionada(letra);
  }

  function responder() {
    if (!selecionada || respondida) return;
    setRespondida(true);
    registrarResposta(questao.id, selecionada === questao.correta, selecionada);
  }

  const acertou = respondida && selecionada === questao.correta;

  function estiloAlternativa(letra: Alternativa["letra"]) {
    if (!respondida) {
      return selecionada === letra
        ? "border-gray-400 bg-gray-400/10"
        : "border-white/10 bg-white/[0.02] hover:bg-white/5";
    }
    if (letra === questao.correta) return "border-emerald-500/50 bg-emerald-500/15";
    if (letra === selecionada) return "border-rose-500/50 bg-rose-500/15";
    return "border-white/10 bg-white/[0.02] opacity-60";
  }

  const comentarioErro = selecionada && questao.distratores?.[selecionada];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {categoriaNome} › {questao.subtopico}
      </p>
      <div className="mb-6 flex items-center justify-between">
        <DificuldadeBadge dificuldade={questao.dificuldade} />
        <span className="text-xs text-slate-400">
          Questão {posicao} de {total}
          {questao.fonte.tipo === "enem" && questao.fonte.ano ? ` · ENEM ${questao.fonte.ano}` : " · Inédita"}
        </span>
      </div>

      <p className="mb-4 text-lg leading-relaxed text-slate-100">{questao.enunciado}</p>

      {questao.figura && (
        <figure className="mb-6 overflow-hidden rounded-lg border border-white/10 bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={questao.figura.src} alt={questao.figura.alt} className="mx-auto h-auto max-w-full" />
          {questao.figura.legenda && (
            <figcaption className="mt-2 text-center text-xs text-slate-500">{questao.figura.legenda}</figcaption>
          )}
        </figure>
      )}

      {questao.diagrama && (
        <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.02] p-4">
          {"categorias" in questao.diagrama ? (
            <GraficoDiagram diagrama={questao.diagrama} />
          ) : (
            <SolidoDiagram diagrama={questao.diagrama} />
          )}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3">
        {questao.alternativas.map((alt) => (
          <button
            key={alt.letra}
            onClick={() => escolher(alt.letra)}
            disabled={respondida}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${estiloAlternativa(alt.letra)}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold">
              {alt.letra}
            </span>
            {alt.imagem ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={alt.imagem} alt={`Alternativa ${alt.letra}`} className="h-auto max-w-full rounded bg-white p-1" />
            ) : (
              <span className="text-sm text-slate-100">{alt.texto}</span>
            )}
          </button>
        ))}
      </div>

      {!respondida ? (
        <button
          onClick={responder}
          disabled={!selecionada}
          className="rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-500"
        >
          Responder
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              acertou
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-300"
            }`}
          >
            <p className="font-semibold">{acertou ? "Você acertou!" : "Você errou."}</p>
            {!acertou && (
              <p className="mt-1 text-slate-300">
                Alternativa correta: <strong>{questao.correta}</strong>
              </p>
            )}
          </div>

          {!acertou && (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Por que você errou
              </p>
              <p className="text-sm text-slate-200">
                {comentarioErro ?? questao.explicacao}
              </p>
            </div>
          )}

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Resolução comentada
            </p>
            <p className="text-sm text-slate-200">{questao.explicacao}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href={prevId ? `/assuntos/${categoriaId}/${prevId}` : `/assuntos/${categoriaId}`}
              className="text-sm text-slate-400 hover:text-white"
            >
              ← Anterior
            </Link>
            <Link
              href={nextId ? `/assuntos/${categoriaId}/${nextId}` : `/assuntos/${categoriaId}`}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
            >
              Próxima questão →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
