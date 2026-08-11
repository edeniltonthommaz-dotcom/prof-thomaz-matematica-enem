import Link from "next/link";
import { categorias } from "@/data/categorias";
import { todasQuestoes, contagemReaisPorAno } from "@/lib/questions";
import HomeStats from "@/components/HomeStats";

export default function Home() {
  const anos = Object.keys(contagemReaisPorAno()).map(Number).sort();
  const totalReais = todasQuestoes.filter((q) => q.fonte.tipo === "enem").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-900 p-8">
        <p className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
          {todasQuestoes.length}+ questões · {categorias.length} categorias oficiais do ENEM
        </p>
        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Prof. Thomaz — Matemática ENEM</h1>
        <p className="mb-6 max-w-2xl text-gray-300">
          Pratique com questões organizadas por assunto e nível de dificuldade,
          responda e receba feedback imediato: certo ou errado, com a explicação
          de cada erro e a alternativa correta.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/assuntos" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">
            Explorar por Assunto →
          </Link>
          <Link href="/dificuldade" className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20">
            Explorar por Dificuldade
          </Link>
          <Link href="/aleatoria" className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20">
            Questão Aleatória
          </Link>
        </div>
      </section>

      <HomeStats questaoIds={todasQuestoes.map((q) => q.id)} />

      <section className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="mb-1 text-sm font-semibold text-white">Origem das questões</p>
        <p className="text-sm text-slate-400">
          {totalReais > 0
            ? `${totalReais} questões reais de provas do ENEM (${anos.join(", ")}) e ${todasQuestoes.length - totalReais} questões inéditas geradas para completar o banco por assunto e dificuldade.`
            : `Banco atualmente composto por ${todasQuestoes.length} questões inéditas (estilo ENEM), geradas para cobrir todos os assuntos e níveis de dificuldade. Questões reais de provas passadas serão adicionadas e claramente identificadas com o ano de origem assim que verificadas.`}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-white">Assuntos em destaque</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/assuntos/${c.id}`}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 hover:bg-white/[0.06]"
            >
              {c.nome} <span className="text-xs text-slate-500">({c.pesoProva})</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
