import { todasQuestoes } from "@/lib/questions";
import { categorias } from "@/data/categorias";
import { construirMapaQuestoesCompacto } from "@/lib/mapaQuestoes";
import FavoritosList from "@/components/FavoritosList";

export default function FavoritosPage() {
  const nomeCategoria = new Map(categorias.map((c) => [c.id, c.nome]));
  const mapaQuestoes = construirMapaQuestoesCompacto(todasQuestoes, nomeCategoria);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Favoritos</h1>
      <FavoritosList mapaQuestoes={mapaQuestoes} />
    </div>
  );
}
