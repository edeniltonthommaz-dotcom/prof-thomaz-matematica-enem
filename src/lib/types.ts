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
}

export interface Questao {
  id: string;
  categoriaId: string;
  subtopico: string;
  dificuldade: Dificuldade;
  fonte: Fonte;
  enunciado: string;
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
