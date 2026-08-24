import { categorias } from "@/data/categorias";
import flashcards from "@/data/flashcards.json";
import FlashcardGrid from "@/components/FlashcardGrid";
import type { Flashcard } from "@/lib/types";

export default function FlashcardsPage() {
  const porCategoria = new Map<string, Flashcard[]>();
  for (const card of flashcards as Flashcard[]) {
    const lista = porCategoria.get(card.categoriaId);
    if (lista) lista.push(card);
    else porCategoria.set(card.categoriaId, [card]);
  }

  const grupos = categorias
    .filter((c) => porCategoria.has(c.id))
    .map((c) => ({
      categoriaId: c.id,
      categoriaNome: c.nome,
      cards: porCategoria.get(c.id)!,
    }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Flashcards</h1>
      <FlashcardGrid grupos={grupos} />
    </div>
  );
}
