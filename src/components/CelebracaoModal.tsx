"use client";

import { useEffect, useRef } from "react";
import { Trophy, Flame, Star, CheckCircle2, type LucideIcon } from "lucide-react";
import type { Celebracao } from "@/lib/gamificacao";

function conteudo(celebracao: Celebracao): {
  icone: LucideIcon;
  rotulo: string;
  titulo: string;
  descricao: string;
} {
  switch (celebracao.tipo) {
    case "patente":
      return {
        icone: Trophy,
        rotulo: "Nova patente!",
        titulo: celebracao.patente.titulo,
        descricao: `Você alcançou a patente ${celebracao.patente.numero} de 10. Continue assim!`,
      };
    case "streak":
      return {
        icone: Flame,
        rotulo: "Sequência em chamas!",
        titulo: `${celebracao.dias} dias seguidos`,
        descricao: "Você está mantendo o ritmo de estudo. Não pare agora!",
      };
    case "conquista":
      return {
        icone: Star,
        rotulo: "Nova conquista!",
        titulo: celebracao.titulo,
        descricao: celebracao.descricao,
      };
    case "meta":
      return {
        icone: CheckCircle2,
        rotulo: "Meta batida!",
        titulo: `${celebracao.quantidade} questões hoje`,
        descricao: "Você bateu sua meta diária de estudo. Mandou bem!",
      };
  }
}

export default function CelebracaoModal({
  celebracao,
  onFechar,
}: {
  celebracao: Celebracao;
  onFechar: () => void;
}) {
  const { icone: Icone, rotulo, titulo, descricao } = conteudo(celebracao);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    botaoRef.current?.focus();
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebracao-titulo"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-accent/30 bg-[#0c1320] p-6 text-center shadow-2xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/12 text-accent-soft">
          <Icone className="h-8 w-8" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-soft">{rotulo}</p>
        <h2 id="celebracao-titulo" className="mt-1 text-2xl font-bold text-white">
          {titulo}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{descricao}</p>
        <button
          ref={botaoRef}
          onClick={onFechar}
          className="btn-primary mt-6 w-full"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
