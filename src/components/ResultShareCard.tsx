"use client";

import { useState } from "react";
import type { EstatisticasGerais } from "@/lib/progress";

export default function ResultShareCard({
  nome,
  stats,
}: {
  nome: string;
  stats: EstatisticasGerais;
}) {
  const [copiado, setCopiado] = useState(false);

  if (stats.respondidas === 0) return null;

  const params = new URLSearchParams({
    nome,
    respondidas: String(stats.respondidas),
    acertos: String(stats.acertos),
    pct: String(stats.acertoPct ?? 0),
  });

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/desempenho/compartilhar?${params.toString()}`
      : "";

  const texto = `${nome} já respondeu ${stats.respondidas} questões de Matemática do ENEM e acertou ${stats.acertoPct}%! Treine também no Prof. Thomaz.`;

  const podeCompartilharNativo =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function compartilhar() {
    try {
      await navigator.share({ title: "Meu desempenho no Prof. Thomaz", text: texto, url });
    } catch {
      // usuário cancelou o share nativo — não é um erro
    }
  }

  async function copiarLink() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.12] to-accent/[0.02] p-6">
      <p className="text-sm text-slate-300">Compartilhe seu desempenho</p>
      <p className="mt-1 text-lg font-semibold text-white">
        {stats.acertoPct}% de acerto em {stats.respondidas} questões
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {podeCompartilharNativo && (
          <button
            onClick={compartilhar}
            className="rounded-full bg-accent-pale px-4 py-1.5 text-sm font-semibold text-accent-deep transition hover:bg-accent-soft"
          >
            Compartilhar
          </button>
        )}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
        >
          X (Twitter)
        </a>
        <button
          onClick={copiarLink}
          className="rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
        >
          {copiado ? "Link copiado!" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
