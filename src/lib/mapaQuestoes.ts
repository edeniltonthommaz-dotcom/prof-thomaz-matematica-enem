export interface InfoQuestao {
  categoriaId: string;
  categoriaNome: string;
  subtopico: string;
}

export interface MapaQuestoesCompacto {
  categorias: [id: string, nome: string][];
  subtopicos: string[];
  questoes: Record<string, [categoriaIdx: number, subtopicoIdx: number]>;
}

export function construirMapaQuestoesCompacto(
  questoes: { id: string; categoriaId: string; subtopico: string }[],
  nomePorCategoria: Map<string, string>
): MapaQuestoesCompacto {
  const catIndex = new Map<string, number>();
  const categorias: [string, string][] = [];
  const subIndex = new Map<string, number>();
  const subtopicos: string[] = [];
  const mapaQuestoes: Record<string, [number, number]> = {};

  for (const q of questoes) {
    let ci = catIndex.get(q.categoriaId);
    if (ci === undefined) {
      ci = categorias.length;
      catIndex.set(q.categoriaId, ci);
      categorias.push([q.categoriaId, nomePorCategoria.get(q.categoriaId) ?? q.categoriaId]);
    }
    let si = subIndex.get(q.subtopico);
    if (si === undefined) {
      si = subtopicos.length;
      subIndex.set(q.subtopico, si);
      subtopicos.push(q.subtopico);
    }
    mapaQuestoes[q.id] = [ci, si];
  }

  return { categorias, subtopicos, questoes: mapaQuestoes };
}

export function resolverInfoQuestao(mapa: MapaQuestoesCompacto, id: string): InfoQuestao | undefined {
  const par = mapa.questoes[id];
  if (!par) return undefined;
  const [categoriaId, categoriaNome] = mapa.categorias[par[0]];
  return { categoriaId, categoriaNome, subtopico: mapa.subtopicos[par[1]] };
}
