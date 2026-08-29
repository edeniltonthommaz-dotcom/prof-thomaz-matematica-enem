import { randInt, randFloat, pick, shuffle, brl, pct, makeQuestao, gcd } from "./helpers.mjs";

function mmc(a, b) {
  return (a * b) / gcd(a, b);
}
function toSci(value) {
  const s = value.toExponential();
  const [mStr, eStr] = s.split("e");
  return { mantissa: Number(mStr), exp: Number(eStr.replace("+", "")) };
}
function fmtSci(mantissa, exp, unidade) {
  const mStr = mantissa.toString().replace(".", ",").replace("-", "-");
  return `${mStr} · 10^${exp} ${unidade}`;
}

// ---------- NUMEROS ----------
function numFracaoOperacoes(dificuldade) {
  const contextos = [
    ["reservatório de água", "litros"],
    ["tanque de combustível", "litros"],
    ["saco de cimento em um estoque", "kg"],
    ["rolo de fio elétrico", "metros"],
  ];
  const [objeto, unidade] = pick(contextos);
  const denoms = dificuldade === "facil" ? [2, 4, 5] : dificuldade === "medio" ? [3, 4, 5, 8] : [5, 6, 8, 10];
  let d1 = pick(denoms), d2 = pick(denoms);
  let n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
  if (n1 * d2 <= n2 * d1) { [n1, d1, n2, d2] = [n2, d2, n1, d1]; }
  if (n1 * d2 <= n2 * d1) { n2 = 1; d2 = d1 * 2; n1 = d1 - 1; }
  const base = mmc(d1, d2);
  const total = base * randInt(2, 8) * 10;
  const inicial = (total * n1) / d1;
  const removido = (total * n2) / d2;
  const restante = inicial - removido;
  const correctText = `${restante} ${unidade}`;
  const distractorTexts = [
    `${inicial} ${unidade}`,
    `${total - inicial} ${unidade}`,
    `${removido} ${unidade}`,
    `${total} ${unidade}`,
  ];
  return makeQuestao({
    categoriaId: "numeros",
    subtopico: "Operações com Frações",
    dificuldade,
    enunciado: `Um(a) ${objeto} tem capacidade total de ${total} ${unidade} e está com ${n1}/${d1} de sua capacidade. Em seguida, foram retirados ${n2}/${d2} da capacidade total do recipiente. Quantos ${unidade} restaram?`,
    correctText,
    distractorTexts,
    explicacao: `A quantidade inicial é ${n1}/${d1} de ${total} = ${inicial} ${unidade}. A quantidade retirada é ${n2}/${d2} de ${total} = ${removido} ${unidade}. Logo, o restante é ${inicial} − ${removido} = ${restante} ${unidade}.`,
  });
}

function numNotacaoCientifica(dificuldade) {
  const pares = [
    { de: "km", para: "m", exp: 3, grandeza: "distância" },
    { de: "m", para: "cm", exp: 2, grandeza: "comprimento" },
    { de: "kg", para: "g", exp: 3, grandeza: "massa" },
    { de: "g", para: "mg", exp: 3, grandeza: "massa" },
    { de: "km", para: "mm", exp: 6, grandeza: "distância" },
    { de: "ton", para: "kg", exp: 3, grandeza: "massa" },
  ];
  const p = dificuldade === "dificil" ? pares[4] : pick(pares);
  const baseInt = randInt(100, 999);
  const baseDec = randInt(0, 9);
  const baseValue = baseInt + baseDec / 10;
  const finalValue = baseValue * Math.pow(10, p.exp);
  const { mantissa, exp } = toSci(finalValue);
  const correctText = fmtSci(mantissa, exp, p.para);
  const distractorTexts = [
    fmtSci(mantissa, exp + 1, p.para),
    fmtSci(mantissa, exp - 1, p.para),
    fmtSci(mantissa, exp + 2, p.para),
    fmtSci(toSci(baseValue).mantissa, toSci(baseValue).exp, p.de),
  ];
  return makeQuestao({
    categoriaId: "numeros",
    subtopico: "Notação Científica e Escalas",
    dificuldade,
    enunciado: `Uma medida de ${p.grandeza} é de aproximadamente ${baseValue.toString().replace(".", ",")} ${p.de}. Qual é essa medida em ${p.para}, escrita em notação científica (na forma a · 10^k, onde 1 ≤ a < 10 e k é um número inteiro)?`,
    correctText,
    distractorTexts,
    explicacao: `1 ${p.de} = 10^${p.exp} ${p.para}. Então ${baseValue.toString().replace(".", ",")} ${p.de} = ${finalValue.toLocaleString("pt-BR")} ${p.para}. Deslocando a vírgula até obter um único dígito antes dela: ${correctText}.`,
  });
}

// ---------- PORCENTAGEM ----------
function pctAumentoDesconto(dificuldade) {
  const precoBase = randInt(dificuldade === "facil" ? 20 : 50, dificuldade === "dificil" ? 900 : 400) * 10;
  const aumento = pick(dificuldade === "facil" ? [10, 20, 25, 50] : [8, 12, 15, 18, 22, 30]);
  const desconto = pick(dificuldade === "facil" ? [10, 20] : [5, 10, 12, 15, 20, 25]);
  const apos1 = precoBase * (1 + aumento / 100);
  const final = Math.round(apos1 * (1 - desconto / 100) * 100) / 100;
  const correctText = brl(final);
  const distractorTexts = [
    brl(precoBase),
    brl(Math.round(precoBase * (1 + (aumento - desconto) / 100) * 100) / 100),
    brl(apos1),
    brl(Math.round(precoBase * (1 - desconto / 100) * (1 + aumento / 100) * 100) / 100 + 0.01),
  ];
  return makeQuestao({
    categoriaId: "porcentagem",
    subtopico: "Aumentos e Descontos Sucessivos",
    dificuldade,
    enunciado: `Um produto custava ${brl(precoBase)}. Após um aumento de ${pct(aumento)}, a loja aplicou uma promoção com desconto de ${pct(desconto)} sobre o novo preço. Qual o preço final do produto?`,
    correctText,
    distractorTexts,
    explicacao: `Após o aumento: ${brl(precoBase)} × (1 + ${aumento}/100) = ${brl(Math.round(apos1 * 100) / 100)}. Aplicando o desconto: ${brl(Math.round(apos1 * 100) / 100)} × (1 − ${desconto}/100) = ${correctText}.`,
  });
}

function pctJurosSimples(dificuldade) {
  const capital = randInt(dificuldade === "facil" ? 10 : 30, dificuldade === "dificil" ? 200 : 100) * 100;
  const taxaMensal = pick([1, 1.5, 2, 2.5, 3, 4, 5]);
  const meses = randInt(dificuldade === "facil" ? 2 : 3, dificuldade === "dificil" ? 18 : 10);
  const juros = Math.round(capital * (taxaMensal / 100) * meses * 100) / 100;
  const montante = Math.round((capital + juros) * 100) / 100;
  const correctText = brl(montante);
  const distractorTexts = [
    brl(juros),
    brl(capital),
    brl(Math.round((capital + juros * 2) * 100) / 100),
    brl(Math.round(capital * (1 + (taxaMensal / 100) * (meses + 1)) * 100) / 100),
  ];
  return makeQuestao({
    categoriaId: "porcentagem",
    subtopico: "Juros Simples e Compostos",
    dificuldade,
    enunciado: `Um capital de ${brl(capital)} foi aplicado a juros simples de ${pct(taxaMensal)} ao mês, durante ${meses} meses. Qual o montante (capital + juros) ao final do período?`,
    correctText,
    distractorTexts,
    explicacao: `Juros = C × i × t = ${brl(capital)} × ${taxaMensal}/100 × ${meses} = ${brl(juros)}. Montante = Capital + Juros = ${brl(capital)} + ${brl(juros)} = ${correctText}.`,
  });
}

// ---------- RAZAO E PROPORCAO ----------
function razaoEscalaMapa(dificuldade) {
  const escalaDen = pick(dificuldade === "facil" ? [100, 1000] : dificuldade === "dificil" ? [250000, 500000, 1000000] : [10000, 25000, 50000]);
  const distMapaCm = randInt(2, 40);
  const distRealCm = distMapaCm * escalaDen;
  const distRealKm = distRealCm / 100000;
  const correctText = `${Number(distRealKm.toFixed(2))} km`;
  const distractorTexts = [
    `${Number((distRealKm * 10).toFixed(2))} km`,
    `${Number((distRealKm / 10).toFixed(2))} km`,
    `${distMapaCm} km`,
    `${Number((distRealCm / 1000).toFixed(2))} km`,
  ];
  return makeQuestao({
    categoriaId: "razao-proporcao",
    subtopico: "Escalas (Comprimento, Área e Volume)",
    dificuldade,
    enunciado: `Em um mapa de escala 1:${escalaDen.toLocaleString("pt-BR")}, a distância entre duas cidades é de ${distMapaCm} cm. Qual é a distância real entre essas cidades, em quilômetros?`,
    correctText,
    distractorTexts,
    explicacao: `Distância real = ${distMapaCm} cm × ${escalaDen} = ${distRealCm.toLocaleString("pt-BR")} cm. Convertendo para km (÷100.000): ${correctText}.`,
  });
}

function razaoDivisaoProporcional(dificuldade) {
  const opcoes =
    dificuldade === "facil" ? [[1, 2, 3], [1, 1, 2], [1, 2, 2]]
    : dificuldade === "dificil" ? [[2, 3, 7], [3, 4, 5], [1, 5, 6], [4, 5, 7]]
    : [[2, 3, 5], [1, 3, 4], [2, 2, 3]];
  const partes = pick(opcoes);
  const somaPartes = partes.reduce((a, b) => a + b, 0);
  const cota = randInt(5, 40) * (dificuldade === "dificil" ? 20 : 10);
  const total = cota * somaPartes;
  const valores = partes.map((p) => p * cota);
  const maior = Math.max(...valores);
  const correctText = brl(maior);
  const distractorTexts = [brl(total / partes.length), brl(Math.min(...valores)), brl(total), brl(cota)];
  return makeQuestao({
    categoriaId: "razao-proporcao",
    subtopico: "Divisão Proporcional",
    dificuldade,
    enunciado: `Três sócios vão dividir um lucro de ${brl(total)} de forma diretamente proporcional aos valores investidos por cada um, na razão ${partes.join(" : ")}. Qual o valor recebido pelo sócio que investiu mais?`,
    correctText,
    distractorTexts,
    explicacao: `A soma das partes da razão é ${somaPartes}. Cada parte vale ${brl(total)} ÷ ${somaPartes} = ${brl(cota)}. O sócio com maior proporção (${Math.max(...partes)}) recebe ${Math.max(...partes)} × ${brl(cota)} = ${correctText}.`,
  });
}

// ---------- REGRA DE TRES ----------
function regraTresSimples(dificuldade) {
  const receitaPessoas = pick([2, 4, 6]);
  const receitaIngrediente = randInt(dificuldade === "facil" ? 1 : 2, dificuldade === "dificil" ? 12 : 6) * 50;
  const novaPessoas = receitaPessoas * pick([2, 3, 1.5]);
  const novoIngrediente = (receitaIngrediente / receitaPessoas) * novaPessoas;
  const correctText = `${novoIngrediente} g`;
  const distractorTexts = [
    `${receitaIngrediente} g`,
    `${receitaIngrediente + novoIngrediente} g`,
    `${novoIngrediente / 2} g`,
    `${novoIngrediente * 2} g`,
  ];
  return makeQuestao({
    categoriaId: "regra-de-tres",
    subtopico: "Regra de Três Simples",
    dificuldade,
    enunciado: `Uma receita para ${receitaPessoas} pessoas usa ${receitaIngrediente} g de farinha. Mantendo a mesma proporção, quantos gramas de farinha são necessários para ${novaPessoas} pessoas?`,
    correctText,
    distractorTexts,
    explicacao: `Como a grandeza é diretamente proporcional: ${receitaPessoas} pessoas → ${receitaIngrediente} g; ${novaPessoas} pessoas → x. x = (${receitaIngrediente} × ${novaPessoas}) ÷ ${receitaPessoas} = ${correctText}.`,
  });
}

function regraTresComposta(dificuldade) {
  const op1 = randInt(2, dificuldade === "dificil" ? 12 : 6);
  const dias1 = randInt(2, dificuldade === "dificil" ? 20 : 10);
  const pecas1 = op1 * dias1 * randInt(3, 8);
  const op2 = op1 + randInt(1, 4);
  const pecas2 = pecas1 * pick([1.5, 2]);
  const diasNecessarios = (pecas2 * op1 * dias1) / (pecas1 * op2);
  const diasArred = Math.round(diasNecessarios * 10) / 10;
  const correctText = `${diasArred} dias`;
  const distractorTexts = [`${dias1} dias`, `${Math.round(diasArred * 2 * 10) / 10} dias`, `${Math.round((diasArred / 2) * 10) / 10} dias`, `${dias1 + op2} dias`];
  return makeQuestao({
    categoriaId: "regra-de-tres",
    subtopico: "Regra de Três Composta",
    dificuldade,
    enunciado: `Uma fábrica com ${op1} operários produz ${pecas1} peças em ${dias1} dias. Trabalhando no mesmo ritmo, quantos dias ${op2} operários levariam para produzir ${pecas2} peças?`,
    correctText,
    distractorTexts,
    explicacao: `Peças por operário-dia = ${pecas1} ÷ (${op1} × ${dias1}). Para ${op2} operários produzirem ${pecas2} peças: dias = (${pecas2} × ${op1} × ${dias1}) ÷ (${pecas1} × ${op2}) = ${correctText}.`,
  });
}

// ---------- EQUACOES ----------
function eqSistemaLinear(dificuldade) {
  const precoA = randInt(dificuldade === "facil" ? 2 : 5, dificuldade === "dificil" ? 60 : 30);
  const precoB = precoA + randInt(1, 15);
  const qtdA1 = randInt(2, 8), qtdB1 = randInt(2, 8);
  const total1 = qtdA1 * precoA + qtdB1 * precoB;
  const qtdA2 = randInt(2, 8), qtdB2 = randInt(2, 8);
  const total2 = qtdA2 * precoA + qtdB2 * precoB;
  const correctText = brl(precoB);
  const distractorTexts = [brl(precoA), brl(precoA + precoB), brl(Math.abs(precoB - precoA)), brl(precoB + 5)];
  return makeQuestao({
    categoriaId: "equacoes",
    subtopico: "Sistemas de Equações 2x2",
    dificuldade,
    enunciado: `Na cantina de uma escola, ${qtdA1} salgados e ${qtdB1} sucos custam juntos ${brl(total1)}, enquanto ${qtdA2} salgados e ${qtdB2} sucos custam ${brl(total2)}. Qual é o preço de um suco?`,
    correctText,
    distractorTexts,
    explicacao: `Resolvendo o sistema {${qtdA1}a + ${qtdB1}b = ${total1}; ${qtdA2}a + ${qtdB2}b = ${total2}} obtém-se o preço do salgado a = ${brl(precoA)} e do suco b = ${correctText}.`,
  });
}

function eqBhaskaraArea(dificuldade) {
  const largura = randInt(dificuldade === "facil" ? 3 : 5, dificuldade === "dificil" ? 25 : 15);
  const acrescimo = randInt(2, 10);
  const comprimento = largura + acrescimo;
  const area = largura * comprimento;
  const correctText = `${largura} m`;
  const distractorTexts = [`${comprimento} m`, `${largura + acrescimo * 2} m`, `${Math.max(1, largura - 2)} m`, `${area} m`];
  return makeQuestao({
    categoriaId: "equacoes",
    subtopico: "Equações Quadráticas (Bhaskara)",
    dificuldade,
    enunciado: `Um terreno retangular tem comprimento ${acrescimo} m maior que a largura. Sabendo que a área do terreno é ${area} m², qual é a medida da largura?`,
    correctText,
    distractorTexts,
    explicacao: `Chamando a largura de x, temos x(x + ${acrescimo}) = ${area}, ou seja x² + ${acrescimo}x − ${area} = 0. Resolvendo por Bhaskara, a raiz positiva é x = ${largura} m.`,
  });
}

// ---------- FUNCAO AFIM ----------
function afimTarifa(dificuldade) {
  const fixo = randInt(dificuldade === "facil" ? 2 : 4, dificuldade === "dificil" ? 15 : 10);
  const porKm = randFloat(dificuldade === "facil" ? 0.5 : 1, dificuldade === "dificil" ? 6 : 3.5, 2);
  const km = randInt(5, dificuldade === "dificil" ? 60 : 30);
  const total = Math.round((fixo + porKm * km) * 100) / 100;
  const correctText = brl(total);
  const distractorTexts = [brl(Math.round(porKm * km * 100) / 100), brl(fixo), brl(Math.round((fixo + porKm * (km + 5)) * 100) / 100), brl(Math.round((fixo * 2 + porKm * km) * 100) / 100)];
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "Tarifas e Planos",
    dificuldade,
    enunciado: `Um aplicativo de transporte cobra uma tarifa fixa de ${brl(fixo)} mais ${brl(porKm)} por quilômetro rodado. Qual será o valor cobrado em uma corrida de ${km} km?`,
    correctText,
    distractorTexts,
    explicacao: `O custo é dado por C(x) = ${brl(fixo)} + ${brl(porKm)} × x. Para x = ${km}: C(${km}) = ${brl(fixo)} + ${brl(porKm)} × ${km} = ${correctText}.`,
  });
}

function afimCoeficiente(dificuldade) {
  const x1 = randInt(0, 5), x2 = x1 + randInt(2, 8);
  const a = randInt(dificuldade === "facil" ? 2 : 3, dificuldade === "dificil" ? 20 : 10);
  const b = randInt(1, 20);
  const y1 = a * x1 + b, y2 = a * x2 + b;
  const correctText = `${a}`;
  const distractorTexts = [`${-a}`, `${b}`, `${a + b}`, `${Math.round((y2 - y1) / (x2 - x1 + 1))}`];
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "Coeficiente Angular",
    dificuldade,
    enunciado: `Uma função afim f(x) = ax + b passa pelos pontos (${x1}, ${y1}) e (${x2}, ${y2}). Qual é o valor do coeficiente angular a?`,
    correctText,
    distractorTexts,
    explicacao: `O coeficiente angular é a = (y₂ − y₁) / (x₂ − x₁) = (${y2} − ${y1}) / (${x2} − ${x1}) = ${correctText}.`,
  });
}

// ---------- FUNCAO QUADRATICA ----------
function quadVertice(dificuldade, tentativa = 0) {
  const precoBase = randInt(dificuldade === "facil" ? 10 : 20, dificuldade === "dificil" ? 100 : 50);
  const vendaBase = randInt(dificuldade === "facil" ? 50 : 80, dificuldade === "dificil" ? 400 : 200);
  const sensibilidade = pick([2, 4, 5, 10]);
  // Receita(x) = (precoBase + x) * (vendaBase - sensibilidade*x), x = aumento de preço
  const xVerticeRaw = (vendaBase - sensibilidade * precoBase) / (2 * sensibilidade);
  if (xVerticeRaw < 1 && tentativa < 30) return quadVertice(dificuldade, tentativa + 1);
  const xVertice = Math.round(xVerticeRaw);
  const precoOtimo = precoBase + xVertice;
  const lucroMax = precoOtimo * (vendaBase - sensibilidade * xVertice);
  const correctText = brl(precoOtimo);
  const distractorTexts = [brl(precoBase), brl(precoOtimo + sensibilidade), brl(Math.max(1, precoOtimo - sensibilidade)), brl(Math.round(lucroMax))];
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Pontos de Máximo e Mínimo",
    dificuldade,
    enunciado: `Uma loja vende ${vendaBase} unidades de um produto por mês ao preço de ${brl(precoBase)}. Estudos mostram que, a cada ${brl(1)} de aumento no preço, ${sensibilidade} unidades deixam de ser vendidas por mês. Qual deve ser o preço de venda para maximizar a receita mensal?`,
    correctText,
    distractorTexts,
    explicacao: `Sendo x o aumento no preço, a receita é R(x) = (${precoBase} + x)(${vendaBase} − ${sensibilidade}x), uma função quadrática com concavidade para baixo. O máximo ocorre no vértice, em x = ${xVertice}, resultando no preço ótimo de ${correctText}.`,
  });
}

function quadTrajetoria(dificuldade) {
  const a = -1 * pick([1, 2, 5]);
  const b = randInt(dificuldade === "facil" ? 10 : 20, dificuldade === "dificil" ? 100 : 60);
  const tVertice = -b / (2 * a);
  const hMax = a * tVertice * tVertice + b * tVertice;
  if (!Number.isInteger(tVertice) || !Number.isInteger(hMax)) return quadTrajetoria(dificuldade);
  const correctText = `${hMax} m`;
  const distractorTexts = [`${b} m`, `${Math.round(hMax / 2)} m`, `${hMax + b} m`, `${tVertice} m`];
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Vértice da Parábola",
    dificuldade,
    enunciado: `A altura h, em metros, de um projétil em função do tempo t, em segundos, é dada por h(t) = ${a}t² + ${b}t. Qual é a altura máxima atingida pelo projétil?`,
    correctText,
    distractorTexts,
    explicacao: `O tempo do ponto de máximo é t = −b/(2a) = −${b}/(2×${a}) = ${tVertice} s. Substituindo: h(${tVertice}) = ${a}×${tVertice}² + ${b}×${tVertice} = ${correctText}.`,
  });
}

// ---------- EXPONENCIAIS E LOGARITMOS ----------
function expCrescimento(dificuldade) {
  const inicial = randInt(dificuldade === "facil" ? 100 : 500, dificuldade === "dificil" ? 5000 : 2000);
  const taxa = pick([10, 20, 25, 50, 100]);
  const periodos = randInt(2, dificuldade === "dificil" ? 6 : 4);
  const final = Math.round(inicial * Math.pow(1 + taxa / 100, periodos));
  const correctText = `${final.toLocaleString("pt-BR")} indivíduos`;
  const distractorTexts = [
    `${Math.round(inicial * (1 + (taxa / 100) * periodos)).toLocaleString("pt-BR")} indivíduos`,
    `${inicial.toLocaleString("pt-BR")} indivíduos`,
    `${Math.round(inicial * Math.pow(1 + taxa / 100, periodos + 1)).toLocaleString("pt-BR")} indivíduos`,
    `${Math.round(inicial * Math.pow(1 + taxa / 100, periodos - 1)).toLocaleString("pt-BR")} indivíduos`,
  ];
  return makeQuestao({
    categoriaId: "exponenciais-logaritmos",
    subtopico: "Crescimento e Decaimento",
    dificuldade,
    enunciado: `Uma colônia de bactérias tem inicialmente ${inicial.toLocaleString("pt-BR")} indivíduos e cresce a uma taxa de ${pct(taxa)} a cada hora. Qual será, aproximadamente, o número de indivíduos após ${periodos} horas?`,
    correctText,
    distractorTexts,
    explicacao: `O crescimento é exponencial: N(t) = N₀ × (1 + taxa)^t = ${inicial} × (1 + ${taxa}/100)^${periodos} ≈ ${correctText}.`,
  });
}

function expMeiaVida(dificuldade) {
  const inicial = pick([800, 1600, 3200, 6400, 12800]);
  const meiasVidas = randInt(2, dificuldade === "dificil" ? 6 : 4);
  const restante = inicial / Math.pow(2, meiasVidas);
  const correctText = `${restante} g`;
  const distractorTexts = [`${inicial / meiasVidas} g`, `${restante * 2} g`, `${restante / 2} g`, `${inicial} g`];
  return makeQuestao({
    categoriaId: "exponenciais-logaritmos",
    subtopico: "Meia-Vida Radioativa",
    dificuldade,
    enunciado: `Uma substância radioativa tem meia-vida de 1 ano. Se a massa inicial é de ${inicial} g, qual será a massa restante após ${meiasVidas} anos?`,
    correctText,
    distractorTexts,
    explicacao: `A cada meia-vida, a massa é dividida por 2. Após ${meiasVidas} meias-vidas: M = ${inicial} ÷ 2^${meiasVidas} = ${correctText}.`,
  });
}

// ---------- PROGRESSOES ----------
function progPA(dificuldade) {
  const a1 = randInt(1, dificuldade === "dificil" ? 50 : 20);
  const r = randInt(2, dificuldade === "dificil" ? 15 : 8);
  const n = randInt(8, dificuldade === "dificil" ? 40 : 20);
  const an = a1 + (n - 1) * r;
  const correctText = `${an}`;
  const distractorTexts = [`${a1 + n * r}`, `${an - r}`, `${an + r}`, `${a1 * n}`];
  return makeQuestao({
    categoriaId: "progressoes",
    subtopico: "Progressão Aritmética",
    dificuldade,
    enunciado: `Uma progressão aritmética tem primeiro termo ${a1} e razão ${r}. Qual é o valor do ${n}º termo dessa progressão?`,
    correctText,
    distractorTexts,
    explicacao: `O termo geral da PA é aₙ = a₁ + (n−1)r = ${a1} + (${n}−1)×${r} = ${correctText}.`,
  });
}

function progPG(dificuldade) {
  const a1 = pick([1, 2, 3, 5]);
  const q = pick(dificuldade === "dificil" ? [2, 3] : [2, 3]);
  const n = randInt(4, dificuldade === "dificil" ? 8 : 6);
  const an = a1 * Math.pow(q, n - 1);
  const correctText = `${an}`;
  const distractorTexts = [`${a1 * Math.pow(q, n)}`, `${a1 * Math.pow(q, n - 2)}`, `${an + a1}`, `${a1 * q * n}`];
  return makeQuestao({
    categoriaId: "progressoes",
    subtopico: "Progressão Geométrica",
    dificuldade,
    enunciado: `Uma progressão geométrica tem primeiro termo ${a1} e razão ${q}. Qual é o valor do ${n}º termo dessa progressão?`,
    correctText,
    distractorTexts,
    explicacao: `O termo geral da PG é aₙ = a₁ × q^(n−1) = ${a1} × ${q}^${n - 1} = ${correctText}.`,
  });
}

// ---------- GEOMETRIA PLANA ----------
function geoAreaPerimetro(dificuldade) {
  const largura = randInt(dificuldade === "facil" ? 3 : 6, dificuldade === "dificil" ? 60 : 30);
  const comprimento = largura + randInt(2, 20);
  const area = largura * comprimento;
  const perimetro = 2 * (largura + comprimento);
  const pedirArea = pick([true, false]);
  const correctText = pedirArea ? `${area} m²` : `${perimetro} m`;
  const distractorTexts = pedirArea
    ? [`${perimetro} m²`, `${largura * largura} m²`, `${comprimento * comprimento} m²`, `${area / 2} m²`]
    : [`${area} m`, `${largura + comprimento} m`, `${largura * 4} m`, `${perimetro / 2} m`];
  return makeQuestao({
    categoriaId: "geometria-plana",
    subtopico: "Áreas e Perímetros",
    dificuldade,
    enunciado: `Um terreno retangular tem ${largura} m de largura e ${comprimento} m de comprimento. Qual é ${pedirArea ? "a área" : "o perímetro"} desse terreno?`,
    correctText,
    distractorTexts,
    explicacao: pedirArea
      ? `Área = largura × comprimento = ${largura} × ${comprimento} = ${correctText}.`
      : `Perímetro = 2 × (largura + comprimento) = 2 × (${largura} + ${comprimento}) = ${correctText}.`,
  });
}

const TRIPLAS_PITAGORICAS = [
  [3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25], [10, 24, 26], [20, 21, 29],
];
function geoPitagoras(dificuldade) {
  const triplas = dificuldade === "facil" ? TRIPLAS_PITAGORICAS.slice(0, 3) : TRIPLAS_PITAGORICAS;
  const [c1, c2, hip] = pick(triplas).map((v) => v * pick(dificuldade === "dificil" ? [1, 2, 3] : [1, 2]));
  const correctText = `${hip} m`;
  const distractorTexts = [`${c1 + c2} m`, `${hip - 1} m`, `${hip + 1} m`, `${Math.round((c1 + c2) / 2)} m`];
  return makeQuestao({
    categoriaId: "geometria-plana",
    subtopico: "Teorema de Pitágoras",
    dificuldade,
    enunciado: `Uma escada está apoiada em uma parede vertical. A base da escada está a ${c1} m da parede, e o topo da escada toca a parede a ${c2} m do chão. Qual é o comprimento da escada?`,
    correctText,
    distractorTexts,
    explicacao: `Pelo Teorema de Pitágoras: escada² = ${c1}² + ${c2}² = ${c1 * c1} + ${c2 * c2} = ${hip * hip}. Logo, escada = √${hip * hip} = ${correctText}.`,
  });
}

// ---------- GEOMETRIA ESPACIAL ----------
function geoVolumePrisma(dificuldade) {
  const comp = randInt(dificuldade === "facil" ? 2 : 4, dificuldade === "dificil" ? 30 : 15);
  const larg = randInt(dificuldade === "facil" ? 2 : 3, dificuldade === "dificil" ? 20 : 10);
  const alt = randInt(dificuldade === "facil" ? 1 : 2, dificuldade === "dificil" ? 10 : 6);
  const volumeM3 = comp * larg * alt;
  const volumeLitros = volumeM3 * 1000;
  const correctText = `${volumeLitros.toLocaleString("pt-BR")} litros`;
  const distractorTexts = [
    `${volumeM3} litros`,
    `${(volumeLitros / 2).toLocaleString("pt-BR")} litros`,
    `${(volumeLitros * 2).toLocaleString("pt-BR")} litros`,
    `${(comp * larg).toLocaleString("pt-BR")} litros`,
  ];
  return makeQuestao({
    categoriaId: "geometria-espacial",
    subtopico: "Prismas e Cilindros",
    dificuldade,
    enunciado: `Uma caixa d'água tem o formato de um paralelepípedo retângulo com ${comp} m de comprimento, ${larg} m de largura e ${alt} m de altura. Qual é a capacidade dessa caixa, em litros? (Considere 1 m³ = 1000 litros.)`,
    correctText,
    distractorTexts,
    explicacao: `Volume = comprimento × largura × altura = ${comp} × ${larg} × ${alt} = ${volumeM3} m³. Convertendo para litros (×1000): ${correctText}.`,
    diagrama: { tipo: "paralelepipedo", comprimento: comp, largura: larg, altura: alt, unidade: "m" },
  });
}

function geoVolumeCilindro(dificuldade) {
  const raio = pick(dificuldade === "dificil" ? [7, 14, 21] : [7, 14]);
  const altura = randInt(dificuldade === "facil" ? 2 : 5, dificuldade === "dificil" ? 20 : 10);
  const piAprox = 22 / 7;
  const volume = Math.round(piAprox * raio * raio * altura);
  const correctText = `${volume.toLocaleString("pt-BR")} cm³`;
  const distractorTexts = [
    `${Math.round(2 * piAprox * raio * altura).toLocaleString("pt-BR")} cm³`,
    `${Math.round(piAprox * raio * altura).toLocaleString("pt-BR")} cm³`,
    `${Math.round(piAprox * raio * raio * altura * 2).toLocaleString("pt-BR")} cm³`,
    `${(raio * raio * altura).toLocaleString("pt-BR")} cm³`,
  ];
  return makeQuestao({
    categoriaId: "geometria-espacial",
    subtopico: "Prismas e Cilindros",
    dificuldade,
    enunciado: `Uma lata cilíndrica tem raio da base igual a ${raio} cm e altura igual a ${altura} cm. Usando π ≈ 22/7, qual é o volume aproximado dessa lata?`,
    correctText,
    distractorTexts,
    explicacao: `Volume do cilindro = π × r² × h ≈ (22/7) × ${raio}² × ${altura} = ${correctText}.`,
    diagrama: { tipo: "cilindro", raio, altura, unidade: "cm" },
  });
}

function geoVolumeCone(dificuldade) {
  const raio = pick(dificuldade === "dificil" ? [7, 14, 21] : [7, 14]);
  const altura = randInt(dificuldade === "facil" ? 3 : 6, dificuldade === "dificil" ? 21 : 14);
  const piAprox = 22 / 7;
  const volume = Math.round((1 / 3) * piAprox * raio * raio * altura);
  const correctText = `${volume.toLocaleString("pt-BR")} cm³`;
  const distractorTexts = [
    `${Math.round(piAprox * raio * raio * altura).toLocaleString("pt-BR")} cm³`,
    `${Math.round((1 / 3) * piAprox * raio * altura).toLocaleString("pt-BR")} cm³`,
    `${Math.round((2 / 3) * piAprox * raio * raio * altura).toLocaleString("pt-BR")} cm³`,
    `${(raio * raio * altura).toLocaleString("pt-BR")} cm³`,
  ];
  return makeQuestao({
    categoriaId: "geometria-espacial",
    subtopico: "Cones e Pirâmides",
    dificuldade,
    enunciado: `Um chapéu de festa tem o formato de um cone com raio da base igual a ${raio} cm e altura igual a ${altura} cm. Usando π ≈ 22/7, qual é o volume aproximado desse cone?`,
    correctText,
    distractorTexts,
    explicacao: `Volume do cone = (1/3) × π × r² × h ≈ (1/3) × (22/7) × ${raio}² × ${altura} = ${correctText}.`,
    diagrama: { tipo: "cone", raio, altura, unidade: "cm" },
  });
}

function geoVolumePiramide(dificuldade) {
  const ladoBase = pick(dificuldade === "dificil" ? [6, 8, 10, 12] : [4, 6, 8]);
  const altura = randInt(dificuldade === "facil" ? 3 : 6, dificuldade === "dificil" ? 18 : 12);
  const areaBase = ladoBase * ladoBase;
  const volume = Math.round((1 / 3) * areaBase * altura);
  const correctText = `${volume.toLocaleString("pt-BR")} cm³`;
  const distractorTexts = [
    `${(areaBase * altura).toLocaleString("pt-BR")} cm³`,
    `${Math.round((1 / 3) * ladoBase * altura).toLocaleString("pt-BR")} cm³`,
    `${Math.round((2 / 3) * areaBase * altura).toLocaleString("pt-BR")} cm³`,
    `${(ladoBase * altura).toLocaleString("pt-BR")} cm³`,
  ];
  return makeQuestao({
    categoriaId: "geometria-espacial",
    subtopico: "Cones e Pirâmides",
    dificuldade,
    enunciado: `Uma pirâmide de base quadrada tem lado da base igual a ${ladoBase} cm e altura igual a ${altura} cm. Qual é o volume dessa pirâmide?`,
    correctText,
    distractorTexts,
    explicacao: `Área da base = ${ladoBase}² = ${areaBase} cm². Volume = (1/3) × área da base × altura = (1/3) × ${areaBase} × ${altura} = ${correctText}.`,
    diagrama: { tipo: "piramide", ladoBase, altura, unidade: "cm" },
  });
}

function geoEsfera(dificuldade) {
  const raio = pick(dificuldade === "dificil" ? [3, 6, 9, 12] : [3, 6, 9]);
  const piAprox = 3;
  const volume = Math.round((4 / 3) * piAprox * Math.pow(raio, 3));
  const correctText = `${volume.toLocaleString("pt-BR")} cm³`;
  const distractorTexts = [
    `${Math.round(piAprox * Math.pow(raio, 3)).toLocaleString("pt-BR")} cm³`,
    `${Math.round((2 / 3) * piAprox * Math.pow(raio, 3)).toLocaleString("pt-BR")} cm³`,
    `${Math.round(4 * piAprox * raio * raio).toLocaleString("pt-BR")} cm³`,
    `${Math.round(volume / 2).toLocaleString("pt-BR")} cm³`,
  ];
  return makeQuestao({
    categoriaId: "geometria-espacial",
    subtopico: "Esferas",
    dificuldade,
    enunciado: `Uma bola de borracha tem formato esférico com raio igual a ${raio} cm. Usando π ≈ 3, qual é o volume aproximado dessa bola?`,
    correctText,
    distractorTexts,
    explicacao: `Volume da esfera = (4/3) × π × r³ ≈ (4/3) × 3 × ${raio}³ = ${correctText}.`,
    diagrama: { tipo: "esfera", raio, unidade: "cm" },
  });
}

function geoPlanificacaoCaixa(dificuldade) {
  const comp = randInt(dificuldade === "facil" ? 3 : 5, dificuldade === "dificil" ? 20 : 12);
  const larg = randInt(dificuldade === "facil" ? 2 : 3, dificuldade === "dificil" ? 15 : 8);
  const alt = randInt(dificuldade === "facil" ? 2 : 3, dificuldade === "dificil" ? 10 : 6);
  const areaTotal = 2 * (comp * larg + comp * alt + larg * alt);
  const correctText = `${areaTotal.toLocaleString("pt-BR")} cm²`;
  const distractorTexts = [
    `${(comp * larg * alt).toLocaleString("pt-BR")} cm²`,
    `${(comp * larg + comp * alt + larg * alt).toLocaleString("pt-BR")} cm²`,
    `${Math.round(areaTotal / 2).toLocaleString("pt-BR")} cm²`,
    `${(2 * comp * larg).toLocaleString("pt-BR")} cm²`,
  ];
  return makeQuestao({
    categoriaId: "geometria-espacial",
    subtopico: "Planificações",
    dificuldade,
    enunciado: `A planificação de uma caixa em formato de paralelepípedo retângulo tem 6 retângulos: duas faces de ${comp} cm × ${larg} cm, duas faces de ${comp} cm × ${alt} cm e duas faces de ${larg} cm × ${alt} cm. Qual é a área total da planificação dessa caixa?`,
    correctText,
    distractorTexts,
    explicacao: `Área total = 2×(comprimento×largura + comprimento×altura + largura×altura) = 2×(${comp}×${larg} + ${comp}×${alt} + ${larg}×${alt}) = 2×(${comp * larg} + ${comp * alt} + ${larg * alt}) = ${correctText}.`,
    diagrama: { tipo: "planificacao-caixa", comprimento: comp, largura: larg, altura: alt, unidade: "cm" },
  });
}

// ---------- GEOMETRIA ANALITICA ----------
function geoDistanciaPontos(dificuldade) {
  const [dx, dy, dist] = pick(TRIPLAS_PITAGORICAS.slice(0, dificuldade === "dificil" ? 8 : 4));
  const x1 = randInt(-5, 5), y1 = randInt(-5, 5);
  const x2 = x1 + dx, y2 = y1 + dy;
  const correctText = `${dist}`;
  const distractorTexts = [`${dx + dy}`, `${dist - 1}`, `${dist + 1}`, `${Math.round(Math.sqrt(dx * dx + dy * dy) * 1.5)}`];
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Distância entre Pontos",
    dificuldade,
    enunciado: `No plano cartesiano, qual é a distância entre os pontos A(${x1}, ${y1}) e B(${x2}, ${y2})?`,
    correctText,
    distractorTexts,
    explicacao: `d = √[(${x2}−${x1})² + (${y2}−${y1})²] = √[${dx}² + ${dy}²] = √${dx * dx + dy * dy} = ${correctText}.`,
  });
}

function geoEquacaoReta(dificuldade) {
  const a = randInt(2, dificuldade === "dificil" ? 10 : 6);
  const b = randInt(-10, 10);
  const x = randInt(dificuldade === "facil" ? 1 : -5, 8);
  const y = a * x + b;
  const correctText = `${y}`;
  const distractorTexts = [`${y + a}`, `${y - a}`, `${a * x}`, `${-y}`];
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Reta",
    dificuldade,
    enunciado: `Uma reta no plano cartesiano é definida pela equação y = ${a}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}. Qual é o valor de y quando x = ${x}?`,
    correctText,
    distractorTexts,
    explicacao: `Substituindo x = ${x} na equação: y = ${a}×${x} ${b >= 0 ? "+ " + b : "- " + Math.abs(b)} = ${correctText}.`,
  });
}

// ---------- TRIGONOMETRIA ----------
const ANGULOS = [
  { graus: 30, sin: 0.5, cos: 0.87, tan: 0.58 },
  { graus: 37, sin: 0.6, cos: 0.8, tan: 0.75 },
  { graus: 45, sin: 0.71, cos: 0.71, tan: 1 },
  { graus: 53, sin: 0.8, cos: 0.6, tan: 1.33 },
  { graus: 60, sin: 0.87, cos: 0.5, tan: 1.73 },
];
function trigTrianguloRetangulo(dificuldade) {
  const ang = pick(dificuldade === "dificil" ? ANGULOS : ANGULOS.filter((a) => a.graus !== 37 && a.graus !== 53));
  const catetoAdjacente = randInt(dificuldade === "facil" ? 5 : 8, dificuldade === "dificil" ? 100 : 40);
  const alturaAprox = Math.round(catetoAdjacente * ang.tan);
  const correctText = `${alturaAprox} m`;
  const distractorTexts = [`${catetoAdjacente} m`, `${Math.round(catetoAdjacente * ang.sin)} m`, `${Math.round(catetoAdjacente * ang.cos)} m`, `${alturaAprox * 2} m`];
  return makeQuestao({
    categoriaId: "trigonometria",
    subtopico: "Triângulo Retângulo",
    dificuldade,
    enunciado: `Um observador está a ${catetoAdjacente} m da base de uma torre e vê o topo da torre sob um ângulo de ${ang.graus}° em relação ao chão. Usando tan(${ang.graus}°) ≈ ${ang.tan}, qual é aproximadamente a altura da torre?`,
    correctText,
    distractorTexts,
    explicacao: `tan(${ang.graus}°) = altura / distância. Altura = distância × tan(${ang.graus}°) = ${catetoAdjacente} × ${ang.tan} ≈ ${correctText}.`,
  });
}

// ---------- ESTATISTICA ----------
function estMedia(dificuldade) {
  const n = dificuldade === "facil" ? 4 : dificuldade === "dificil" ? 8 : 6;
  const valores = Array.from({ length: n }, () => randInt(dificuldade === "dificil" ? 20 : 40, dificuldade === "dificil" ? 100 : 100));
  const soma = valores.reduce((a, b) => a + b, 0);
  const media = Math.round((soma / n) * 100) / 100;
  const correctText = `${media}`;
  const distractorTexts = [`${Math.max(...valores)}`, `${Math.min(...valores)}`, `${Math.round((soma / (n - 1)) * 100) / 100}`, `${Math.round(soma / 2)}`];
  return makeQuestao({
    categoriaId: "estatistica",
    subtopico: "Média, Moda e Mediana",
    dificuldade,
    enunciado: `As notas de um aluno em ${n} avaliações foram: ${valores.join(", ")}. Qual é a média aritmética dessas notas?`,
    correctText,
    distractorTexts,
    explicacao: `Média = soma dos valores ÷ quantidade = (${valores.join(" + ")}) ÷ ${n} = ${soma} ÷ ${n} = ${correctText}.`,
  });
}

function estMediana(dificuldade) {
  const n = dificuldade === "dificil" ? 7 : 5;
  const valores = Array.from({ length: n }, () => randInt(10, 99)).sort((a, b) => a - b);
  const mediana = valores[Math.floor(n / 2)];
  const correctText = `${mediana}`;
  const distractorTexts = [`${valores[0]}`, `${valores[n - 1]}`, `${Math.round(valores.reduce((a, b) => a + b) / n)}`, `${valores[Math.floor(n / 2) - 1]}`];
  return makeQuestao({
    categoriaId: "estatistica",
    subtopico: "Média, Moda e Mediana",
    dificuldade,
    enunciado: `Um pesquisador coletou os seguintes valores em uma amostra: ${valores.join(", ")} (não ordenados originalmente). Qual é a mediana desse conjunto de dados?`,
    correctText,
    distractorTexts,
    explicacao: `Ordenando os valores: ${valores.join(", ")}. Como há ${n} valores (ímpar), a mediana é o valor central, ou seja, ${correctText}.`,
  });
}

const CONTEXTOS_GRAFICO = [
  { titulo: "Alunos matriculados por curso", eixoY: "Alunos", unidade: "alunos", categorias: ["Matemática", "Física", "Química", "Biologia", "História"] },
  { titulo: "Vendas mensais de uma loja (unidades)", eixoY: "Unidades vendidas", unidade: "unidades", categorias: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"] },
  { titulo: "Livros emprestados por gênero", eixoY: "Livros", unidade: "livros", categorias: ["Romance", "Ficção", "História", "Poesia", "Biografia"] },
  { titulo: "Ingressos vendidos por modalidade esportiva", eixoY: "Ingressos", unidade: "ingressos", categorias: ["Futebol", "Vôlei", "Basquete", "Natação", "Atletismo"] },
];

function estLeituraGraficoDiferenca(dificuldade) {
  const contexto = pick(CONTEXTOS_GRAFICO);
  const n = dificuldade === "dificil" ? 5 : 4;
  const categorias = contexto.categorias.slice(0, n);
  const min = dificuldade === "facil" ? 10 : 20;
  const max = dificuldade === "dificil" ? 90 : 60;
  const valores = categorias.map(() => randInt(min, max));
  const maiorValor = Math.max(...valores);
  const menorValor = Math.min(...valores);
  const diferenca = maiorValor - menorValor;
  const correctText = `${diferenca} ${contexto.unidade}`;
  const distractorTexts = [
    `${maiorValor} ${contexto.unidade}`,
    `${menorValor} ${contexto.unidade}`,
    `${diferenca + 5} ${contexto.unidade}`,
    `${valores.reduce((a, b) => a + b, 0)} ${contexto.unidade}`,
  ];
  return makeQuestao({
    categoriaId: "estatistica",
    subtopico: "Leitura de Gráficos e Tabelas",
    dificuldade,
    enunciado: `O gráfico mostra ${contexto.titulo.toLowerCase()}. Qual é a diferença entre o maior e o menor valor mostrados no gráfico?`,
    correctText,
    distractorTexts,
    explicacao: `O maior valor no gráfico é ${maiorValor} ${contexto.unidade} e o menor é ${menorValor} ${contexto.unidade}. Diferença: ${maiorValor} − ${menorValor} = ${correctText}.`,
    diagrama: { tipo: "barras", titulo: contexto.titulo, eixoY: contexto.eixoY, categorias, valores },
  });
}

function estLeituraGraficoTotal(dificuldade) {
  const contexto = pick(CONTEXTOS_GRAFICO);
  const n = dificuldade === "dificil" ? 5 : 4;
  const categorias = contexto.categorias.slice(0, n);
  const min = dificuldade === "facil" ? 10 : 20;
  const max = dificuldade === "dificil" ? 90 : 60;
  const valores = categorias.map(() => randInt(min, max));
  const total = valores.reduce((a, b) => a + b, 0);
  const correctText = `${total} ${contexto.unidade}`;
  const distractorTexts = [
    `${total - Math.max(...valores)} ${contexto.unidade}`,
    `${total + 10} ${contexto.unidade}`,
    `${Math.round(total / n)} ${contexto.unidade}`,
    `${Math.max(...valores)} ${contexto.unidade}`,
  ];
  return makeQuestao({
    categoriaId: "estatistica",
    subtopico: "Leitura de Gráficos e Tabelas",
    dificuldade,
    enunciado: `O gráfico mostra ${contexto.titulo.toLowerCase()}. Somando todas as categorias mostradas no gráfico, qual é o total?`,
    correctText,
    distractorTexts,
    explicacao: `Somando os valores de todas as categorias: ${valores.join(" + ")} = ${correctText}.`,
    diagrama: { tipo: "barras", titulo: contexto.titulo, eixoY: contexto.eixoY, categorias, valores },
  });
}

function estLeituraGraficoPercentual(dificuldade) {
  const contexto = pick(CONTEXTOS_GRAFICO);
  const n = dificuldade === "dificil" ? 5 : 4;
  const categorias = contexto.categorias.slice(0, n);
  const min = dificuldade === "facil" ? 10 : 20;
  const max = dificuldade === "dificil" ? 90 : 60;
  const valores = categorias.map(() => randInt(min, max));
  const total = valores.reduce((a, b) => a + b, 0);
  const maiorValor = Math.max(...valores);
  const catMaior = categorias[valores.indexOf(maiorValor)];
  const percentual = Math.round((maiorValor / total) * 100);
  const correctText = pct(percentual);
  const distractorTexts = [pct(Math.round(((total - maiorValor) / total) * 100)), pct(50), pct(Math.round(percentual / 2))];
  return makeQuestao({
    categoriaId: "estatistica",
    subtopico: "Leitura de Gráficos e Tabelas",
    dificuldade,
    enunciado: `O gráfico mostra ${contexto.titulo.toLowerCase()}. A categoria "${catMaior}" corresponde a aproximadamente qual percentual do total mostrado no gráfico?`,
    correctText,
    distractorTexts,
    explicacao: `Total de todas as categorias: ${valores.join(" + ")} = ${total}. A categoria "${catMaior}" tem ${maiorValor} ${contexto.unidade}. Percentual: (${maiorValor} ÷ ${total}) × 100 ≈ ${correctText}.`,
    diagrama: { tipo: "barras", titulo: contexto.titulo, eixoY: contexto.eixoY, categorias, valores },
  });
}

// ---------- PROBABILIDADE ----------
function probSimples(dificuldade) {
  const total = pick(dificuldade === "dificil" ? [36, 45, 52] : [10, 20, 30]);
  const favoraveis = randInt(1, Math.floor(total / 3));
  const [num, den] = (function () { const g = gcd(favoraveis, total); return [favoraveis / g, total / g]; })();
  const correctText = `${num}/${den}`;
  const distractorTexts = [`${favoraveis}/${total - favoraveis}`, `${total - favoraveis}/${total}`, `${den}/${num}`, `${num + 1}/${den}`];
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Probabilidade Simples",
    dificuldade,
    enunciado: `Uma urna contém ${total} bolas numeradas de 1 a ${total}, todas com a mesma chance de serem sorteadas. Se ${favoraveis} dessas bolas são vermelhas, qual é a probabilidade de, em um único sorteio, sair uma bola vermelha?`,
    correctText,
    distractorTexts,
    explicacao: `Probabilidade = casos favoráveis / casos possíveis = ${favoraveis}/${total}, que simplificado é ${correctText}.`,
  });
}

function probSucessiva(dificuldade) {
  const azuis = randInt(2, 6);
  const vermelhas = randInt(2, 6);
  const total = azuis + vermelhas;
  const num = azuis * (azuis - 1);
  const den = total * (total - 1);
  const g = gcd(num, den);
  const correctText = `${num / g}/${den / g}`;
  const distractorTexts = [`${azuis}/${total}`, `${azuis - 1}/${total}`, `${vermelhas * (vermelhas - 1)}/${den}`, `${num}/${total}`];
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Eventos Sucessivos",
    dificuldade,
    enunciado: `Uma caixa tem ${azuis} bolas azuis e ${vermelhas} bolas vermelhas. Retirando-se duas bolas sucessivamente, sem reposição, qual é a probabilidade de que ambas sejam azuis?`,
    correctText,
    distractorTexts,
    explicacao: `P(1ª azul) = ${azuis}/${total}. Sem reposição, P(2ª azul | 1ª azul) = ${azuis - 1}/${total - 1}. P(ambas azuis) = (${azuis}/${total}) × (${azuis - 1}/${total - 1}) = ${correctText}.`,
  });
}

// ---------- ANALISE COMBINATORIA ----------
function combMultiplicativo(dificuldade) {
  const opcoesA = randInt(2, dificuldade === "dificil" ? 8 : 5);
  const opcoesB = randInt(2, dificuldade === "dificil" ? 8 : 5);
  const opcoesC = randInt(2, dificuldade === "dificil" ? 6 : 4);
  const total = opcoesA * opcoesB * opcoesC;
  const correctText = `${total}`;
  const distractorTexts = [`${opcoesA + opcoesB + opcoesC}`, `${opcoesA * opcoesB}`, `${total / opcoesC}`, `${total + opcoesA}`];
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Princípio Multiplicativo",
    dificuldade,
    enunciado: `Um restaurante oferece ${opcoesA} tipos de entrada, ${opcoesB} tipos de prato principal e ${opcoesC} tipos de sobremesa. De quantas formas diferentes um cliente pode montar uma refeição com uma entrada, um prato principal e uma sobremesa?`,
    correctText,
    distractorTexts,
    explicacao: `Pelo princípio fundamental da contagem, o total de combinações é ${opcoesA} × ${opcoesB} × ${opcoesC} = ${correctText}.`,
  });
}

function fatorial(n) { return n <= 1 ? 1 : n * fatorial(n - 1); }
function combinacao(n, k) { return Math.round(fatorial(n) / (fatorial(k) * fatorial(n - k))); }
function combComissao(dificuldade) {
  const n = randInt(dificuldade === "facil" ? 5 : 6, dificuldade === "dificil" ? 12 : 8);
  const k = randInt(2, Math.min(4, n - 1));
  const total = combinacao(n, k);
  const correctText = `${total}`;
  const distractorTexts = [`${fatorial(n) / fatorial(n - k)}`, `${n * k}`, `${combinacao(n, k - 1)}`, `${combinacao(n, k + 1)}`];
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Combinação",
    dificuldade,
    enunciado: `De um grupo de ${n} funcionários, deseja-se formar uma comissão de ${k} pessoas, sem distinção de cargos dentro da comissão. De quantas maneiras diferentes essa comissão pode ser formada?`,
    correctText,
    distractorTexts,
    explicacao: `Como a ordem não importa, usa-se combinação: C(${n},${k}) = ${n}! / (${k}! × ${n - k}!) = ${correctText}.`,
  });
}

// ---------- MATEMATICA FINANCEIRA ----------
function finJurosCompostos(dificuldade) {
  const capital = randInt(dificuldade === "facil" ? 10 : 20, dificuldade === "dificil" ? 200 : 100) * 100;
  const taxa = pick([2, 3, 5, 8, 10]);
  const periodos = randInt(2, dificuldade === "dificil" ? 6 : 4);
  const montante = Math.round(capital * Math.pow(1 + taxa / 100, periodos) * 100) / 100;
  const correctText = brl(montante);
  const distractorTexts = [
    brl(Math.round(capital * (1 + (taxa / 100) * periodos) * 100) / 100),
    brl(capital),
    brl(Math.round(capital * Math.pow(1 + taxa / 100, periodos + 1) * 100) / 100),
    brl(Math.round(capital * Math.pow(1 + taxa / 100, periodos - 1) * 100) / 100),
  ];
  return makeQuestao({
    categoriaId: "matematica-financeira",
    subtopico: "Juros Compostos",
    dificuldade,
    enunciado: `Um capital de ${brl(capital)} foi aplicado a juros compostos de ${pct(taxa)} ao mês. Qual será o montante após ${periodos} meses?`,
    correctText,
    distractorTexts,
    explicacao: `M = C × (1 + i)^t = ${brl(capital)} × (1 + ${taxa}/100)^${periodos} = ${correctText}.`,
  });
}

// ---------- MATRIZES ----------
function matDeterminante(dificuldade) {
  const a = randInt(-9, 9), b = randInt(-9, 9), c = randInt(-9, 9), d = randInt(-9, 9);
  const det = a * d - b * c;
  const correctText = `${det}`;
  const distractorTexts = [`${a * d + b * c}`, `${a * c - b * d}`, `${a + d - b - c}`, `${-det}`];
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Determinantes",
    dificuldade,
    enunciado: `Considere a matriz A = [[${a}, ${b}], [${c}, ${d}]]. Qual é o determinante de A?`,
    correctText,
    distractorTexts,
    explicacao: `Para uma matriz 2x2 [[a,b],[c,d]], det(A) = ad − bc = (${a})(${d}) − (${b})(${c}) = ${correctText}.`,
  });
}

// ---------- MATRIZES (moldes adicionais) ----------
const _MAT_POOL5 = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
const _MAT_POOL9 = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function _matDistintos(valores) {
  return new Set(valores.map((v) => String(v))).size === valores.length;
}
function _matMat2(M) {
  return `[[${M[0][0]}, ${M[0][1]}], [${M[1][0]}, ${M[1][1]}]]`;
}
function _matQuatroValores() {
  return shuffle(_MAT_POOL9).slice(0, 4);
}

function matDeterminante3x3(dificuldade, tentativa = 0) {
  const lin = () => [randInt(-5, 5), randInt(-5, 5), randInt(-5, 5)];
  const [a, b, c] = lin();
  const [d, e, f] = lin();
  const [g, h, i] = lin();
  const pos = a * e * i + b * f * g + c * d * h;
  const neg = c * e * g + a * f * h + b * d * i;
  const det = pos - neg;
  const naive = a * e * i - c * e * g;
  if (tentativa < 40 && !_matDistintos([det, -det, pos + neg, naive, pos]))
    return matDeterminante3x3(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Determinantes",
    dificuldade,
    enunciado: `Considere a matriz de ordem 3: A = [[${a}, ${b}, ${c}], [${d}, ${e}, ${f}], [${g}, ${h}, ${i}]]. Aplicando a Regra de Sarrus, qual é o determinante de A?`,
    correctText: `${det}`,
    distractorTexts: [`${-det}`, `${pos + neg}`, `${naive}`, `${pos}`],
    explicacao: `Pela Regra de Sarrus, det(A) é a soma dos produtos das diagonais no sentido principal menos a soma no sentido secundário: (${a}·${e}·${i} + ${b}·${f}·${g} + ${c}·${d}·${h}) − (${c}·${e}·${g} + ${a}·${f}·${h} + ${b}·${d}·${i}) = (${pos}) − (${neg}) = ${det}.`,
  });
}

function matSoma(dificuldade, tentativa = 0) {
  const A = [[pick(_MAT_POOL9), pick(_MAT_POOL9)], [pick(_MAT_POOL9), pick(_MAT_POOL9)]];
  const B = [[pick(_MAT_POOL9), pick(_MAT_POOL9)], [pick(_MAT_POOL9), pick(_MAT_POOL9)]];
  const i = randInt(0, 1), j = randInt(0, 1);
  const x = A[i][j], y = B[i][j];
  const correct = x + y;
  const distr = [x - y, y - x, x, y];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matSoma(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Sejam as matrizes A = ${_matMat2(A)} e B = ${_matMat2(B)}. Se C = A + B, qual é o elemento da linha ${i + 1}, coluna ${j + 1} da matriz C?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Na soma de matrizes somam-se os elementos de mesma posição: c(${i + 1},${j + 1}) = a(${i + 1},${j + 1}) + b(${i + 1},${j + 1}) = (${x}) + (${y}) = ${correct}.`,
  });
}

function matSubtracao(dificuldade, tentativa = 0) {
  const A = [[pick(_MAT_POOL9), pick(_MAT_POOL9)], [pick(_MAT_POOL9), pick(_MAT_POOL9)]];
  const B = [[pick(_MAT_POOL9), pick(_MAT_POOL9)], [pick(_MAT_POOL9), pick(_MAT_POOL9)]];
  const i = randInt(0, 1), j = randInt(0, 1);
  const x = A[i][j], y = B[i][j];
  const correct = x - y;
  const distr = [y - x, x + y, x, y];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matSubtracao(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Sejam as matrizes A = ${_matMat2(A)} e B = ${_matMat2(B)}. Se C = A − B, qual é o elemento da linha ${i + 1}, coluna ${j + 1} da matriz C?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Na subtração de matrizes subtraem-se os elementos de mesma posição, na ordem A − B: c(${i + 1},${j + 1}) = a(${i + 1},${j + 1}) − b(${i + 1},${j + 1}) = (${x}) − (${y}) = ${correct}.`,
  });
}

function matEscalar(dificuldade, tentativa = 0) {
  const k = pick([2, 3, 4, 5]);
  const filt = _MAT_POOL9.filter((v) => Math.abs(v) >= 3);
  const A = [[pick(filt), pick(filt)], [pick(filt), pick(filt)]];
  const i = randInt(0, 1), j = randInt(0, 1);
  const a = A[i][j];
  const correct = k * a;
  const distr = [a + k, a, k, -k * a];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matEscalar(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Considere a matriz A = ${_matMat2(A)} e o número real k = ${k}. Qual é o elemento da linha ${i + 1}, coluna ${j + 1} da matriz k·A?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Na multiplicação de uma matriz por um escalar, cada elemento é multiplicado por k. O elemento pedido vale ${k} · (${a}) = ${correct}.`,
  });
}

function matProduto(dificuldade, tentativa = 0) {
  const p5 = _MAT_POOL5;
  const A = [[pick(p5), pick(p5)], [pick(p5), pick(p5)]];
  const B = [[pick(p5), pick(p5)], [pick(p5), pick(p5)]];
  const i = randInt(0, 1), j = randInt(0, 1);
  const correct = A[i][0] * B[0][j] + A[i][1] * B[1][j];
  const distr = [
    A[i][j] * B[i][j],
    A[i][0] * B[0][j],
    A[i][0] * B[j][0] + A[i][1] * B[j][1],
    A[i][0] * B[0][j] - A[i][1] * B[1][j],
  ];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matProduto(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Sejam A = ${_matMat2(A)} e B = ${_matMat2(B)}. No produto C = A · B, qual é o elemento da linha ${i + 1}, coluna ${j + 1} de C?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `O elemento c(${i + 1},${j + 1}) é a soma dos produtos da linha ${i + 1} de A pela coluna ${j + 1} de B: (${A[i][0]})·(${B[0][j]}) + (${A[i][1]})·(${B[1][j]}) = ${A[i][0] * B[0][j]} + ${A[i][1] * B[1][j]} = ${correct}.`,
  });
}

function matTransposta(dificuldade, tentativa = 0) {
  const [v1, v2, v3, v4] = _matQuatroValores();
  const A = [[v1, v2], [v3, v4]];
  const [i, j] = pick([[0, 1], [1, 0]]);
  const correct = A[j][i];
  const distr = [A[i][j], A[i][i], A[j][j], -A[j][i]];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matTransposta(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Dada a matriz A = ${_matMat2(A)}, seja Aᵀ a sua transposta. Qual é o elemento da linha ${i + 1}, coluna ${j + 1} de Aᵀ?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Na transposta, linhas viram colunas: o elemento da posição (${i + 1},${j + 1}) de Aᵀ é igual ao da posição (${j + 1},${i + 1}) de A, que vale ${correct}.`,
  });
}

function matTraco(dificuldade, tentativa = 0) {
  const m = Array.from({ length: 3 }, () => [randInt(-9, 9), randInt(-9, 9), randInt(-9, 9)]);
  m[0][0] = pick(_MAT_POOL9);
  m[1][1] = pick(_MAT_POOL9);
  m[2][2] = pick(_MAT_POOL9);
  const tr = m[0][0] + m[1][1] + m[2][2];
  const somaTudo = m.flat().reduce((s, v) => s + v, 0);
  const antiDiag = m[0][2] + m[1][1] + m[2][0];
  const prodDiag = m[0][0] * m[1][1] * m[2][2];
  const semMeio = m[0][0] + m[2][2];
  const distr = [somaTudo, antiDiag, prodDiag, semMeio];
  if (tentativa < 40 && !_matDistintos([tr, ...distr]))
    return matTraco(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Considere a matriz quadrada M = [[${m[0][0]}, ${m[0][1]}, ${m[0][2]}], [${m[1][0]}, ${m[1][1]}, ${m[1][2]}], [${m[2][0]}, ${m[2][1]}, ${m[2][2]}]]. O traço de uma matriz é a soma dos elementos de sua diagonal principal. Qual é o traço de M?`,
    correctText: `${tr}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `A diagonal principal vai do canto superior esquerdo ao inferior direito: traço(M) = (${m[0][0]}) + (${m[1][1]}) + (${m[2][2]}) = ${tr}.`,
  });
}

function matIgualdade(dificuldade, tentativa = 0) {
  const x = randInt(1, 9), y = randInt(1, 9);
  const p = randInt(2, 9);
  const b12 = pick(_MAT_POOL9), b21 = pick(_MAT_POOL9);
  const correct = x + y;
  const distr = [x - y, x + p + 2 * y, x + 2 * y, x + p + y];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matIgualdade(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `As matrizes A = [[x + ${p}, ${b12}], [${b21}, 2y]] e B = [[${x + p}, ${b12}], [${b21}, ${2 * y}]] são iguais. Qual é o valor de x + y?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Duas matrizes são iguais quando os elementos de mesma posição são iguais. Posição (1,1): x + ${p} = ${x + p} ⇒ x = ${x}. Posição (2,2): 2y = ${2 * y} ⇒ y = ${y}. Logo x + y = ${correct}.`,
  });
}

const _MAT_LEIS = [
  { txt: "2i − j", f: (i, j) => 2 * i - j, calc: (i, j) => `2·${i} − ${j}` },
  { txt: "i + 2j", f: (i, j) => i + 2 * j, calc: (i, j) => `${i} + 2·${j}` },
  { txt: "3i − j", f: (i, j) => 3 * i - j, calc: (i, j) => `3·${i} − ${j}` },
  { txt: "2j − i", f: (i, j) => 2 * j - i, calc: (i, j) => `2·${j} − ${i}` },
];
function matLeiDeFormacao(dificuldade, tentativa = 0) {
  const lei = pick(_MAT_LEIS);
  const r = randInt(1, 3), s = randInt(1, 3);
  const correct = lei.f(r, s);
  const distr = [lei.f(s, r), r + s, r * s, -correct];
  if (tentativa < 40 && (r === s || correct === 0 || !_matDistintos([correct, ...distr])))
    return matLeiDeFormacao(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Uma matriz A = (a_ij) de ordem 3 tem seus elementos definidos pela lei de formação a_ij = ${lei.txt}, em que i indica a linha e j a coluna. Qual é o elemento a_${r}${s} dessa matriz?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Basta substituir i = ${r} (linha) e j = ${s} (coluna) na lei a_ij = ${lei.txt}: a_${r}${s} = ${lei.calc(r, s)} = ${correct}.`,
  });
}

function matSimetrica(dificuldade, tentativa = 0) {
  const x = randInt(2, 9);
  const c = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
  const a21 = x + c;
  const d1v = pick(_MAT_POOL9), d2v = pick(_MAT_POOL9);
  const cStr = c >= 0 ? `+ ${c}` : `− ${-c}`;
  const distr = [x + 2 * c, x + c, -x, c];
  if (
    tentativa < 40 &&
    (x === c || x + c === 0 || 2 * x + c === 0 || a21 === 0 || !_matDistintos([x, ...distr]))
  )
    return matSimetrica(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `A matriz A = [[${d1v}, x ${cStr}], [${a21}, ${d2v}]] é simétrica (igual à sua transposta). Qual é o valor de x?`,
    correctText: `${x}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Em uma matriz simétrica, o elemento (1,2) é igual ao elemento (2,1). Então x ${cStr} = ${a21}, ou seja x = ${a21} ${c >= 0 ? "− " + c : "+ " + -c} = ${x}.`,
  });
}

function matPotencia(dificuldade, tentativa = 0) {
  const p5 = _MAT_POOL5;
  const a = pick(p5), b = pick(p5), c = pick(p5), d = pick(p5);
  const correct = a * a + b * c;
  const distr = [a * a, a * a - b * c, a * a + b * d, a * a + 2 * b * c];
  if (tentativa < 40 && (c === d || !_matDistintos([correct, ...distr])))
    return matPotencia(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Operações com Matrizes",
    dificuldade,
    enunciado: `Considere a matriz A = ${_matMat2([[a, b], [c, d]])}. Calculando A² = A · A, qual é o elemento da linha 1, coluna 1 de A²?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `O elemento (1,1) de A² é a 1ª linha de A multiplicada pela 1ª coluna de A: (${a})·(${a}) + (${b})·(${c}) = ${a * a} + ${b * c} = ${correct}.`,
  });
}

function matInversa(dificuldade, tentativa = 0) {
  const b = pick([-3, -2, 2, 3]), c = pick([-3, -2, 2, 3]);
  const d = b * c - 1;
  const correct = 1 - b * c;
  const distr = [d, -1, b, b * c];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matInversa(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Determinantes",
    dificuldade,
    enunciado: `A matriz A = [[1, ${b}], [${c}, ${d}]] tem determinante igual a −1. Qual é o elemento da linha 1, coluna 1 da matriz inversa A⁻¹?`,
    correctText: `${correct}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Para uma matriz 2×2 [[a, b], [c, d]], a inversa é A⁻¹ = (1/det)·[[d, −b], [−c, a]]. O elemento (1,1) é d/det = (${d})/(−1) = ${correct}.`,
  });
}

function matDeterminanteComIncognita(dificuldade, tentativa = 0) {
  const b = pick([2, 3, 4, 6]), c = pick([2, 3, 4, 6]);
  const prod = b * c;
  const cand = [2, 3, 4, 6].filter((k) => prod % k === 0 && prod / k >= 2 && prod / k <= 15);
  const d = pick(cand);
  const x = prod / d;
  const distr = [prod, -x, prod - d, prod + d];
  if (tentativa < 40 && !_matDistintos([x, ...distr]))
    return matDeterminanteComIncognita(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Determinantes",
    dificuldade,
    enunciado: `O determinante da matriz A = [[x, ${b}], [${c}, ${d}]] é igual a zero. Qual é o valor de x?`,
    correctText: `${x}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `det(A) = x·${d} − ${b}·${c} = 0 ⇒ ${d}·x = ${prod} ⇒ x = ${prod} ÷ ${d} = ${x}.`,
  });
}

function matCramer(dificuldade, tentativa = 0) {
  const x = randInt(2, 9), y = randInt(2, 9);
  const a1 = randInt(1, 5), b1 = randInt(1, 5), a2 = randInt(1, 5), b2 = randInt(1, 5);
  const D = a1 * b2 - a2 * b1;
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  const Dx = c1 * b2 - c2 * b1;
  const distr = [y, x + y, Dx, -x];
  if (
    tentativa < 40 &&
    (Math.abs(D) < 2 || x === y || Dx / D !== x || !_matDistintos([x, ...distr]))
  )
    return matCramer(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Aplicações Práticas",
    dificuldade,
    enunciado: `Considere o sistema linear { ${a1}x + ${b1}y = ${c1} ; ${a2}x + ${b2}y = ${c2} }. Resolvendo-o pela Regra de Cramer, qual é o valor de x?`,
    correctText: `${x}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `Regra de Cramer: D = ${a1}·${b2} − ${a2}·${b1} = ${D}; Dx = ${c1}·${b2} − ${c2}·${b1} = ${Dx}. Então x = Dx / D = ${Dx} / ${D} = ${x}.`,
  });
}

const _MAT_LOJAS = [["Loja Norte", "Loja Sul"], ["Filial Centro", "Filial Bairro"], ["Unidade A", "Unidade B"]];
const _MAT_PRODUTOS = [
  ["camisetas", "calças", "bonés"],
  ["cadernos", "canetas", "mochilas"],
  ["pães", "bolos", "tortas"],
];
function matFaturamento(dificuldade, tentativa = 0) {
  const [l0, l1] = pick(_MAT_LOJAS);
  const prods = pick(_MAT_PRODUTOS);
  const Q = [
    [randInt(3, 20), randInt(3, 20), randInt(3, 20)],
    [randInt(3, 20), randInt(3, 20), randInt(3, 20)],
  ];
  const precos = [5, 10, 15, 20, 25, 30, 40];
  const p = [pick(precos), pick(precos), pick(precos)];
  const s = randInt(0, 1);
  const rev = (r) => Q[r][0] * p[0] + Q[r][1] * p[1] + Q[r][2] * p[2];
  const correct = rev(s);
  const distr = [
    rev(1 - s),
    (Q[s][0] + Q[s][1] + Q[s][2]) * p[0],
    Q[s][0] * p[0] + Q[s][1] * p[1],
    Q[s][0] + Q[s][1] + Q[s][2] + p[0] + p[1] + p[2],
  ];
  if (tentativa < 40 && !_matDistintos([correct, ...distr]))
    return matFaturamento(dificuldade, tentativa + 1);
  const loja = s === 0 ? l0 : l1;
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Aplicações Práticas",
    dificuldade,
    enunciado: `Uma rede registrou as quantidades vendidas de três produtos (${prods[0]}, ${prods[1]} e ${prods[2]}) em duas lojas na matriz Q = [[${Q[0][0]}, ${Q[0][1]}, ${Q[0][2]}], [${Q[1][0]}, ${Q[1][1]}, ${Q[1][2]}]], em que a linha 1 é a ${l0} e a linha 2 é a ${l1}, e as colunas seguem a ordem dos produtos citada. Os preços unitários, em reais, formam o vetor p = [${p[0]}, ${p[1]}, ${p[2]}]. Qual foi o faturamento da ${loja}?`,
    correctText: brl(correct),
    distractorTexts: distr.map((v) => brl(v)),
    explicacao: `O faturamento de uma loja é o produto da sua linha em Q pelo vetor de preços: ${Q[s][0]}·${p[0]} + ${Q[s][1]}·${p[1]} + ${Q[s][2]}·${p[2]} = ${Q[s][0] * p[0]} + ${Q[s][1] * p[1]} + ${Q[s][2] * p[2]} = ${brl(correct)}.`,
  });
}

function matIdentidadePropriedade(dificuldade, tentativa = 0) {
  const [a, b, c, d] = _matQuatroValores();
  const distr = [a, a + b, 0, c];
  if (tentativa < 40 && !_matDistintos([b, ...distr]))
    return matIdentidadePropriedade(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "matrizes",
    subtopico: "Aplicações Práticas",
    dificuldade,
    enunciado: `Seja I a matriz identidade de ordem 2 e A = ${_matMat2([[a, b], [c, d]])}. Sabendo que A · I = A para qualquer matriz A, qual é o elemento da linha 1, coluna 2 do produto A · I?`,
    correctText: `${b}`,
    distractorTexts: distr.map((v) => `${v}`),
    explicacao: `A identidade é o elemento neutro da multiplicação de matrizes: A · I = A. Logo o produto tem os mesmos elementos de A, e o da linha 1, coluna 2 é ${b}. Conferindo pela definição de produto: (${a})·0 + (${b})·1 = ${b}.`,
  });
}

// ---------- LOGICA ----------
function logSequencia(dificuldade) {
  const a1 = randInt(1, 10);
  const r = randInt(2, dificuldade === "dificil" ? 12 : 6);
  const tipo = pick(["soma", "razao"]);
  let seq, next;
  if (tipo === "soma") {
    seq = Array.from({ length: 5 }, (_, i) => a1 + i * r);
    next = a1 + 5 * r;
  } else {
    const q = pick([2, 3]);
    seq = Array.from({ length: 5 }, (_, i) => a1 * Math.pow(q, i));
    next = a1 * Math.pow(q, 5);
  }
  const correctText = `${next}`;
  const distractorTexts = [`${seq[4] + (seq[4] - seq[3])}`, `${seq[4] * 2}`, `${seq[4] + 1}`, `${seq[4] - (seq[1] - seq[0])}`];
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Sequências e Padrões",
    dificuldade,
    enunciado: `Observe a sequência: ${seq.join(", ")}, ... Seguindo o mesmo padrão, qual é o próximo número da sequência?`,
    correctText,
    distractorTexts,
    explicacao: tipo === "soma"
      ? `Cada termo é obtido somando ${r} ao anterior. O próximo termo é ${seq[4]} + ${r} = ${correctText}.`
      : `Cada termo é obtido multiplicando o anterior pela razão. O próximo termo é ${seq[4]} × ${next / seq[4]} = ${correctText}.`,
  });
}

function logRaciocinioIdade(dificuldade) {
  const idadeFilho = randInt(dificuldade === "facil" ? 5 : 8, dificuldade === "dificil" ? 20 : 15);
  const diferenca = randInt(20, 30);
  const idadePai = idadeFilho + diferenca;
  const anos = randInt(2, dificuldade === "dificil" ? 15 : 8);
  const idadePaiFutura = idadePai + anos;
  const idadeFilhoFutura = idadeFilho + anos;
  const correctText = `${idadePaiFutura} e ${idadeFilhoFutura} anos`;
  const distractorTexts = [`${idadePai} e ${idadeFilho} anos`, `${idadePaiFutura + anos} e ${idadeFilhoFutura} anos`, `${idadePaiFutura} e ${idadeFilho} anos`, `${idadePai + anos * 2} e ${idadeFilhoFutura} anos`];
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Problemas de Raciocínio",
    dificuldade,
    enunciado: `Hoje, um pai tem ${idadePai} anos e seu filho tem ${idadeFilho} anos. Daqui a ${anos} anos, quais serão as idades do pai e do filho, respectivamente?`,
    correctText,
    distractorTexts,
    explicacao: `Basta somar ${anos} anos à idade atual de cada um: pai = ${idadePai} + ${anos} = ${idadePaiFutura}; filho = ${idadeFilho} + ${anos} = ${idadeFilhoFutura}.`,
  });
}

// ---------- CONJUNTOS ----------
function conjDoisConjuntos(dificuldade) {
  const contextos = [
    ["um clube de leitura", "leem o livro A", "leem o livro B"],
    ["uma escola de idiomas", "estudam inglês", "estudam espanhol"],
    ["uma academia", "praticam natação", "praticam musculação"],
    ["uma empresa", "usam o aplicativo X", "usam o aplicativo Y"],
    ["um bairro", "assinam o jornal A", "assinam o jornal B"],
  ];
  const [lugar, grupoA, grupoB] = pick(contextos);
  const ambos = randInt(dificuldade === "facil" ? 5 : 8, dificuldade === "dificil" ? 30 : 20);
  const apenasA = randInt(dificuldade === "facil" ? 10 : 15, dificuldade === "dificil" ? 40 : 30);
  const apenasB = randInt(dificuldade === "facil" ? 10 : 15, dificuldade === "dificil" ? 40 : 30);
  const nenhum = randInt(dificuldade === "facil" ? 5 : 10, dificuldade === "dificil" ? 25 : 15);
  const totalA = apenasA + ambos;
  const totalB = apenasB + ambos;
  const totalGeral = apenasA + apenasB + ambos + nenhum;
  const pelosMenosUm = apenasA + apenasB + ambos;

  const fatosBase = `${totalA} pessoas ${grupoA}, ${totalB} pessoas ${grupoB}`;
  const modos = [
    {
      // Revela "ambos" e pede o total que faz pelo menos uma das duas coisas.
      fatosExtra: `, e ${ambos} pessoas fazem as duas coisas`,
      pergunta: `Quantas pessoas ${grupoA} ou ${grupoB} (pelo menos um dos dois)?`,
      correctText: `${pelosMenosUm}`,
      explicacao: `Pelo menos um dos dois = apenas ${grupoA} (${apenasA}) + apenas ${grupoB} (${apenasB}) + ambos (${ambos}) = ${pelosMenosUm}. Também pode ser calculado por |A∪B| = |A|+|B|−|A∩B| = ${totalA}+${totalB}−${ambos} = ${pelosMenosUm}.`,
      distractorTexts: [`${totalGeral}`, `${totalA + totalB}`, `${nenhum}`, `${apenasA + apenasB}`],
    },
    {
      // Revela "ambos" e pede quantas não fazem nenhuma das duas.
      fatosExtra: `, e ${ambos} pessoas fazem as duas coisas`,
      pergunta: `Quantas pessoas não ${grupoA} nem ${grupoB}?`,
      correctText: `${nenhum}`,
      explicacao: `O total pesquisado é ${totalGeral}. Os que fazem pelo menos uma das duas coisas somam ${pelosMenosUm} (apenas A: ${apenasA} + apenas B: ${apenasB} + ambos: ${ambos}). Logo, não fazem nenhuma das duas: ${totalGeral} − ${pelosMenosUm} = ${nenhum}.`,
      distractorTexts: [`${pelosMenosUm}`, `${totalGeral}`, `${apenasA}`, `${apenasB}`],
    },
    {
      // NÃO revela "ambos" (é o que se pede) — revela "nenhum" em vez disso.
      fatosExtra: `. Sabe-se ainda que ${nenhum} pessoas não se enquadram em nenhuma das duas situações`,
      pergunta: `Quantas pessoas ${grupoA} e ${grupoB} ao mesmo tempo?`,
      correctText: `${ambos}`,
      explicacao: `Quem faz pelo menos uma das duas coisas: ${totalGeral} − ${nenhum} = ${pelosMenosUm}. Pela fórmula |A∪B| = |A|+|B|−|A∩B|, temos ${pelosMenosUm} = ${totalA}+${totalB}−|A∩B|, logo |A∩B| = ${totalA}+${totalB}−${pelosMenosUm} = ${ambos}.`,
      distractorTexts: [`${totalA}`, `${totalB}`, `${apenasA}`, `${apenasB}`],
    },
  ];
  const modo = dificuldade === "dificil" ? modos[2] : dificuldade === "medio" ? modos[1] : modos[0];

  return makeQuestao({
    categoriaId: "conjuntos",
    subtopico: "Diagramas de Venn",
    dificuldade,
    enunciado: `Uma pesquisa foi realizada em ${lugar} com ${totalGeral} pessoas. Constatou-se que ${fatosBase}${modo.fatosExtra}. ${modo.pergunta}`,
    correctText: modo.correctText,
    distractorTexts: modo.distractorTexts,
    explicacao: modo.explicacao,
  });
}

function conjDiferenca(dificuldade) {
  const contextos = [
    ["moradores de um condomínio", "têm carro", "têm moto"],
    ["clientes de uma loja", "compraram pelo cartão", "compraram no débito"],
    ["alunos de uma turma", "fazem teatro", "fazem música"],
    ["visitantes de um site", "acessam pelo celular", "acessam pelo computador"],
  ];
  const [pessoas, grupoA, grupoB] = pick(contextos);
  // Construído de forma consistente por definição: parte-se dos quatro blocos do
  // diagrama de Venn (apenas A, apenas B, ambos, nenhum) e soma-se para obter os
  // totais divulgados no enunciado, evitando qualquer combinação inconsistente.
  const ambos = randInt(dificuldade === "facil" ? 5 : 10, dificuldade === "dificil" ? 40 : 25);
  const apenasA = randInt(dificuldade === "facil" ? 15 : 20, dificuldade === "dificil" ? 60 : 40);
  const apenasB = randInt(dificuldade === "facil" ? 15 : 20, dificuldade === "dificil" ? 60 : 40);
  const nenhum = randInt(dificuldade === "facil" ? 5 : 8, dificuldade === "dificil" ? 30 : 18);
  const totalA = apenasA + ambos;
  const totalB = apenasB + ambos;
  const pelosMenosUm = apenasA + apenasB + ambos;
  const totalGeral = pelosMenosUm + nenhum;

  const correctText = `${ambos}`;
  const distractorTexts = [`${pelosMenosUm}`, `${totalA + totalB}`, `${totalA - ambos}`, `${totalB - ambos}`];
  return makeQuestao({
    categoriaId: "conjuntos",
    subtopico: "Problemas de Pesquisa",
    dificuldade,
    enunciado: `Em uma pesquisa com ${totalGeral} ${pessoas}, verificou-se que ${totalA} ${grupoA}, ${totalB} ${grupoB}, e ${nenhum} não se enquadram em nenhuma das duas situações. Quantas pessoas, dentre as pesquisadas, ${grupoA} e ${grupoB} ao mesmo tempo?`,
    correctText,
    distractorTexts,
    explicacao: `Quem se enquadra em pelo menos uma situação: ${totalGeral} − ${nenhum} = ${pelosMenosUm}. Pela fórmula |A∪B| = |A|+|B|−|A∩B|, temos ${pelosMenosUm} = ${totalA}+${totalB}−|A∩B|, logo |A∩B| = ${totalA}+${totalB}−${pelosMenosUm} = ${ambos}.`,
  });
}

// Helpers locais de Conjuntos ------------------------------------------------
function _conjOk(correct, distractors) {
  const all = [String(correct), ...distractors.map((d) => String(d))];
  if (all.some((s) => s.includes("undefined") || s.includes("NaN"))) return false;
  return new Set(all).size === all.length;
}
function _conjDivs(k) {
  const d = [];
  for (let x = 1; x <= k; x++) if (k % x === 0) d.push(x);
  return d;
}
function _conjFat(k) {
  let r = 1;
  for (let x = 2; x <= k; x++) r *= x;
  return r;
}
function _conjSet(elems) {
  return `{${[...elems].sort((a, b) => a - b).join(", ")}}`;
}
function _conjMontaAB(dificuldade) {
  const universo = Array.from({ length: 20 }, (_, i) => i + 1);
  const hi = dificuldade === "facil" ? 3 : dificuldade === "dificil" ? 5 : 4;
  const interN = randInt(2, hi);
  const aOnlyN = randInt(2, hi);
  const bOnlyN = randInt(2, hi);
  const sorteados = shuffle(universo).slice(0, interN + aOnlyN + bOnlyN);
  const inter = sorteados.slice(0, interN);
  const aOnly = sorteados.slice(interN, interN + aOnlyN);
  const bOnly = sorteados.slice(interN + aOnlyN);
  return { interN, aOnlyN, bOnlyN, A: [...inter, ...aOnly], B: [...inter, ...bOnly] };
}

// 1 — |A ∪ B| = |A| + |B| − |A ∩ B| (e as recíprocas)
function conjUniaoDeInterseccao(dificuldade, tentativa = 0) {
  const a = randInt(12, 30);
  const b = randInt(12, 30);
  const i = randInt(3, Math.min(a, b) - 3);
  const u = a + b - i;
  let enunciado, correctText, distractorTexts, explicacao;
  if (dificuldade === "facil") {
    const correct = u;
    const distr = [a + b, a + b - 2 * i, Math.abs(a - b) + i, Math.max(a, b)];
    enunciado = `Sejam A e B dois conjuntos finitos tais que |A| = ${a}, |B| = ${b} e |A ∩ B| = ${i}. Qual é o valor de |A ∪ B|?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Pelo princípio da inclusão-exclusão, |A ∪ B| = |A| + |B| − |A ∩ B| = ${a} + ${b} − ${i} = ${correct}.`;
  } else if (dificuldade === "medio") {
    const correct = i;
    const distr = [b - i, a - i, a + b, Math.abs(a - b)];
    enunciado = `Sejam A e B dois conjuntos finitos com |A| = ${a}, |B| = ${b} e |A ∪ B| = ${u}. Qual é o valor de |A ∩ B|?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `De |A ∪ B| = |A| + |B| − |A ∩ B|, isolamos |A ∩ B| = |A| + |B| − |A ∪ B| = ${a} + ${b} − ${u} = ${correct}.`;
  } else {
    const correct = b;
    const distr = [u - a, u - a - i, u + a - i, a + i];
    enunciado = `Sejam A e B conjuntos finitos com |A ∪ B| = ${u}, |A ∩ B| = ${i} e |A| = ${a}. Qual é o valor de |B|?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `De |A ∪ B| = |A| + |B| − |A ∩ B|, isolamos |B| = |A ∪ B| − |A| + |A ∩ B| = ${u} − ${a} + ${i} = ${correct}.`;
  }
  if (tentativa < 40 && (a === b || !_conjOk(correctText, distractorTexts)))
    return conjUniaoDeInterseccao(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 2 — complementar: |Aᶜ| = |U| − |A|
function conjComplementar(dificuldade, tentativa = 0) {
  const contextos = [
    ["uma turma", "estudantes", "foram aprovados na primeira fase"],
    ["um condomínio", "moradores", "possuem vaga de garagem"],
    ["uma empresa", "funcionários", "aderiram ao plano de saúde"],
    ["um clube", "sócios", "já disputaram um torneio oficial"],
  ];
  const [lugar, unidade, prop] = pick(contextos);
  let enunciado, correctText, distractorTexts, explicacao, guardExtra = false;
  if (dificuldade === "facil") {
    const u = randInt(30, 60);
    const k = randInt(10, u - 10);
    const correct = u - k;
    const distr = [k, u, Math.abs(u - 2 * k), u + k];
    guardExtra = u === 2 * k;
    enunciado = `Em ${lugar} há ${u} ${unidade}, dos quais ${k} ${prop}. Quantos ${unidade} não ${prop}?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Basta retirar do total os que ${prop}: ${u} − ${k} = ${correct}.`;
  } else if (dificuldade === "medio") {
    const u = randInt(50, 90);
    const comp = randInt(15, u - 15);
    const correct = u - comp;
    const distr = [comp, u, Math.abs(u - 2 * comp), u + comp];
    guardExtra = u === 2 * comp;
    enunciado = `Em ${lugar} com ${u} ${unidade}, sabe-se que ${comp} não ${prop}. Quantos ${unidade} ${prop}?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Se ${comp} não ${prop}, os demais ${prop}: ${u} − ${comp} = ${correct}.`;
  } else {
    const u = randInt(90, 150);
    const x1 = randInt(15, 35);
    const x2 = randInt(15, 35);
    const correct = u - x1 - x2;
    const distr = [u - x1, u - x2, x1 + x2, Math.abs(x1 - x2)];
    guardExtra = x1 === x2;
    enunciado = `Em ${lugar} há ${u} ${unidade}. Sabe-se que ${x1} ${prop} e outros ${x2} têm uma segunda característica, sem que ninguém pertença aos dois grupos ao mesmo tempo. Quantos ${unidade} não pertencem a nenhum dos dois grupos?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Como os dois grupos não têm elementos em comum, retiram-se ambos do total: ${u} − ${x1} − ${x2} = ${correct}.`;
  }
  if (tentativa < 40 && (guardExtra || !_conjOk(correctText, distractorTexts)))
    return conjComplementar(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 3 — três conjuntos, inclusão-exclusão (só A / centro / total)
function conjTresConjuntos(dificuldade, tentativa = 0) {
  const soA = randInt(10, 16), soB = randInt(10, 16), soC = randInt(10, 16);
  const abO = randInt(3, 8), acO = randInt(3, 8), bcO = randInt(3, 8);
  const ce = randInt(2, 4);
  const A = soA + abO + acO + ce;
  const B = soB + abO + bcO + ce;
  const C = soC + acO + bcO + ce;
  const abT = abO + ce, acT = acO + ce, bcT = bcO + ce;
  const uni = soA + soB + soC + abO + acO + bcO + ce;
  let enunciado, correctText, distractorTexts, explicacao;
  if (dificuldade === "facil") {
    const correct = soA;
    const distr = [A - abT - acT, A - abT - acT - ce, A - ce, abO + acO + ce];
    enunciado = `Considere três conjuntos A, B e C para os quais |A| = ${A}, |A ∩ B| = ${abT}, |A ∩ C| = ${acT} e |A ∩ B ∩ C| = ${ce}. Quantos elementos pertencem apenas ao conjunto A (e a nenhum dos outros dois)?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `|A| = (só A) + |A ∩ B| + |A ∩ C| − |A ∩ B ∩ C| (o centro foi contado nas duas interseções). Logo só A = ${A} − ${abT} − ${acT} + ${ce} = ${correct}.`;
  } else if (dificuldade === "medio") {
    const correct = ce;
    const distr = [uni - soA - soB - soC, uni - abO - acO - bcO, abO + acO + bcO, soA + soB + soC];
    enunciado = `Em um diagrama de Venn de três conjuntos A, B e C, o número de elementos de cada região é: apenas A: ${soA}; apenas B: ${soB}; apenas C: ${soC}; apenas em A e B: ${abO}; apenas em A e C: ${acO}; apenas em B e C: ${bcO}. Se |A ∪ B ∪ C| = ${uni}, quantos elementos estão em A ∩ B ∩ C?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `A união é a soma das 7 regiões. As 6 regiões conhecidas somam ${soA} + ${soB} + ${soC} + ${abO} + ${acO} + ${bcO} = ${uni - ce}. O centro é o que falta: ${uni} − ${uni - ce} = ${correct}.`;
  } else {
    const correct = uni;
    const distr = [A + B + C, A + B + C - abT - acT - bcT, A + B + C - abT - acT - bcT - ce, A + B + C + abT + acT + bcT];
    enunciado = `Sejam A, B e C três conjuntos finitos com |A| = ${A}, |B| = ${B}, |C| = ${C}, |A ∩ B| = ${abT}, |A ∩ C| = ${acT}, |B ∩ C| = ${bcT} e |A ∩ B ∩ C| = ${ce}. Qual é o valor de |A ∪ B ∪ C|?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Inclusão-exclusão: |A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C| = ${A} + ${B} + ${C} − ${abT} − ${acT} − ${bcT} + ${ce} = ${correct}.`;
  }
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjTresConjuntos(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "Diagramas de Venn", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 4 — três conjuntos, contexto esportivo (só um / exatamente dois / os três)
function conjTresConjuntosEsporte(dificuldade, tentativa = 0) {
  const contextos = [
    ["futebol", "vôlei", "basquete"],
    ["natação", "corrida de rua", "ciclismo"],
    ["tênis", "handebol", "judô"],
    ["surfe", "skate", "vôlei de praia"],
    ["xadrez", "damas", "gamão"],
  ];
  const [s1, s2, s3] = pick(contextos);
  const so1 = randInt(10, 20), so2 = randInt(10, 20), so3 = randInt(10, 20);
  const p12 = randInt(3, 9), p13 = randInt(3, 9), p23 = randInt(3, 9);
  const ce = randInt(2, 6);
  const nenhum = randInt(5, 15);
  const t1 = so1 + p12 + p13 + ce;
  const p12T = p12 + ce, p13T = p13 + ce, p23T = p23 + ce;
  const soma = so1 + so2 + so3 + p12 + p13 + p23;
  const uni = soma + ce;
  const total = uni + nenhum;
  let enunciado, correctText, distractorTexts, explicacao;
  if (dificuldade === "facil") {
    const correct = so1;
    const distr = [t1 - p12T - p13T, t1 - p12T - p13T - ce, t1 - ce, p12 + p13 + ce];
    enunciado = `Em um levantamento sobre esportes, ${t1} pessoas praticam ${s1}, das quais ${p12T} também praticam ${s2}, ${p13T} também praticam ${s3} e ${ce} praticam os três esportes. Quantas pessoas praticam somente ${s1}?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Somente ${s1} = (praticam ${s1}) − (também ${s2}) − (também ${s3}) + (os três, que foram descontados duas vezes) = ${t1} − ${p12T} − ${p13T} + ${ce} = ${correct}.`;
  } else if (dificuldade === "medio") {
    const correct = p12 + p13 + p23;
    const distr = [p12T + p13T + p23T, p12T + p13T + p23T - ce, p12T + p13T + p23T - 2 * ce, ce];
    enunciado = `Numa pesquisa esportiva, ${p12T} pessoas praticam ${s1} e ${s2}, ${p13T} praticam ${s1} e ${s3}, ${p23T} praticam ${s2} e ${s3}, e ${ce} praticam os três esportes ${s1}, ${s2} e ${s3}. Quantas pessoas praticam exatamente dois desses esportes?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Cada contagem "dois a dois" inclui quem pratica os três. Exatamente dois = (${p12T} − ${ce}) + (${p13T} − ${ce}) + (${p23T} − ${ce}) = ${correct}.`;
  } else {
    const correct = ce;
    const distr = [total - soma, total - nenhum - (so1 + so2 + so3), total - nenhum - (p12 + p13 + p23), p12 + p13 + p23];
    enunciado = `Entre ${total} pessoas entrevistadas, ${nenhum} não praticam ${s1}, ${s2} nem ${s3}. Das demais: ${so1} praticam só ${s1}, ${so2} só ${s2}, ${so3} só ${s3}, ${p12} praticam ${s1} e ${s2} (mas não o terceiro), ${p13} praticam ${s1} e ${s3} (mas não o terceiro) e ${p23} praticam ${s2} e ${s3} (mas não o terceiro). Quantas praticam os três esportes?`;
    correctText = `${correct}`;
    distractorTexts = distr.map((v) => `${v}`);
    explicacao = `Tirando os ${nenhum} que não praticam nada, sobram ${uni} pessoas nas 7 regiões. As 6 regiões descritas somam ${soma}. Logo, praticam os três: ${uni} − ${soma} = ${correct}.`;
  }
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjTresConjuntosEsporte(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "Diagramas de Venn", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 5 — conjuntos explícitos: contagem de A ∩ B / A ∪ B / A − B
function conjOperacoesExplicitas(dificuldade, tentativa = 0) {
  const { interN, aOnlyN, bOnlyN, A, B } = _conjMontaAB(dificuldade);
  let op, correct, distr, explicacao;
  if (dificuldade === "facil") {
    op = "A ∩ B";
    correct = interN;
    distr = [interN + aOnlyN + bOnlyN, A.length, B.length, A.length + B.length];
    explicacao = `A ∩ B é formado pelos elementos que aparecem nos dois conjuntos ao mesmo tempo. Comparando as listas, há ${interN} elemento(s) em comum.`;
  } else if (dificuldade === "medio") {
    op = "A ∪ B";
    correct = interN + aOnlyN + bOnlyN;
    distr = [A.length + B.length, interN, A.length, B.length];
    explicacao = `A ∪ B reúne todos os elementos sem repetir os comuns: |A| + |B| − |A ∩ B| = ${A.length} + ${B.length} − ${interN} = ${correct}.`;
  } else {
    op = "A − B";
    correct = aOnlyN;
    distr = [A.length, bOnlyN, interN, A.length + interN];
    explicacao = `A − B são os elementos que estão em A mas não em B. Dos ${A.length} elementos de A, ${interN} também estão em B, restando ${aOnlyN}.`;
  }
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  const enunciado = `Considere os conjuntos A = ${_conjSet(A)} e B = ${_conjSet(B)}. Quantos elementos tem o conjunto ${op}?`;
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjOperacoesExplicitas(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 6 — diferença simétrica: |A △ B| = |A| + |B| − 2|A ∩ B|
function conjDiferencaSimetrica(dificuldade, tentativa = 0) {
  const { interN, aOnlyN, bOnlyN, A, B } = _conjMontaAB(dificuldade);
  const correct = aOnlyN + bOnlyN;
  const distr = [aOnlyN + bOnlyN + interN, aOnlyN + bOnlyN + 2 * interN, interN, Math.abs(aOnlyN - bOnlyN)];
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  const enunciado = `Dados os conjuntos A = ${_conjSet(A)} e B = ${_conjSet(B)}, a diferença simétrica A △ B é o conjunto dos elementos que pertencem a exatamente um dos dois conjuntos. Quantos elementos tem A △ B?`;
  const explicacao = `A △ B contém os elementos que estão só em A (${aOnlyN}) e os que estão só em B (${bOnlyN}), sem os ${interN} elementos comuns. Logo |A △ B| = ${aOnlyN} + ${bOnlyN} = ${correct}.`;
  if (tentativa < 40 && (aOnlyN === bOnlyN || !_conjOk(correctText, distractorTexts)))
    return conjDiferencaSimetrica(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 7 — produto cartesiano: |A × B| = |A| · |B|
function conjProdutoCartesiano(dificuldade, tentativa = 0) {
  let enunciado, correct, distr, explicacao;
  if (dificuldade === "facil") {
    const m = randInt(3, 8);
    let n = randInt(3, 8);
    if (n === m) n = m === 8 ? 3 : n + 1;
    correct = m * n;
    distr = [m + n, m * m, n * n, 2 * m * n];
    enunciado = `Um conjunto A tem ${m} elementos e um conjunto B tem ${n} elementos. Quantos elementos tem o produto cartesiano A × B?`;
    explicacao = `Cada elemento de A forma um par ordenado com cada elemento de B: |A × B| = |A| · |B| = ${m} · ${n} = ${correct}.`;
  } else if (dificuldade === "medio") {
    const { A } = _conjMontaAB("medio");
    const m = A.length;
    const n = randInt(4, 9);
    correct = m * n;
    distr = [m + n, m * m, n * n, 2 * m * n];
    enunciado = `Sejam A = ${_conjSet(A)} e B um conjunto com ${n} elementos. Quantos pares ordenados formam o produto cartesiano A × B?`;
    explicacao = `A tem ${m} elementos e B tem ${n}. O produto cartesiano tem |A| · |B| = ${m} · ${n} = ${correct} pares ordenados.`;
  } else {
    const m = randInt(4, 9);
    const n = randInt(4, 9);
    const p = m * n;
    correct = n;
    distr = [p - m, p + m, 2 * n, p - n];
    enunciado = `O produto cartesiano A × B tem ${p} elementos. Se o conjunto A tem ${m} elementos, quantos elementos tem o conjunto B?`;
    explicacao = `Como |A × B| = |A| · |B|, temos |B| = ${p} ÷ ${m} = ${correct}.`;
  }
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjProdutoCartesiano(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 8 — subconjuntos: 2ⁿ (total), 2ⁿ − 1 (próprios), 2ⁿ − 2 (não triviais)
function conjSubconjuntos(dificuldade, tentativa = 0) {
  const n = randInt(5, 7);
  const pot = 2 ** n;
  let enunciado, correct, distr, explicacao;
  if (dificuldade === "facil") {
    correct = pot;
    distr = [n * n, 2 * n, _conjFat(n), pot - 1];
    enunciado = `Um conjunto X possui ${n} elementos. Quantos subconjuntos, no total (incluindo o conjunto vazio e o próprio X), esse conjunto tem?`;
    explicacao = `O número de subconjuntos de um conjunto com n elementos é 2ⁿ. Para n = ${n}: 2^${n} = ${correct}.`;
  } else if (dificuldade === "medio") {
    correct = pot - 1;
    distr = [pot, pot - 2, n * n - 1, 2 * n - 1];
    enunciado = `Um conjunto Y possui ${n} elementos. Quantos subconjuntos próprios (todos os subconjuntos, exceto o próprio Y) esse conjunto tem?`;
    explicacao = `São 2ⁿ subconjuntos no total; retirando o próprio conjunto, ficam 2ⁿ − 1. Para n = ${n}: ${pot} − 1 = ${correct}.`;
  } else {
    correct = pot - 2;
    distr = [pot, pot - 1, 2 ** (n - 1), n * n - 2];
    enunciado = `Um conjunto Z possui ${n} elementos. Quantos subconjuntos de Z são diferentes tanto do conjunto vazio quanto do próprio Z?`;
    explicacao = `Do total de 2ⁿ subconjuntos, excluem-se 2 casos (o vazio e o próprio Z): 2ⁿ − 2. Para n = ${n}: ${pot} − 2 = ${correct}.`;
  }
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjSubconjuntos(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 9 — interseção/união de intervalos reais que se sobrepõem
function conjIntervalosReais(dificuldade, tentativa = 0) {
  const nums = [];
  while (nums.length < 4) {
    const v = randInt(-4, 14);
    if (!nums.includes(v)) nums.push(v);
  }
  nums.sort((a, b) => a - b);
  const [p1, p2, p3, p4] = nums;
  let enunciado, correctText, distractorTexts, explicacao;
  if (dificuldade === "facil") {
    correctText = `[${p2}, ${p3}]`;
    distractorTexts = [`[${p1}, ${p4}]`, `[${p1}, ${p3}]`, `[${p2}, ${p4}]`, `[${p3}, ${p2}]`];
    enunciado = `Considere os intervalos reais A = [${p1}, ${p3}] e B = [${p2}, ${p4}]. Qual intervalo representa A ∩ B?`;
    explicacao = `A interseção contém os números que estão nos dois intervalos: de ${p2} (maior extremo esquerdo) até ${p3} (menor extremo direito), ou seja [${p2}, ${p3}].`;
  } else if (dificuldade === "medio") {
    correctText = `[${p1}, ${p4}]`;
    distractorTexts = [`[${p2}, ${p3}]`, `[${p1}, ${p3}]`, `[${p2}, ${p4}]`, `]${p1}, ${p4}[`];
    enunciado = `Considere os intervalos reais A = [${p1}, ${p3}] e B = [${p2}, ${p4}]. Qual intervalo representa A ∪ B?`;
    explicacao = `Como os intervalos se sobrepõem, a união é um único intervalo do menor extremo (${p1}) ao maior extremo (${p4}): [${p1}, ${p4}].`;
  } else {
    correctText = `[${p2}, ${p3}]`;
    distractorTexts = [`[${p1}, ${p4}]`, `[${p1}, ${p3}]`, `[${p2}, ${p4}]`, `∅`];
    enunciado = `Considere os intervalos reais A = [${p1}, ${p4}] e B = [${p2}, ${p3}]. Qual intervalo representa A ∩ B?`;
    explicacao = `Como B = [${p2}, ${p3}] está inteiramente contido em A = [${p1}, ${p4}], a interseção é o próprio B: [${p2}, ${p3}].`;
  }
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjIntervalosReais(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 10 — múltiplos de p ou de q até N: ⌊N/p⌋ + ⌊N/q⌋ − ⌊N/mmc(p,q)⌋
function conjMultiplos(dificuldade, tentativa = 0) {
  const p = pick([2, 3, 4, 5, 6]);
  let q = pick([3, 4, 5, 6, 7, 8, 9]);
  if (q === p) q = p === 9 ? 7 : q + 1;
  if (tentativa < 40 && (q % p === 0 || p % q === 0))
    return conjMultiplos(dificuldade, tentativa + 1);
  const N = randInt(dificuldade === "facil" ? 6 : 10, dificuldade === "dificil" ? 40 : 25) * 10;
  const l = mmc(p, q);
  const fp = Math.floor(N / p), fq = Math.floor(N / q), fl = Math.floor(N / l);
  const correct = fp + fq - fl;
  const distr = [fp + fq, fp + fq + fl, N - correct, fl];
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  const alcance = dificuldade === "dificil"
    ? `no conjunto {1, 2, 3, ..., ${N}}`
    : dificuldade === "medio"
      ? `menores ou iguais a ${N}`
      : `de 1 a ${N}`;
  const enunciado = `Quantos números naturais ${alcance} são múltiplos de ${p} ou múltiplos de ${q}?`;
  const explicacao = `Múltiplos de ${p}: ⌊${N}/${p}⌋ = ${fp}. Múltiplos de ${q}: ⌊${N}/${q}⌋ = ${fq}. Múltiplos de ${p} e de ${q} ao mesmo tempo (múltiplos de mmc(${p}, ${q}) = ${l}): ${fl}. Por inclusão-exclusão: ${fp} + ${fq} − ${fl} = ${correct}.`;
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjMultiplos(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "União e Interseção", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 11 — três idiomas: nenhuma / exatamente dois / os três
function conjTresLinguas(dificuldade, tentativa = 0) {
  const contextos = [
    ["inglês", "espanhol", "francês"],
    ["inglês", "alemão", "italiano"],
    ["espanhol", "francês", "alemão"],
  ];
  const [l1, l2, l3] = pick(contextos);
  const so1 = randInt(12, 25), so2 = randInt(12, 25), so3 = randInt(12, 25);
  const o12 = randInt(3, 9), o13 = randInt(3, 9), o23 = randInt(3, 9);
  const ce = randInt(2, 6);
  const nenhum = randInt(4, 14);
  const t12 = o12 + ce, t13 = o13 + ce, t23 = o23 + ce;
  const somaSo = so1 + so2 + so3;
  const somaO = o12 + o13 + o23;
  const uni = somaSo + somaO + ce;
  const total = uni + nenhum;
  let enunciado, correct, distr, explicacao;
  if (dificuldade === "facil") {
    correct = nenhum;
    distr = [total - somaSo, uni, total - somaSo - somaO, uni - ce];
    enunciado = `Uma turma tem ${total} alunos. Sobre os idiomas que estudam: ${so1} estudam apenas ${l1}, ${so2} apenas ${l2}, ${so3} apenas ${l3}, ${o12} apenas ${l1} e ${l2}, ${o13} apenas ${l1} e ${l3}, ${o23} apenas ${l2} e ${l3}, e ${ce} estudam os três idiomas. Quantos alunos não estudam nenhum desses idiomas?`;
    explicacao = `Somando as 7 regiões: ${so1}+${so2}+${so3}+${o12}+${o13}+${o23}+${ce} = ${uni} alunos estudam ao menos um idioma. Logo, não estudam nenhum: ${total} − ${uni} = ${correct}.`;
  } else if (dificuldade === "medio") {
    correct = somaO;
    distr = [t12 + t13 + t23, t12 + t13 + t23 - ce, t12 + t13 + t23 - 2 * ce, ce];
    enunciado = `Em um colégio, ${t12} alunos estudam ${l1} e ${l2}, ${t13} estudam ${l1} e ${l3}, ${t23} estudam ${l2} e ${l3}, e ${ce} estudam os três idiomas ${l1}, ${l2} e ${l3}. Quantos alunos estudam exatamente dois desses idiomas?`;
    explicacao = `Cada total "dois idiomas" inclui os ${ce} que estudam os três. Exatamente dois = (${t12} − ${ce}) + (${t13} − ${ce}) + (${t23} − ${ce}) = ${correct}.`;
  } else {
    correct = ce;
    distr = [total - somaSo - somaO, uni - somaSo, uni - somaO, somaO];
    enunciado = `Numa escola com ${total} estudantes, ${nenhum} não estudam ${l1}, ${l2} nem ${l3}. Entre os demais: ${so1} estudam somente ${l1}, ${so2} somente ${l2}, ${so3} somente ${l3}, ${o12} estudam ${l1} e ${l2} apenas, ${o13} estudam ${l1} e ${l3} apenas, e ${o23} estudam ${l2} e ${l3} apenas. Quantos estudam os três idiomas?`;
    explicacao = `Tirando os ${nenhum} que não estudam nada, sobram ${uni} nas 7 regiões. As 6 regiões descritas somam ${somaSo} + ${somaO} = ${uni - ce}. Logo, os três idiomas: ${uni} − ${uni - ce} = ${correct}.`;
  }
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjTresLinguas(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "Diagramas de Venn", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 12 — pesquisa de compra de 3 produtos: quem comprou exatamente um
function conjPesquisaProduto(dificuldade, tentativa = 0) {
  const contextos = [
    ["sabonete", "shampoo", "condicionador"],
    ["café", "leite", "achocolatado"],
    ["caderno", "caneta", "mochila"],
    ["arroz", "feijão", "macarrão"],
  ];
  const [x, y, z] = pick(contextos);
  const t3 = randInt(3, 10);
  const d2 = randInt(8, 20);
  const n0 = randInt(6, 16);
  const u1 = randInt(15, 35);
  const total = t3 + d2 + n0 + u1;
  const correct = u1;
  const distr = [total - n0, total - n0 - t3, total - n0 - d2, d2];
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  let enunciado, explicacao;
  if (dificuldade === "facil") {
    enunciado = `Uma pesquisa de mercado ouviu ${total} consumidores sobre a compra dos produtos ${x}, ${y} e ${z}. Constatou-se que ${t3} compraram os três produtos, ${d2} compraram exatamente dois deles e ${n0} não compraram nenhum. Quantos consumidores compraram exatamente um dos três produtos?`;
    explicacao = `Do total de ${total}, retiram-se quem não comprou nada (${n0}), quem comprou os três (${t3}) e quem comprou exatamente dois (${d2}). Restam os que compraram exatamente um: ${total} − ${n0} − ${t3} − ${d2} = ${correct}.`;
  } else if (dificuldade === "medio") {
    enunciado = `Em uma pesquisa com ${total} clientes sobre os produtos ${x}, ${y} e ${z}, verificou-se que ${n0} não levaram nenhum, ${d2} levaram exatamente dois e ${t3} levaram os três. Quantos clientes levaram exatamente um dos produtos?`;
    explicacao = `Os clientes formam quatro grupos disjuntos: nenhum (${n0}), exatamente um, exatamente dois (${d2}) e os três (${t3}). Logo, exatamente um = ${total} − ${n0} − ${d2} − ${t3} = ${correct}.`;
  } else {
    enunciado = `${total} pessoas foram consultadas sobre ter adquirido ${x}, ${y} e ${z} no último mês. Sabe-se que ${n0} não adquiriram nenhum desses itens, ${t3} adquiriram os três e ${d2} adquiriram exatamente dois deles. Quantas pessoas adquiriram exatamente um item?`;
    explicacao = `Somando os grupos que não são "exatamente um": ${n0} + ${d2} + ${t3} = ${n0 + d2 + t3}. Subtraindo do total: ${total} − ${n0 + d2 + t3} = ${correct}.`;
  }
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjPesquisaProduto(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "Problemas de Pesquisa", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

// 13 — conjunto dos divisores: quantos / quantos pares / |D(n) ∩ D(m)| = |D(mdc(n,m))|
function conjDivisores(dificuldade, tentativa = 0) {
  let enunciado, correct, distr, explicacao;
  if (dificuldade === "dificil") {
    const n = randInt(24, 120);
    const m = randInt(24, 120);
    const g = gcd(n, m);
    if (tentativa < 40 && g === 1) return conjDivisores(dificuldade, tentativa + 1);
    correct = _conjDivs(g).length;
    distr = [_conjDivs(n).length, _conjDivs(m).length, g, _conjDivs(mmc(n, m)).length];
    enunciado = `Sejam D(${n}) e D(${m}) os conjuntos dos divisores positivos de ${n} e de ${m}. Quantos elementos tem D(${n}) ∩ D(${m})?`;
    explicacao = `Um número divide ${n} e ${m} ao mesmo tempo se, e somente se, divide mdc(${n}, ${m}) = ${g}. Os divisores de ${g} são ${_conjDivs(g).join(", ")}: ${correct} no total.`;
  } else {
    const n = 2 * randInt(12, 60);
    const divs = _conjDivs(n);
    const pares = divs.filter((d) => d % 2 === 0).length;
    const impares = divs.length - pares;
    if (dificuldade === "facil") {
      correct = divs.length;
      distr = [divs.length - 2, divs.length + 1, pares, impares];
      enunciado = `Considere o conjunto D formado por todos os divisores positivos de ${n}. Quantos elementos tem D?`;
      explicacao = `Os divisores positivos de ${n} são ${divs.join(", ")}, num total de ${correct}.`;
    } else {
      correct = pares;
      distr = [divs.length, impares, divs.length - 1, Math.floor(n / 2)];
      enunciado = `No conjunto dos divisores positivos de ${n}, quantos são números pares?`;
      explicacao = `Os divisores positivos de ${n} são ${divs.join(", ")}. Os pares são ${divs.filter((d) => d % 2 === 0).join(", ")}: ${correct} divisor(es) par(es).`;
    }
  }
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  if (tentativa < 40 && !_conjOk(correctText, distractorTexts))
    return conjDivisores(dificuldade, tentativa + 1);
  return makeQuestao({ categoriaId: "conjuntos", subtopico: "Problemas de Pesquisa", dificuldade, enunciado, correctText, distractorTexts, explicacao });
}

export const TEMPLATES = {
  numeros: [numFracaoOperacoes, numNotacaoCientifica],
  porcentagem: [pctAumentoDesconto, pctJurosSimples],
  "razao-proporcao": [razaoEscalaMapa, razaoDivisaoProporcional],
  "regra-de-tres": [regraTresSimples, regraTresComposta],
  equacoes: [eqSistemaLinear, eqBhaskaraArea],
  "funcao-afim": [afimTarifa, afimCoeficiente],
  "funcao-quadratica": [quadVertice, quadTrajetoria],
  "exponenciais-logaritmos": [expCrescimento, expMeiaVida],
  progressoes: [progPA, progPG],
  "geometria-plana": [geoAreaPerimetro, geoPitagoras],
  "geometria-espacial": [geoVolumePrisma, geoVolumeCilindro, geoVolumeCone, geoVolumePiramide, geoEsfera, geoPlanificacaoCaixa],
  "geometria-analitica": [geoDistanciaPontos, geoEquacaoReta],
  trigonometria: [trigTrianguloRetangulo],
  estatistica: [estMedia, estMediana, estLeituraGraficoDiferenca, estLeituraGraficoTotal, estLeituraGraficoPercentual],
  probabilidade: [probSimples, probSucessiva],
  "analise-combinatoria": [combMultiplicativo, combComissao],
  "matematica-financeira": [finJurosCompostos],
  matrizes: [matDeterminante, matDeterminante3x3, matSoma, matSubtracao, matEscalar, matProduto, matTransposta, matTraco, matIgualdade, matLeiDeFormacao, matSimetrica, matPotencia, matInversa, matDeterminanteComIncognita, matCramer, matFaturamento, matIdentidadePropriedade],
  logica: [logSequencia, logRaciocinioIdade],
  conjuntos: [conjDoisConjuntos, conjDiferenca, conjUniaoDeInterseccao, conjComplementar, conjTresConjuntos, conjTresConjuntosEsporte, conjOperacoesExplicitas, conjDiferencaSimetrica, conjProdutoCartesiano, conjSubconjuntos, conjIntervalosReais, conjMultiplos, conjTresLinguas, conjPesquisaProduto, conjDivisores],
};
