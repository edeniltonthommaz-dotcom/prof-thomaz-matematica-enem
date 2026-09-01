import { Resumo } from "@/lib/types";

export default function ResumoView({ resumo }: { resumo: Resumo | undefined }) {
  if (!resumo || resumo.subtopicos.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        O resumo de teoria deste assunto ainda está sendo escrito.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {resumo.subtopicos.map((s) => (
        <div key={s.subtopico} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-3 text-lg font-semibold text-white">{s.subtopico}</h3>
          <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
            {s.pontos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          <div className="rounded-md bg-black/20 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-soft">Exemplo resolvido</p>
            <p className="mb-3 text-sm text-slate-200">{s.exemplo.enunciado}</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
              {s.exemplo.resolucao.map((passo, i) => (
                <li key={i}>{passo}</li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}
