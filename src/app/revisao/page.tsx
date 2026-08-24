import { todasQuestoes } from "@/lib/questions";
import { categorias } from "@/data/categorias";
import RevisaoList from "@/components/RevisaoList";

export default function RevisaoPage() {
  const nomeCategoria = new Map(categorias.map((c) => [c.id, c.nome]));
  const mapaQuestoes = Object.fromEntries(
    todasQuestoes.map((q) => [
      q.id,
      {
        categoriaId: q.categoriaId,
        categoriaNome: nomeCategoria.get(q.categoriaId) ?? q.categoriaId,
        subtopico: q.subtopico,
      },
    ])
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Revisão</h1>
      <RevisaoList mapaQuestoes={mapaQuestoes} />
    </div>
  );
}
