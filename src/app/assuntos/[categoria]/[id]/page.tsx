import { notFound } from "next/navigation";
import { getCategoria } from "@/data/categorias";
import { getQuestao, questoesPorCategoriaEDificuldade } from "@/lib/questions";
import QuizPlayer from "@/components/QuizPlayer";

export default async function QuestaoPage({
  params,
}: {
  params: Promise<{ categoria: string; id: string }>;
}) {
  const { categoria: categoriaId, id } = await params;
  const categoria = getCategoria(categoriaId);
  const questao = getQuestao(id);
  if (!categoria || !questao || questao.categoriaId !== categoriaId) notFound();

  const grupo = questoesPorCategoriaEDificuldade(categoriaId, questao.dificuldade);
  const index = grupo.findIndex((q) => q.id === questao.id);

  return (
    <QuizPlayer
      questao={questao}
      categoriaId={categoriaId}
      categoriaNome={categoria.nome}
      prevId={index > 0 ? grupo[index - 1].id : undefined}
      nextId={index < grupo.length - 1 ? grupo[index + 1].id : undefined}
      posicao={index + 1}
      total={grupo.length}
    />
  );
}
