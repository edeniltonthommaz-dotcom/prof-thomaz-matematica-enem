import { categorias } from "@/data/categorias";
import { questoesPorCategoria, todasQuestoes } from "@/lib/questions";
import CategoryCard from "@/components/CategoryCard";

export const metadata = { title: "Questões por Assunto — Prof. Thomaz" };

export default function AssuntosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {categorias.length} categorias de Matemática do ENEM
      </p>
      <h1 className="mb-2 text-3xl font-bold text-white">Questões por Assunto</h1>
      <p className="mb-8 max-w-2xl text-slate-400">
        Pratique tópicos específicos, monitore sua taxa de acertos e domine cada
        conteúdo. Banco com {todasQuestoes.length} questões no total.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((c) => (
          <CategoryCard key={c.id} categoria={c} questaoIds={questoesPorCategoria(c.id).map((q) => q.id)} />
        ))}
      </div>
    </div>
  );
}
