import { todasQuestoes } from "./questions";
import type { Questao } from "./types";

export const TAMANHO_SIMULADO = 20;

/** Sorteia até TAMANHO_SIMULADO categorias distintas e 1 questão aleatória de cada, para garantir variedade real entre assuntos. */
export function selecionarSimulado(): Questao[] {
  const porCategoria = new Map<string, Questao[]>();
  for (const q of todasQuestoes) {
    const lista = porCategoria.get(q.categoriaId);
    if (lista) lista.push(q);
    else porCategoria.set(q.categoriaId, [q]);
  }

  const categorias = [...porCategoria.keys()];
  for (let i = categorias.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [categorias[i], categorias[j]] = [categorias[j], categorias[i]];
  }

  return categorias.slice(0, Math.min(TAMANHO_SIMULADO, categorias.length)).map((categoriaId) => {
    const lista = porCategoria.get(categoriaId)!;
    return lista[Math.floor(Math.random() * lista.length)];
  });
}
