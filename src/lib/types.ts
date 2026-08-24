export type Dificuldade = "facil" | "medio" | "dificil";

export type FonteTipo = "enem" | "inedita" | "banco";

export interface Fonte {
  tipo: FonteTipo;
  /** Ano da prova, apenas quando tipo === "enem" */
  ano?: number;
  /** Banca examinadora ou compilação de origem, apenas quando tipo === "banco" (ex: "QConcursos", "Fundação Sousândrade") */
  banca?: string;
  /** Ex: "ENEM 2015 - 2º dia, caderno azul, questão 143" */
  descricao?: string;
  /** URL do gabarito/prova oficial usado para verificar a questão, quando tipo === "enem" */
  url?: string;
}

export interface Alternativa {
  letra: "A" | "B" | "C" | "D" | "E";
  texto: string;
  /** Print da alternativa (ex: gráficos/figuras como opção), usado quando o texto sozinho não é fiel ao original */
  imagem?: string;
}

export interface Figura {
  /** Caminho em /public, ex: "/figuras/enem-2020-136.png" */
  src: string;
  alt: string;
  /** Legenda opcional exibida abaixo da imagem */
  legenda?: string;
}

export type DiagramaSolido =
  | { tipo: "paralelepipedo"; comprimento: number; largura: number; altura: number; unidade: string }
  | { tipo: "cilindro"; raio: number; altura: number; unidade: string }
  | { tipo: "cone"; raio: number; altura: number; unidade: string }
  | { tipo: "piramide"; ladoBase: number; altura: number; unidade: string }
  | { tipo: "esfera"; raio: number; unidade: string }
  | { tipo: "planificacao-caixa"; comprimento: number; largura: number; altura: number; unidade: string };

export type DiagramaGrafico =
  | { tipo: "barras"; titulo?: string; eixoY?: string; categorias: string[]; valores: number[] }
  | { tipo: "pizza"; titulo?: string; categorias: string[]; valores: number[] };

export type Diagrama = DiagramaSolido | DiagramaGrafico;

export interface Questao {
  id: string;
  categoriaId: string;
  subtopico: string;
  dificuldade: Dificuldade;
  fonte: Fonte;
  enunciado: string;
  /** Print de figura/gráfico/imagem do enunciado, quando não é possível recriar com fidelidade em texto */
  figura?: Figura;
  /** Diagrama (sólido geométrico ou gráfico) renderizado como SVG a partir de dados estruturados */
  diagrama?: Diagrama;
  alternativas: Alternativa[];
  correta: Alternativa["letra"];
  explicacao: string;
  /** Explicação específica de por que cada alternativa errada está incorreta (opcional, chave = letra) */
  distratores?: Partial<Record<Alternativa["letra"], string>>;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  pesoProva: string;
  tier: "Altíssima" | "Alta" | "Média" | "Média-Alta";
  subtopicos: string[];
}

export interface ResumoExemplo {
  enunciado: string;
  /** Passos da resolução, em ordem, cada item um passo curto */
  resolucao: string[];
}

export interface ResumoSubtopico {
  /** Deve bater exatamente com um item de Categoria.subtopicos */
  subtopico: string;
  /** Pontos-chave/fórmulas em texto curto, sem jargão de aula longa */
  pontos: string[];
  exemplo: ResumoExemplo;
}

export interface Resumo {
  categoriaId: string;
  subtopicos: ResumoSubtopico[];
}
