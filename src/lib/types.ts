export type Dificuldade = "facil" | "medio" | "dificil";

export type FonteTipo = "enem" | "inedita";

export interface Fonte {
  tipo: FonteTipo;
  /** Ano da prova, apenas quando tipo === "enem" */
  ano?: number;
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

export interface Questao {
  id: string;
  categoriaId: string;
  subtopico: string;
  dificuldade: Dificuldade;
  fonte: Fonte;
  enunciado: string;
  /** Print de figura/gráfico/imagem do enunciado, quando não é possível recriar com fidelidade em texto */
  figura?: Figura;
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
