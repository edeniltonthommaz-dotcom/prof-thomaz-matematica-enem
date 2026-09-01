"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import type { Alternativa, Questao } from "@/lib/types";
import DificuldadeBadge from "@/components/DificuldadeBadge";
import CelebracaoModal from "@/components/CelebracaoModal";
import { registrarResposta, getSnapshot, hidratacaoEstaPendente } from "@/lib/progress";
import { detectarCelebracoes, type Celebracao } from "@/lib/gamificacao";
import {
  subscribe as subscribeMeta,
  getSnapshot as getMetaSnapshot,
  getServerSnapshot as getMetaServerSnapshot,
} from "@/lib/metaDiaria";

interface QuestaoComCategoria extends Questao {
  categoriaNome: string;
}

export default function SimuladoPlayer({ questoes }: { questoes: QuestaoComCategoria[] }) {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const [selecionada, setSelecionada] = useState<Alternativa["letra"] | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [celebracoes, setCelebracoes] = useState<Celebracao[]>([]);
  const metaDiaria = useSyncExternalStore(subscribeMeta, getMetaSnapshot, getMetaServerSnapshot);

  if (questoes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-sm text-slate-400">
        Nenhuma questão disponível para o simulado no momento.
      </div>
    );
  }

  const questao = questoes[indice];
  const ultima = indice === questoes.length - 1;

  function escolher(letra: Alternativa["letra"]) {
    if (respondida) return;
    setSelecionada(letra);
  }

  function responder() {
    if (!selecionada || respondida) return;
    setRespondida(true);
    const correta = selecionada === questao.correta;
    if (correta) setAcertos((a) => a + 1);
    const antes = getSnapshot();
    registrarResposta(questao.id, correta, selecionada);
    const depois = getSnapshot();
    if (!hidratacaoEstaPendente()) {
      const novas = detectarCelebracoes(antes, depois, metaDiaria);
      if (novas.length > 0) setCelebracoes(novas);
    }
  }

  function proxima() {
    if (ultima) {
      setFinalizado(true);
      return;
    }
    setIndice((i) => i + 1);
    setSelecionada(null);
    setRespondida(false);
  }

  function estiloAlternativa(letra: Alternativa["letra"]) {
    if (!respondida) {
      return selecionada === letra
        ? "border-accent bg-accent/10"
        : "border-white/10 bg-white/[0.02] hover:bg-white/5";
    }
    if (letra === questao.correta) return "border-emerald-500/50 bg-emerald-500/15";
    if (letra === selecionada) return "border-rose-500/50 bg-rose-500/15";
    return "border-white/10 bg-white/[0.02] opacity-60";
  }

  if (finalizado) {
    const pct = Math.round((acertos / questoes.length) * 100);
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mb-1 text-2xl font-bold text-white">Simulado concluído!</h1>
        <p className="mb-6 text-sm text-slate-400">
          Você acertou {acertos} de {questoes.length} questões ({pct}%), cobrindo {questoes.length} assuntos
          diferentes.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="btn-primary"
        >
          <RotateCcw className="h-4 w-4" />
          Refazer com novas questões
        </button>
      </div>
    );
  }

  const acertou = respondida && selecionada === questao.correta;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-soft">
        Simulado › {questao.categoriaNome} › {questao.subtopico}
      </p>
      <div className="mb-6 flex items-center justify-between">
        <DificuldadeBadge dificuldade={questao.dificuldade} />
        <span className="text-xs text-slate-400">
          Questão {indice + 1} de {questoes.length} · {acertos} acerto{acertos === 1 ? "" : "s"} até agora
        </span>
      </div>

      <p className="mb-4 text-lg leading-relaxed text-slate-50">{questao.enunciado}</p>

      <div className="mb-6 flex flex-col gap-3">
        {questao.alternativas.map((alt) => (
          <button
            key={alt.letra}
            onClick={() => escolher(alt.letra)}
            disabled={respondida}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${estiloAlternativa(alt.letra)}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold">
              {alt.letra}
            </span>
            <span className="text-sm text-slate-100">{alt.texto}</span>
          </button>
        ))}
      </div>

      {!respondida ? (
        <button
          onClick={responder}
          disabled={!selecionada}
          className="btn-primary"
        >
          Responder
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
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

          <div className="rounded-xl border border-l-2 border-accent/20 border-l-accent bg-gradient-to-b from-accent/[0.08] to-accent/[0.02] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-soft">
              Resolução comentada
            </p>
            <p className="text-sm text-slate-200">{questao.explicacao}</p>
            <p className="mt-3 font-mono text-xs font-medium uppercase tracking-wider text-emerald-400">
              Gabarito: {questao.correta}
            </p>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={proxima}
              className="btn-primary"
            >
              {ultima ? "Ver resultado" : "Próxima questão →"}
            </button>
          </div>
        </div>
      )}

      {celebracoes[0] && (
        <CelebracaoModal
          celebracao={celebracoes[0]}
          onFechar={() => setCelebracoes((c) => c.slice(1))}
        />
      )}
    </div>
  );
}
