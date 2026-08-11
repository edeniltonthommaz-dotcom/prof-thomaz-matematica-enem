import { notFound } from "next/navigation";
import { getCategoria } from "@/data/categorias";
import { questoesPorCategoria } from "@/lib/questions";
import { Dificuldade } from "@/lib/types";
import CategoriaExplorer from "@/components/CategoriaExplorer";

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{ dif?: string }>;
}) {
  const { categoria: categoriaId } = await params;
  const { dif } = await searchParams;
  const categoria = getCategoria(categoriaId);
  if (!categoria) notFound();

  const todas = questoesPorCategoria(categoriaId);
  const porDificuldade: Record<Dificuldade, typeof todas> = {
    facil: todas.filter((q) => q.dificuldade === "facil"),
    medio: todas.filter((q) => q.dificuldade === "medio"),
    dificil: todas.filter((q) => q.dificuldade === "dificil"),
  };
  const dificuldadeInicial: Dificuldade | undefined =
    dif === "facil" || dif === "medio" || dif === "dificil" ? dif : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {categoria.tier} · {categoria.pesoProva}
      </p>
      <h1 className="mb-2 text-3xl font-bold text-white">{categoria.nome}</h1>
      <p className="mb-8 max-w-2xl text-slate-400">{categoria.descricao}</p>
      <CategoriaExplorer categoria={categoria} porDificuldade={porDificuldade} dificuldadeInicial={dificuldadeInicial} />
    </div>
  );
}
