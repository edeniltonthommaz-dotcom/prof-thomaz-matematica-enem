import { Resumo } from "@/lib/types";
import numeros from "@/data/resumos/numeros.json";
import porcentagem from "@/data/resumos/porcentagem.json";
import razaoProporcao from "@/data/resumos/razao-proporcao.json";
import regraDeTres from "@/data/resumos/regra-de-tres.json";
import equacoes from "@/data/resumos/equacoes.json";
import funcaoAfim from "@/data/resumos/funcao-afim.json";
import funcaoQuadratica from "@/data/resumos/funcao-quadratica.json";
import exponenciaisLogaritmos from "@/data/resumos/exponenciais-logaritmos.json";
import progressoes from "@/data/resumos/progressoes.json";
import geometriaPlana from "@/data/resumos/geometria-plana.json";
import geometriaEspacial from "@/data/resumos/geometria-espacial.json";
import geometriaAnalitica from "@/data/resumos/geometria-analitica.json";
import trigonometria from "@/data/resumos/trigonometria.json";
import estatistica from "@/data/resumos/estatistica.json";
import probabilidade from "@/data/resumos/probabilidade.json";
import analiseCombinatoria from "@/data/resumos/analise-combinatoria.json";
import matematicaFinanceira from "@/data/resumos/matematica-financeira.json";
import matrizes from "@/data/resumos/matrizes.json";
import logica from "@/data/resumos/logica.json";
import conjuntos from "@/data/resumos/conjuntos.json";

const todosResumos: Resumo[] = [
  numeros,
  porcentagem,
  razaoProporcao,
  regraDeTres,
  equacoes,
  funcaoAfim,
  funcaoQuadratica,
  exponenciaisLogaritmos,
  progressoes,
  geometriaPlana,
  geometriaEspacial,
  geometriaAnalitica,
  trigonometria,
  estatistica,
  probabilidade,
  analiseCombinatoria,
  matematicaFinanceira,
  matrizes,
  logica,
  conjuntos,
] as Resumo[];

export function getResumo(categoriaId: string): Resumo | undefined {
  return todosResumos.find((r) => r.categoriaId === categoriaId);
}
