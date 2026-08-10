import { Questao, Dificuldade } from "@/lib/types";
import numeros from "@/data/questions/numeros.json";
import porcentagem from "@/data/questions/porcentagem.json";
import razaoProporcao from "@/data/questions/razao-proporcao.json";
import regraDeTres from "@/data/questions/regra-de-tres.json";
import equacoes from "@/data/questions/equacoes.json";
import funcaoAfim from "@/data/questions/funcao-afim.json";
import funcaoQuadratica from "@/data/questions/funcao-quadratica.json";
import exponenciaisLogaritmos from "@/data/questions/exponenciais-logaritmos.json";
import progressoes from "@/data/questions/progressoes.json";
import geometriaPlana from "@/data/questions/geometria-plana.json";
import geometriaEspacial from "@/data/questions/geometria-espacial.json";
import geometriaAnalitica from "@/data/questions/geometria-analitica.json";
import trigonometria from "@/data/questions/trigonometria.json";
import estatistica from "@/data/questions/estatistica.json";
import probabilidade from "@/data/questions/probabilidade.json";
import analiseCombinatoria from "@/data/questions/analise-combinatoria.json";
import matematicaFinanceira from "@/data/questions/matematica-financeira.json";
import matrizes from "@/data/questions/matrizes.json";
import logica from "@/data/questions/logica.json";
import real from "@/data/questions/real.json";

export const todasQuestoes: Questao[] = [
  ...(numeros as Questao[]),
  ...(porcentagem as Questao[]),
  ...(razaoProporcao as Questao[]),
  ...(regraDeTres as Questao[]),
  ...(equacoes as Questao[]),
  ...(funcaoAfim as Questao[]),
  ...(funcaoQuadratica as Questao[]),
  ...(exponenciaisLogaritmos as Questao[]),
  ...(progressoes as Questao[]),
  ...(geometriaPlana as Questao[]),
  ...(geometriaEspacial as Questao[]),
  ...(geometriaAnalitica as Questao[]),
  ...(trigonometria as Questao[]),
  ...(estatistica as Questao[]),
  ...(probabilidade as Questao[]),
  ...(analiseCombinatoria as Questao[]),
  ...(matematicaFinanceira as Questao[]),
  ...(matrizes as Questao[]),
  ...(logica as Questao[]),
  ...(real as Questao[]),
];

export function questoesPorCategoria(categoriaId: string): Questao[] {
  return todasQuestoes.filter((q) => q.categoriaId === categoriaId);
}

export function questoesPorCategoriaEDificuldade(categoriaId: string, dificuldade: Dificuldade): Questao[] {
  return todasQuestoes.filter((q) => q.categoriaId === categoriaId && q.dificuldade === dificuldade);
}

export function getQuestao(id: string): Questao | undefined {
  return todasQuestoes.find((q) => q.id === id);
}

export function contagemPorDificuldade(categoriaId: string): Record<Dificuldade, number> {
  const lista = questoesPorCategoria(categoriaId);
  return {
    facil: lista.filter((q) => q.dificuldade === "facil").length,
    medio: lista.filter((q) => q.dificuldade === "medio").length,
    dificil: lista.filter((q) => q.dificuldade === "dificil").length,
  };
}

export function contagemReaisPorAno(): Record<number, number> {
  const out: Record<number, number> = {};
  for (const q of todasQuestoes) {
    if (q.fonte.tipo === "enem" && q.fonte.ano) {
      out[q.fonte.ano] = (out[q.fonte.ano] ?? 0) + 1;
    }
  }
  return out;
}
