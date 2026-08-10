import { randInt, randFloat, pick, brl, pct, makeQuestao, gcd } from "./helpers.mjs";

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
  const pedirArea = Math.random() > 0.5;
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
    subtopico: "Cones e Pirâmides",
    dificuldade,
    enunciado: `Uma lata cilíndrica tem raio da base igual a ${raio} cm e altura igual a ${altura} cm. Usando π ≈ 22/7, qual é o volume aproximado dessa lata?`,
    correctText,
    distractorTexts,
    explicacao: `Volume do cilindro = π × r² × h ≈ (22/7) × ${raio}² × ${altura} = ${correctText}.`,
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

// ---------- LOGICA ----------
function logSequencia(dificuldade) {
  const a1 = randInt(1, 10);
  const r = randInt(2, dificuldade === "dificil" ? 12 : 6);
  const tipo = Math.random() > 0.5 ? "soma" : "razao";
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
  "geometria-espacial": [geoVolumePrisma, geoVolumeCilindro],
  "geometria-analitica": [geoDistanciaPontos, geoEquacaoReta],
  trigonometria: [trigTrianguloRetangulo],
  estatistica: [estMedia, estMediana],
  probabilidade: [probSimples, probSucessiva],
  "analise-combinatoria": [combMultiplicativo, combComissao],
  "matematica-financeira": [finJurosCompostos],
  matrizes: [matDeterminante],
  logica: [logSequencia, logRaciocinioIdade],
};
