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

function afimRaiz(dificuldade, tentativa = 0) {
  const contextos = [
    ["A quantidade de água em um reservatório", "litros", "horas", "o reservatório fica vazio"],
    ["O saldo devedor de um empréstimo", "reais", "meses", "a dívida é quitada"],
    ["A carga restante de uma bateria", "quilojoules", "minutos", "a bateria se esgota"],
    ["O volume de ração em um silo automático", "quilogramas", "dias", "o silo fica vazio"],
  ];
  const [obj, unidade, tempo, evento] = pick(contextos);
  const a = randInt(dificuldade === "facil" ? 2 : 3, dificuldade === "dificil" ? 8 : 6);
  const q = randInt(dificuldade === "facil" ? 3 : 4, dificuldade === "dificil" ? 12 : 10);
  const b = a * q;
  const correctText = `${q} ${tempo}`;
  const distractorTexts = [
    `${b * a} ${tempo}`,
    `${b + a} ${tempo}`,
    `${b - a} ${tempo}`,
    `${b} ${tempo}`,
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return afimRaiz(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "f(x) = ax + b",
    dificuldade,
    enunciado: `${obj}, em ${unidade}, em função do tempo t (em ${tempo}), é modelada pela função afim f(t) = ${b} − ${a}t. Após quantos ${tempo} ${evento}?`,
    correctText,
    distractorTexts,
    explicacao: `O evento ocorre quando f(t) = 0. Resolvendo ${b} − ${a}t = 0, temos ${a}t = ${b}, logo t = ${b} ÷ ${a} = ${q} ${tempo}.`,
  });
}

function afimDepreciacao(dificuldade, tentativa = 0) {
  const contextos = [
    ["uma máquina industrial", "de uma indústria de embalagens"],
    ["um caminhão de carga", "de uma transportadora"],
    ["um trator", "de uma propriedade rural"],
    ["um aparelho de tomografia", "de uma clínica de diagnóstico"],
  ];
  const [bem, dono] = pick(contextos);
  const d = pick([1000, 1500, 2000, 2500, 3000, 4000, 5000]);
  let M = randInt(dificuldade === "facil" ? 15 : 18, dificuldade === "dificil" ? 40 : 30);
  const V0 = d * M;
  const modo = dificuldade === "dificil" ? "tempo" : "valor";
  if (modo === "valor") {
    const t = randInt(3, 9);
    const valor = V0 - d * t;
    const correctText = brl(valor);
    const distractorTexts = [
      brl(V0 + d * t),
      brl(V0 - d * (t + 2)),
      brl(V0 - d * (t - 2)),
      brl(V0),
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return afimDepreciacao(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "funcao-afim",
      subtopico: "f(x) = ax + b",
      dificuldade,
      enunciado: `O valor de ${bem} ${dono}, em reais, sofre depreciação linear: era de ${brl(V0)} quando nova e diminui ${brl(d)} a cada ano de uso. Qual será o valor do bem após ${t} anos de uso?`,
      correctText,
      distractorTexts,
      explicacao: `O valor em função do tempo é V(t) = ${brl(V0)} − ${brl(d)}·t. Para t = ${t}: V(${t}) = ${brl(V0)} − ${brl(d)} × ${t} = ${brl(valor)}.`,
    });
  }
  const q = randInt(3, 10);
  if (M === 2 * q) M += 1;
  const V0b = d * M;
  const k = V0b - d * q;
  const correctText = `${q} anos`;
  const distractorTexts = [
    `${V0b - k} anos`,
    `${-q} anos`,
    `${M} anos`,
    `${M - q} anos`,
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return afimDepreciacao(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "f(x) = ax + b",
    dificuldade,
    enunciado: `O valor de ${bem} ${dono}, em reais, sofre depreciação linear: era de ${brl(V0b)} quando nova e diminui ${brl(d)} a cada ano de uso. Depois de quantos anos o valor do bem será igual a ${brl(k)}?`,
    correctText,
    distractorTexts,
    explicacao: `Queremos V(t) = ${brl(k)}, ou seja ${brl(V0b)} − ${brl(d)}·t = ${brl(k)}. Então ${brl(d)}·t = ${brl(V0b - k)} e t = ${V0b - k} ÷ ${d} = ${q} anos.`,
  });
}

function afimConversaoTemperatura(dificuldade, tentativa = 0) {
  if (dificuldade !== "dificil") {
    const contextos = [
      "a temperatura de uma cidade dos Estados Unidos",
      "a temperatura de um forno industrial",
      "a temperatura de uma câmara frigorífica",
      "a temperatura da água de uma piscina aquecida",
    ];
    const ctx = pick(contextos);
    const C = dificuldade === "facil" ? pick([15, 20, 25, 30, 35]) : pick([15, 20, 25, 30, 35, 45, 50, 55, 60, 70, 75, 90]);
    const F = (9 * C) / 5 + 32;
    const correctText = `${F} °F`;
    const distractorTexts = [
      `${(9 * C) / 5} °F`,
      `${(9 * C) / 5 - 32} °F`,
      `${C + 32} °F`,
      `${2 * C + 32} °F`,
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return afimConversaoTemperatura(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "funcao-afim",
      subtopico: "f(x) = ax + b",
      dificuldade,
      enunciado: `A conversão de uma temperatura de graus Celsius (C) para graus Fahrenheit (F) é feita pela função afim F = 9C/5 + 32. Se ${ctx} é de ${C} °C, qual é essa temperatura em graus Fahrenheit?`,
      correctText,
      distractorTexts,
      explicacao: `Substituindo C = ${C}: F = 9 × ${C} ÷ 5 + 32 = ${(9 * C) / 5} + 32 = ${F} °F.`,
    });
  }
  const contextos = [
    "a temperatura de operação de um motor importado",
    "a previsão do tempo de uma cidade norte-americana",
    "a temperatura de uma peça recebida do exterior",
  ];
  const ctx = pick(contextos);
  const m = randInt(3, 9);
  const C = 5 * m;
  const F = 9 * m + 32;
  const u = F - 32;
  const correctText = `${C} °C`;
  const distractorTexts = [
    `${u} °C`,
    `${5 * u} °C`,
    `${m} °C`,
    `${-C} °C`,
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return afimConversaoTemperatura(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "f(x) = ax + b",
    dificuldade,
    enunciado: `A relação entre graus Celsius (C) e graus Fahrenheit (F) é dada pela função afim F = 9C/5 + 32. Se ${ctx} é de ${F} °F, qual é essa temperatura em graus Celsius?`,
    correctText,
    distractorTexts,
    explicacao: `Isolando C em F = 9C/5 + 32: C = 5(F − 32)/9 = 5 × (${F} − 32) ÷ 9 = 5 × ${u} ÷ 9 = ${C} °C.`,
  });
}

function afimComissao(dificuldade, tentativa = 0) {
  const contextos = [
    ["um vendedor de uma concessionária", "veículos"],
    ["uma corretora de uma imobiliária", "imóveis"],
    ["um representante comercial", "mercadorias"],
    ["um vendedor de uma loja de móveis", "móveis"],
  ];
  const [pessoa, mercadoria] = pick(contextos);
  const fixo = randInt(dificuldade === "facil" ? 10 : 12, dificuldade === "dificil" ? 25 : 20) * 100;
  const p = pick(dificuldade === "facil" ? [2, 4, 5] : [2, 3, 4, 5, 6, 8]);
  const vendas = randInt(dificuldade === "facil" ? 10 : 20, dificuldade === "dificil" ? 90 : 60) * 1000;
  const comissao = (p * vendas) / 100;
  const total = fixo + comissao;
  if (dificuldade !== "dificil") {
    const correctText = brl(total);
    const distractorTexts = [
      brl(comissao),
      brl(fixo + p * vendas),
      brl(fixo + (p * vendas) / 1000),
      brl(2 * fixo + comissao),
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return afimComissao(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "funcao-afim",
      subtopico: "Tarifas e Planos",
      dificuldade,
      enunciado: `O salário mensal de ${pessoa} tem uma parte fixa de ${brl(fixo)} mais uma comissão de ${pct(p)} sobre o valor total das vendas do mês. Em um mês em que vendeu ${brl(vendas)} em ${mercadoria}, qual foi o salário total recebido?`,
      correctText,
      distractorTexts,
      explicacao: `Comissão = ${p}% de ${brl(vendas)} = ${brl(comissao)}. Salário total = parte fixa + comissão = ${brl(fixo)} + ${brl(comissao)} = ${brl(total)}.`,
    });
  }
  const correctText = brl(vendas);
  const distractorTexts = [
    brl(vendas / 100),
    brl(comissao),
    brl(-vendas),
    brl(10 * vendas),
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return afimComissao(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "Tarifas e Planos",
    dificuldade,
    enunciado: `O salário mensal de ${pessoa} tem uma parte fixa de ${brl(fixo)} mais uma comissão de ${pct(p)} sobre o valor total das vendas do mês. Em determinado mês, o salário total recebido foi de ${brl(total)}. Qual foi o valor vendido em ${mercadoria} nesse mês?`,
    correctText,
    distractorTexts,
    explicacao: `Sendo V o valor vendido: ${brl(fixo)} + ${p}%·V = ${brl(total)}. Então ${p}/100·V = ${brl(comissao)} e V = ${brl(comissao)} ÷ (${p}/100) = ${brl(vendas)}.`,
  });
}

function afimPontoEquilibrio(dificuldade, tentativa = 0) {
  const contextos = [
    ["Duas locadoras de automóveis", "por quilômetro rodado", "km", "de diária"],
    ["Dois planos de telefonia móvel", "por gigabyte de internet excedente", "GB", "de franquia mensal"],
    ["Dois buffets para festas", "por convidado", "convidados", "de taxa fixa"],
    ["Dois estacionamentos do centro", "por hora de permanência", "horas", "de valor fixo"],
  ];
  const [contexto, porUnidade, unidade, fixoNome] = pick(contextos);
  const dd = randInt(2, dificuldade === "dificil" ? 5 : 4);
  const a = randInt(1, 4);
  const bb = a + dd;
  const q = randInt(dificuldade === "facil" ? 5 : 6, dificuldade === "dificil" ? 24 : 16);
  const t = randInt(5, 15);
  let g = dd * t;
  let f = g + q * dd;
  let somaFixos = (f + g) / dd;
  if (somaFixos === q * dd) {
    g += dd;
    f = g + q * dd;
    somaFixos = (f + g) / dd;
  }
  const correctText = `${q} ${unidade}`;
  const distractorTexts = [
    `${-q} ${unidade}`,
    `${q * dd} ${unidade}`,
    `${somaFixos} ${unidade}`,
    `${q + 1} ${unidade}`,
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return afimPontoEquilibrio(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "Tarifas e Planos",
    dificuldade,
    enunciado: `${contexto} cobram, cada uma, um valor fixo mais um valor ${porUnidade}. A opção I cobra ${brl(f)} ${fixoNome} e ${brl(a)} ${porUnidade}; a opção II cobra ${brl(g)} ${fixoNome} e ${brl(bb)} ${porUnidade}. Para qual quantidade de ${unidade} as duas opções custam o mesmo valor?`,
    correctText,
    distractorTexts,
    explicacao: `Igualando os custos: ${brl(f)} + ${brl(a)}·x = ${brl(g)} + ${brl(bb)}·x. Então ${brl(f)} − ${brl(g)} = (${brl(bb)} − ${brl(a)})·x, ou seja ${f - g} = ${bb - a}·x. Logo x = ${f - g} ÷ ${bb - a} = ${q} ${unidade}.`,
  });
}

function afimValorPrevisto(dificuldade, tentativa = 0) {
  const contextos = [
    ["O número de assinantes de um serviço de streaming", "o número de meses desde o lançamento", "assinantes"],
    ["O custo total de impressão em uma gráfica", "o número de centenas de folhetos", "reais"],
    ["O volume de água em um tanque que enche em ritmo constante", "o tempo em minutos", "litros"],
    ["A pontuação acumulada por um participante", "o número de rodadas disputadas", "pontos"],
  ];
  const [grandeza, tempoDesc, unidade] = pick(contextos);
  const a = randInt(dificuldade === "facil" ? 2 : 3, dificuldade === "dificil" ? 12 : 8);
  const x1 = randInt(1, 4);
  const dx = randInt(2, 6);
  const x2 = x1 + dx;
  const b0 = randInt(5, 40);
  const y1 = a * x1 + b0;
  const y2 = a * x2 + b0;
  let dx2 = randInt(2, 8);
  if (dx2 === dx) dx2 += 3;
  const x3 = x2 + dx2;
  const resposta = a * x3 + b0;
  const correctText = `${resposta} ${unidade}`;
  const distractorTexts = [
    `${a * x3} ${unidade}`,
    `${y1 + a * x3} ${unidade}`,
    `${y2 + a * dx} ${unidade}`,
    `${a * dx2} ${unidade}`,
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return afimValorPrevisto(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-afim",
    subtopico: "Coeficiente Angular",
    dificuldade,
    enunciado: `${grandeza} varia de forma linear em função de x, sendo x ${tempoDesc}. Quando x = ${x1}, esse valor é ${y1} ${unidade}; quando x = ${x2}, é ${y2} ${unidade}. Qual será o valor quando x = ${x3}?`,
    correctText,
    distractorTexts,
    explicacao: `A taxa de variação é a = (${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${y2 - y1} ÷ ${dx} = ${a}. O coeficiente linear é b = ${y1} − ${a}·${x1} = ${b0}. Assim, para x = ${x3}: y = ${a} × ${x3} + ${b0} = ${resposta} ${unidade}.`,
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

// --- Função Quadrática: +10 moldes (Fase 5) ---
function _quadOk(correct, distractors) {
  const all = [correct, ...distractors];
  return new Set(all).size === all.length;
}
function _quadPoli(a, b, c, v = "x") {
  const ax = a === 1 ? `${v}²` : a === -1 ? `−${v}²` : a < 0 ? `−${-a}${v}²` : `${a}${v}²`;
  const bx = b === 0 ? "" : b > 0 ? ` + ${b}${v}` : ` − ${-b}${v}`;
  const cc = c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`;
  return `${ax}${bx}${cc}`;
}

function quadLucroMaximo(dificuldade, tentativa = 0) {
  const ctx = pick([
    ["uma empresa que vende", "unidades de um produto"],
    ["uma fábrica que produz", "peças por dia"],
    ["uma confeitaria que vende", "bolos por semana"],
    ["uma loja que vende", "camisetas por mês"],
  ]);
  const faixa =
    dificuldade === "facil"
      ? { xv: randInt(13, 18), c: pick([50, 100]) }
      : dificuldade === "dificil"
        ? { xv: randInt(25, 40), c: pick([200, 300, 400, 500]) }
        : { xv: randInt(18, 28), c: pick([100, 150, 200, 250]) };
  const xv = faixa.xv;
  const c = faixa.c;
  const b = 2 * xv; // a = 1
  const lucroMax = xv * xv - c;
  const correctText = brl(lucroMax);
  const distractorTexts = [brl(xv * xv + c), brl(2 * xv * xv - c), brl(xv), brl(2 * xv)];
  if (tentativa < 40 && (lucroMax < 50 || xv * xv === 2 * c || !_quadOk(correctText, distractorTexts)))
    return quadLucroMaximo(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Pontos de Máximo e Mínimo",
    dificuldade,
    enunciado: `O lucro mensal L, em reais, de ${ctx[0]} x ${ctx[1]} é dado por L(x) = −x² + ${b}x − ${c}. Qual é o lucro máximo mensal possível?`,
    correctText,
    distractorTexts,
    explicacao: `L é uma função quadrática de concavidade para baixo, então o máximo ocorre no vértice: x = −b/(2a) = ${b}/2 = ${xv} unidades. Substituindo, L(${xv}) = −${xv}² + ${b}·${xv} − ${c} = ${lucroMax}, ou seja, ${correctText}.`,
  });
}

function quadRaizesContexto(dificuldade, tentativa = 0) {
  const abre = pick([
    "O lucro L, em milhares de reais, de uma empresa em função do preço unitário x (em reais) é",
    "A margem M, em milhares de reais, de uma operação em função da quantidade x (em lotes) é",
    "O resultado R, em milhares de reais, de um projeto em função do tempo x (em meses) é",
  ]);
  const r1 = randInt(2, dificuldade === "facil" ? 3 : 5);
  const gap = randInt(2, dificuldade === "dificil" ? 8 : dificuldade === "facil" ? 4 : 6);
  const r2 = r1 + gap;
  const S = r1 + r2;
  const P = r1 * r2;
  const correctText = `x = ${r1} ou x = ${r2}`;
  const distractorTexts = [
    `x = ${-r1} ou x = ${-r2}`,
    `x = ${S} ou x = ${P}`,
    `x = ${S} ou x = ${r2 - r1}`,
    `x = ${-2 * r1} ou x = ${-2 * r2}`,
  ];
  if (tentativa < 40 && !_quadOk(correctText, distractorTexts))
    return quadRaizesContexto(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Raízes e Concavidade",
    dificuldade,
    enunciado: `${abre} dado por f(x) = −x² + ${S}x − ${P}. Para quais valores de x esse valor é nulo?`,
    correctText,
    distractorTexts,
    explicacao: `f(x) = 0 ⇔ x² − ${S}x + ${P} = 0. Por soma e produto, as raízes somam ${S} e têm produto ${P}: são ${r1} e ${r2}. Logo x = ${r1} ou x = ${r2}.`,
  });
}

function quadSomaProdutoRaizes(dificuldade, tentativa = 0) {
  const a = randInt(2, dificuldade === "facil" ? 2 : dificuldade === "dificil" ? 4 : 3);
  const S = randInt(4, 9);
  const P = randInt(2, 9);
  const modo = pick(["soma", "produto", "soma_produto"]);
  const b = -a * S;
  const cc = a * P;
  let pergunta, correct, distr;
  if (modo === "soma") {
    pergunta = "a soma das raízes dessa equação";
    correct = S;
    distr = [-S, a * S, P, a * P];
  } else if (modo === "produto") {
    pergunta = "o produto das raízes dessa equação";
    correct = P;
    distr = [-P, a * P, S, -S];
  } else {
    pergunta = "a soma das raízes adicionada ao produto das raízes";
    correct = S + P;
    distr = [S - P, S * P, S, P];
  }
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  const ok =
    S !== P &&
    S * S >= 4 * P &&
    S !== 2 * P &&
    S + P !== S * P &&
    a * P !== S &&
    a * S !== P &&
    _quadOk(correctText, distractorTexts);
  if (tentativa < 40 && !ok) return quadSomaProdutoRaizes(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Raízes e Concavidade",
    dificuldade,
    enunciado: `Considere a equação do 2º grau ${a === 1 ? "" : a}x² − ${a * S}x + ${cc} = 0. Sem resolvê-la, determine ${pergunta}.`,
    correctText,
    distractorTexts,
    explicacao: `Pelas relações de Girard, a soma das raízes é S = −b/a = −(${b})/${a} = ${S} e o produto é P = c/a = ${cc}/${a} = ${P}.${modo === "soma_produto" ? ` Logo S + P = ${S} + ${P} = ${S + P}.` : ""}`,
  });
}

function quadAreaCercado(dificuldade, tentativa = 0) {
  const ctx = pick([
    ["Um agricultor", "cercar um curral retangular, aproveitando um muro reto já existente como um dos lados"],
    ["Um criador", "cercar um canil retangular encostado na parede de um galpão, que serve como um dos lados"],
    ["Uma prefeitura", "delimitar uma horta comunitária retangular à margem de um rio, que forma um dos lados"],
  ]);
  const k = pick(dificuldade === "facil" ? [3, 5] : dificuldade === "dificil" ? [10] : [6, 7]);
  const P = 4 * k;
  const area = 2 * k * k;
  const correctText = `${area} m²`;
  const distractorTexts = [`${k * k} m²`, `${4 * k * k} m²`, `${P} m²`, `${2 * k} m²`];
  if (tentativa < 40 && !_quadOk(correctText, distractorTexts))
    return quadAreaCercado(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Pontos de Máximo e Mínimo",
    dificuldade,
    enunciado: `${ctx[0]} dispõe de ${P} m de tela para ${ctx[1]}. Apenas três lados serão cercados com a tela. Qual é a maior área, em m², que pode ser cercada?`,
    correctText,
    distractorTexts,
    explicacao: `Sendo x o lado paralelo ao muro e y cada um dos dois lados perpendiculares, x + 2y = ${P}. A área é A(y) = (${P} − 2y)·y, uma parábola com máximo em y = ${P}/4 = ${k}. Então x = ${P} − 2·${k} = ${2 * k} e A = ${2 * k}·${k} = ${area} m².`,
  });
}

function quadDoisNumeros(dificuldade, tentativa = 0) {
  const abre = pick([
    "A soma de dois números reais positivos é",
    "Dois números positivos têm soma igual a",
    "Um fio de arame será cortado em dois pedaços cujos comprimentos, em cm, somam",
  ]);
  const h = randInt(
    dificuldade === "facil" ? 4 : dificuldade === "dificil" ? 12 : 7,
    dificuldade === "facil" ? 8 : dificuldade === "dificil" ? 20 : 12,
  );
  const S = 2 * h;
  const prod = h * h;
  const correctText = `${prod}`;
  const distractorTexts = [`${prod - 1}`, `${S * S}`, `${h}`, `${(S * S) / 2}`];
  if (tentativa < 40 && !_quadOk(correctText, distractorTexts))
    return quadDoisNumeros(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Pontos de Máximo e Mínimo",
    dificuldade,
    enunciado: `${abre} ${S}. Qual é o maior valor possível para o produto desses dois números?`,
    correctText,
    distractorTexts,
    explicacao: `Se um número é n, o outro é ${S} − n, e o produto p(n) = n·(${S} − n) = −n² + ${S}n é máximo no vértice, em n = ${S}/2 = ${h}. O outro número também é ${h}, e o produto máximo é ${h}·${h} = ${prod}.`,
  });
}

function quadAlcanceProjetil(dificuldade, tentativa = 0) {
  const ctx = pick([
    ["Um foguete de brinquedo é lançado do solo", "o foguete"],
    ["Uma bola é chutada rente ao gramado", "a bola"],
    ["Um golfinho salta para fora da água", "o golfinho"],
    ["Um jato de água parte de um chafariz no solo", "o jato"],
  ]);
  const a = pick([3, 4, 5]);
  const tf = pick(dificuldade === "facil" ? [6, 8] : dificuldade === "dificil" ? [10, 12] : [8, 10]);
  const b = a * tf;
  const correctText = `${tf} s`;
  const distractorTexts = [`${tf / 2} s`, `${b} s`, `${2 * tf} s`, `${(a * tf * tf) / 4} s`];
  if (tentativa < 40 && !_quadOk(correctText, distractorTexts))
    return quadAlcanceProjetil(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Raízes e Concavidade",
    dificuldade,
    enunciado: `${ctx[0]} e sua altura h, em metros, t segundos após o lançamento é h(t) = −${a}t² + ${b}t. Quantos segundos após o lançamento ${ctx[1]} retorna ao solo (h = 0)?`,
    correctText,
    distractorTexts,
    explicacao: `Fazendo h(t) = 0: t·(−${a}t + ${b}) = 0, então t = 0 (lançamento) ou −${a}t + ${b} = 0 ⇒ t = ${b}/${a} = ${tf} s.`,
  });
}

function quadAlturaNoInstante(dificuldade, tentativa = 0) {
  const ctx = pick([
    ["Uma bola é lançada verticalmente para cima", "da bola"],
    ["Uma pedra é atirada de uma sacada", "da pedra"],
    ["Um projétil é disparado para cima", "do projétil"],
  ]);
  const a = pick([1, 2]);
  const b = randInt(dificuldade === "facil" ? 8 : 10, dificuldade === "dificil" ? 22 : 16);
  const c = randInt(1, 12);
  const t0 = randInt(2, dificuldade === "dificil" ? 5 : 4);
  const A = -a * t0 * t0 + b * t0 + c;
  const correctText = `${A} m`;
  const distractorTexts = [
    `${a * t0 * t0 + b * t0 + c} m`,
    `${-a * t0 * t0 + b * t0} m`,
    `${b * t0 + c} m`,
    `${c} m`,
  ];
  const ok = b > a * t0 && A > 0 && A !== 2 * c && _quadOk(correctText, distractorTexts);
  if (tentativa < 40 && !ok) return quadAlturaNoInstante(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Pontos de Máximo e Mínimo",
    dificuldade,
    enunciado: `${ctx[0]} e sua altura h, em metros, é dada por h(t) = ${_quadPoli(-a, b, c, "t")}, com o tempo t em segundos. Qual é a altura ${ctx[1]} no instante t = ${t0} s?`,
    correctText,
    distractorTexts,
    explicacao: `Basta substituir t = ${t0} em h(t) = ${_quadPoli(-a, b, c, "t")}: −${a * t0 * t0} + ${b * t0} + ${c} = ${A} m.`,
  });
}

function quadVerticeCoordenadas(dificuldade, tentativa = 0) {
  const abre = pick([
    "A parábola de equação",
    "O gráfico da função quadrática dada por",
    "A curva de equação",
  ]);
  const R = dificuldade === "facil" ? 3 : dificuldade === "dificil" ? 5 : 4;
  const a = pick(dificuldade === "facil" ? [1, -1] : [1, 2, -1, -2]);
  const xv = pick([-R, -R + 1, -1, 1, 2, R].filter((v) => v !== 0));
  const yv = randInt(-8, 8);
  const b = -2 * a * xv;
  const c = a * xv * xv + yv;
  const correctText = `(${xv}, ${yv})`;
  const distractorTexts = [
    `(${2 * xv}, ${yv})`,
    `(${-xv}, ${yv})`,
    `(${xv}, ${-yv})`,
    `(${yv}, ${xv})`,
  ];
  const ok = xv !== 0 && yv !== 0 && xv !== yv && xv !== -yv && _quadOk(correctText, distractorTexts);
  if (tentativa < 40 && !ok) return quadVerticeCoordenadas(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Vértice da Parábola",
    dificuldade,
    enunciado: `${abre} y = ${_quadPoli(a, b, c)} tem vértice em qual ponto do plano cartesiano?`,
    correctText,
    distractorTexts,
    explicacao: `A abscissa do vértice é x_v = −b/(2a) = −(${b})/(2·${a}) = ${xv}. A ordenada é y_v = ${a}·(${xv})² + (${b})·(${xv}) + (${c}) = ${yv}. Logo o vértice é (${xv}, ${yv}).`,
  });
}

function quadArcoParabolico(dificuldade, tentativa = 0) {
  const ctx = pick([
    "de um túnel rodoviário",
    "de um arco decorativo de um portal",
    "da entrada em arco de um estádio",
    "de uma ponte em arco",
  ]);
  const tuplas =
    dificuldade === "facil"
      ? [
          [12, 36, 8],
          [16, 64, 6],
        ]
      : dificuldade === "dificil"
        ? [
            [20, 100, 12],
            [24, 144, 8],
            [24, 144, 16],
          ]
        : [
            [16, 64, 10],
            [20, 100, 8],
            [20, 100, 6],
          ];
  const [L, H, d] = pick(tuplas);
  const altura = H - (d * d) / 4;
  const correctText = `${altura} m`;
  const distractorTexts = [
    `${(d * d) / 4} m`,
    `${H - (d * d) / 2} m`,
    `${H - (L * d) / 4} m`,
    `${H - d} m`,
  ];
  if (tentativa < 40 && !_quadOk(correctText, distractorTexts))
    return quadArcoParabolico(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Vértice da Parábola",
    dificuldade,
    enunciado: `A altura ${ctx} é modelada por uma parábola com o vértice no topo. O vão (largura na base) mede ${2 * L} m e a altura máxima, no centro, é ${H} m. Qual é a altura do arco em um ponto a ${d} m do centro?`,
    correctText,
    distractorTexts,
    explicacao: `Com a origem no centro da base, h(x) = ${H} − k·x², e h(±${L}) = 0 dá k = ${H}/${L}² = 1/4. Então h(${d}) = ${H} − (1/4)·${d}² = ${H} − ${(d * d) / 4} = ${altura} m.`,
  });
}

function quadCustoMinimo(dificuldade, tentativa = 0) {
  const abre = pick([
    "O custo operacional diário C, em reais, de uma oficina em função do número x de peças usinadas é",
    "O custo semanal C, em reais, de uma gráfica em função do número x de milheiros impressos é",
    "O custo mensal C, em reais, de uma transportadora em função do número x de rotas ativas é",
  ]);
  const a = dificuldade === "facil" ? 1 : dificuldade === "dificil" ? 2 : pick([1, 2]);
  const xm = randInt(
    dificuldade === "facil" ? 4 : dificuldade === "dificil" ? 10 : 7,
    dificuldade === "facil" ? 7 : dificuldade === "dificil" ? 16 : 11,
  );
  const b = 2 * a * xm;
  const e = pick([50, 100, 150, 200]);
  const q = a * xm * xm;
  const c = 2 * q + e;
  const custoMin = c - q;
  const correctText = brl(custoMin);
  const distractorTexts = [brl(c + q), brl(c), brl(c + 3 * q), brl(c - 2 * q)];
  if (tentativa < 40 && !_quadOk(correctText, distractorTexts))
    return quadCustoMinimo(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "funcao-quadratica",
    subtopico: "Pontos de Máximo e Mínimo",
    dificuldade,
    enunciado: `${abre} C(x) = ${a === 1 ? "" : a}x² − ${b}x + ${c}. Qual é o menor custo possível?`,
    correctText,
    distractorTexts,
    explicacao: `C é uma parábola de concavidade para cima; o mínimo ocorre em x = −b/(2a) = ${b}/${2 * a} = ${xm}. Então C(${xm}) = ${a}·${xm}² − ${b}·${xm} + ${c} = ${q} − ${b * xm} + ${c} = ${custoMin}, ou seja, ${correctText}.`,
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

// --- Geometria Analítica: +13 moldes (Fase 4) ---
function _gaCoefX(m) {
  return m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
}
function _gaReta(m, n) {
  return `y = ${_gaCoefX(m)}${n > 0 ? ` + ${n}` : n < 0 ? ` - ${-n}` : ""}`;
}
function _gaSlopeStr(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  return den === 1 ? `${num}` : `${num}/${den}`;
}
function _gaCircEq(a, b, rhs) {
  const tx = a < 0 ? `x + ${-a}` : `x - ${a}`;
  const ty = b < 0 ? `y + ${-b}` : `y - ${b}`;
  return `(${tx})² + (${ty})² = ${rhs}`;
}
function _gaTermo(c, v) {
  return c === 0 ? "" : c > 0 ? ` + ${c}${v}` : ` - ${-c}${v}`;
}
function _gaNum(v) {
  return Number.isInteger(v) ? `${v}` : `${v}`.replace(".", ",");
}
function _gaDistintos(textos) {
  return new Set(textos).size === textos.length;
}

function gaPontoMedio(dificuldade, tentativa = 0) {
  const R = dificuldade === "facil" ? 5 : dificuldade === "dificil" ? 10 : 8;
  const passos = [-4, -3, -2, -1, 1, 2, 3, 4];
  const x1 = randInt(-R, R);
  const y1 = randInt(-R, R);
  const x2 = x1 + 2 * pick(passos);
  const y2 = y1 + 2 * pick(passos);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const correctText = `(${mx}, ${my})`;
  const distractorTexts = [
    `(${(x1 - x2) / 2}, ${(y1 - y2) / 2})`,
    `(${x1 + x2}, ${y1 + y2})`,
    `(${my}, ${mx})`,
    `(${(x2 - x1) / 2}, ${(y2 - y1) / 2})`,
  ];
  if (tentativa < 40 && (mx === my || !_gaDistintos([correctText, ...distractorTexts])))
    return gaPontoMedio(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Distância entre Pontos",
    dificuldade,
    enunciado: `No plano cartesiano, qual é o ponto médio do segmento de extremos A(${x1}, ${y1}) e B(${x2}, ${y2})?`,
    correctText,
    distractorTexts,
    explicacao: `O ponto médio é ((x₁+x₂)/2, (y₁+y₂)/2) = ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${mx}, ${my}).`,
  });
}

function gaDistanciaOrigem(dificuldade, tentativa = 0) {
  const lim = dificuldade === "facil" ? 3 : dificuldade === "dificil" ? 8 : 5;
  const [a, b, c] = pick(TRIPLAS_PITAGORICAS.slice(0, lim));
  const px = pick([1, -1]) * a;
  const py = pick([1, -1]) * b;
  const correctText = `${c}`;
  const distractorTexts = [`${a + b}`, `${Math.abs(a - b)}`, `${c * c}`, `${2 * c}`];
  if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
    return gaDistanciaOrigem(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Distância entre Pontos",
    dificuldade,
    enunciado: `No plano cartesiano, qual é a distância do ponto P(${px}, ${py}) à origem?`,
    correctText,
    distractorTexts,
    explicacao: `d = √(x² + y²) = √((${px})² + (${py})²) = √(${px * px} + ${py * py}) = √${px * px + py * py} = ${c}.`,
  });
}

function gaCoefAngularDoisPontos(dificuldade, tentativa = 0) {
  const ms =
    dificuldade === "facil" ? [2, 3] : dificuldade === "dificil" ? [-4, -3, -2, 2, 3, 4] : [-3, -2, 2, 3];
  const m = pick(ms);
  const dx = pick([2, 3].filter((d) => d !== Math.abs(m))) ?? 2;
  const x1 = randInt(-3, 3);
  const x2 = x1 + dx;
  const y1 = randInt(-4, 4);
  const y2 = y1 + m * dx;
  const n = y1 - m * x1;
  const correctText = `${m}`;
  const distractorTexts = [`${-m}`, `${y2 - y1}`, `${x2 - x1}`, `${n}`];
  if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
    return gaCoefAngularDoisPontos(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Reta",
    dificuldade,
    enunciado: `No plano cartesiano, qual é o coeficiente angular da reta que passa pelos pontos A(${x1}, ${y1}) e B(${x2}, ${y2})?`,
    correctText,
    distractorTexts,
    explicacao: `m = (y₂ − y₁)/(x₂ − x₁) = (${y2} − (${y1}))/(${x2} − (${x1})) = ${y2 - y1}/${x2 - x1} = ${m}.`,
  });
}

function gaEquacaoRetaPorDoisPontos(dificuldade, tentativa = 0) {
  const ms = dificuldade === "facil" ? [2, 3] : dificuldade === "dificil" ? [-3, -2, 2, 3] : [-2, 2, 3];
  const m = pick(ms);
  const dx = pick([1, 2, 3]);
  const x1 = pick([-3, -2, -1, 1, 2, 3].filter((v) => v + dx !== 0));
  const x2 = x1 + dx;
  const y1 = randInt(-4, 4);
  const y2 = y1 + m * dx;
  const n = y1 - m * x1;
  const correctText = `${n}`;
  const distractorTexts = [`${y1 + m * x1}`, `${y2 + m * x2}`, `${m}`, `${y1}`];
  if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
    return gaEquacaoRetaPorDoisPontos(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Reta",
    dificuldade,
    enunciado: `A reta r passa pelos pontos A(${x1}, ${y1}) e B(${x2}, ${y2}). Escrevendo a equação de r na forma y = mx + n, qual é o valor de n (coeficiente linear)?`,
    correctText,
    distractorTexts,
    explicacao: `m = (${y2} − (${y1}))/(${x2} − (${x1})) = ${m}. Como n = y − mx, usando A: n = ${y1} − (${m})(${x1}) = ${n}.`,
  });
}

function gaParalelaPerpendicular(dificuldade, tentativa = 0) {
  const paralela = dificuldade === "facil";
  const ms = dificuldade === "medio" ? [-2, 2] : [-3, -2, 2, 3];
  const m = pick(ms);
  const b = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => v !== m && v !== -m));
  const perp = _gaSlopeStr(-1, m);
  const recipSemSinal = _gaSlopeStr(1, m);
  const correctText = paralela ? `${m}` : perp;
  const distractorTexts = paralela
    ? [`${-m}`, perp, recipSemSinal, `${b}`]
    : [`${m}`, `${-m}`, recipSemSinal, `${b}`];
  if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
    return gaParalelaPerpendicular(dificuldade, tentativa + 1);
  const enun = paralela
    ? `Qual é o coeficiente angular de uma reta paralela à reta ${_gaReta(m, b)}?`
    : dificuldade === "medio"
      ? `Qual é o coeficiente angular de uma reta perpendicular à reta de equação ${_gaReta(m, b)}?`
      : `Uma reta s é perpendicular à reta r: ${_gaReta(m, b)}. Qual é o coeficiente angular de s?`;
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Reta",
    dificuldade,
    enunciado: enun,
    correctText,
    distractorTexts,
    explicacao: paralela
      ? `Retas paralelas têm o mesmo coeficiente angular. A reta dada tem coeficiente angular ${m}, logo a resposta é ${m}.`
      : `Retas perpendiculares têm coeficientes angulares com produto −1. Logo o coeficiente é −1/(${m}) = ${perp}.`,
  });
}

function gaInterseccaoRetas(dificuldade, tentativa = 0) {
  const px = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  const py = pick([-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((v) => v !== px));
  const m1 = pick([-3, -2, -1, 1, 2, 3]);
  const m2 = pick([-3, -2, -1, 1, 2, 3].filter((v) => v !== m1));
  const n1 = py - m1 * px;
  const n2 = py - m2 * px;
  const correctText = `(${px}, ${py})`;
  const distractorTexts = [
    `(${-px}, ${py})`,
    `(${py}, ${px})`,
    `(${px}, ${m1 * px})`,
    `(${px}, ${n1})`,
  ];
  if (tentativa < 40 && (n1 === 0 || m1 === 0 || !_gaDistintos([correctText, ...distractorTexts])))
    return gaInterseccaoRetas(dificuldade, tentativa + 1);
  const rhs1 = n1 >= 0 ? `+ ${n1}` : `- ${-n1}`;
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Reta",
    dificuldade,
    enunciado: `No plano cartesiano, as retas r: ${_gaReta(m1, n1)} e s: ${_gaReta(m2, n2)} se intersectam em um único ponto. Quais são as coordenadas desse ponto?`,
    correctText,
    distractorTexts,
    explicacao: `Igualando as equações e isolando x, obtém-se x = ${px}. Substituindo em r: y = ${m1}·(${px}) ${rhs1} = ${py}. Ponto: (${px}, ${py}).`,
  });
}

function gaCircunferenciaCentroRaio(dificuldade, tentativa = 0) {
  const a = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
  const b = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== a && v !== -a));
  const r = randInt(3, dificuldade === "facil" ? 6 : dificuldade === "dificil" ? 9 : 8);
  const r2 = r * r;
  if (dificuldade === "facil") {
    const correctText = `(${a}, ${b})`;
    const distractorTexts = [
      `(${-a}, ${-b})`,
      `(${b}, ${a})`,
      `(${-a}, ${b})`,
      `(${-b}, ${-a})`,
    ];
    if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
      return gaCircunferenciaCentroRaio(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "geometria-analitica",
      subtopico: "Equação da Circunferência",
      dificuldade,
      enunciado: `A circunferência λ tem equação ${_gaCircEq(a, b, r2)}. Quais são as coordenadas do seu centro?`,
      correctText,
      distractorTexts,
      explicacao: `Na forma (x − a)² + (y − b)² = r², o centro é (a, b). Aqui a = ${a} e b = ${b}, logo o centro é (${a}, ${b}).`,
    });
  }
  if (dificuldade === "medio") {
    const correctText = `${r}`;
    const distractorTexts = [`${r2}`, `${2 * r}`, `${r2 + 1}`, `${r + 1}`];
    if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
      return gaCircunferenciaCentroRaio(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "geometria-analitica",
      subtopico: "Equação da Circunferência",
      dificuldade,
      enunciado: `Uma circunferência tem equação ${_gaCircEq(a, b, r2)}. Qual é o seu raio?`,
      correctText,
      distractorTexts,
      explicacao: `O número à direita do sinal de igual é r² = ${r2}. Logo r = √${r2} = ${r}.`,
    });
  }
  const correctText = _gaCircEq(a, b, r2);
  const distractorTexts = [
    _gaCircEq(-a, -b, r2),
    _gaCircEq(a, b, r),
    _gaCircEq(b, a, r2),
    _gaCircEq(a, b, 2 * r),
  ];
  if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
    return gaCircunferenciaCentroRaio(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Circunferência",
    dificuldade,
    enunciado: `Qual é a equação reduzida da circunferência de centro C(${a}, ${b}) e raio ${r}?`,
    correctText,
    distractorTexts,
    explicacao: `A equação reduzida é (x − a)² + (y − b)² = r². Com a = ${a}, b = ${b} e r = ${r}: ${correctText}.`,
  });
}

function gaCircunferenciaGeralParaReduzida(dificuldade, tentativa = 0) {
  const a = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
  const b = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== a && v !== -a));
  const r = randInt(3, dificuldade === "dificil" ? 8 : 6);
  const D = -2 * a;
  const E = -2 * b;
  const F = a * a + b * b - r * r;
  const eq = `x² + y²${_gaTermo(D, "x")}${_gaTermo(E, "y")}${_gaTermo(F, "")} = 0`;
  if (dificuldade === "facil") {
    const correctText = `(${a}, ${b})`;
    const distractorTexts = [`(${D}, ${E})`, `(${-D}, ${-E})`, `(${-a}, ${b})`, `(${b}, ${a})`];
    if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
      return gaCircunferenciaGeralParaReduzida(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "geometria-analitica",
      subtopico: "Equação da Circunferência",
      dificuldade,
      enunciado: `A circunferência C tem equação ${eq}. Quais são as coordenadas do seu centro?`,
      correctText,
      distractorTexts,
      explicacao: `O centro é (−D/2, −E/2) = (−(${D})/2, −(${E})/2) = (${a}, ${b}).`,
    });
  }
  if (dificuldade === "medio") {
    const correctText = `${r}`;
    const distractorTexts = [`${r * r}`, `${2 * r}`, `${Math.abs(a) + Math.abs(b)}`, `${r + 1}`];
    if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
      return gaCircunferenciaGeralParaReduzida(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "geometria-analitica",
      subtopico: "Equação da Circunferência",
      dificuldade,
      enunciado: `A circunferência C tem equação ${eq}. Qual é o seu raio?`,
      correctText,
      distractorTexts,
      explicacao: `Centro (−D/2, −E/2) = (${a}, ${b}). Raio: r = √(D²/4 + E²/4 − F) = √(${a * a} + ${b * b} − (${F})) = √${r * r} = ${r}.`,
    });
  }
  const correctText = `centro (${a}, ${b}), raio ${r}`;
  const distractorTexts = [
    `centro (${D}, ${E}), raio ${r}`,
    `centro (${a}, ${b}), raio ${r * r}`,
    `centro (${-a}, ${-b}), raio ${r}`,
    `centro (${a}, ${b}), raio ${2 * r}`,
  ];
  if (tentativa < 40 && !_gaDistintos([correctText, ...distractorTexts]))
    return gaCircunferenciaGeralParaReduzida(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Circunferência",
    dificuldade,
    enunciado: `A circunferência C tem equação ${eq}. Determine o centro e o raio.`,
    correctText,
    distractorTexts,
    explicacao: `Centro (−D/2, −E/2) = (${a}, ${b}). Raio: r = √(D²/4 + E²/4 − F) = √(${a * a} + ${b * b} − (${F})) = √${r * r} = ${r}.`,
  });
}

function gaPontoNaCircunferencia(dificuldade, tentativa = 0) {
  const a = randInt(-4, 4);
  const b = randInt(-4, 4);
  const opcoes = [
    "P está no interior de λ.",
    "P está sobre λ.",
    "P está no exterior de λ.",
    "P coincide com o centro de λ.",
    "P coincide com a origem do plano cartesiano.",
  ];
  let px, py, r, correta;
  if (dificuldade === "facil") {
    const [l1, l2, hip] = pick(TRIPLAS_PITAGORICAS.slice(0, 4));
    r = hip;
    px = a + l1 * pick([1, -1]);
    py = b + l2 * pick([1, -1]);
    correta = "P está sobre λ.";
  } else if (dificuldade === "medio") {
    r = randInt(5, 9);
    const off = randInt(1, r - 2);
    px = a + off * pick([1, -1]);
    py = b;
    correta = "P está no interior de λ.";
  } else {
    r = randInt(3, 8);
    const off = r + randInt(1, 3);
    px = a + off * pick([1, -1]);
    py = b;
    correta = "P está no exterior de λ.";
  }
  if (tentativa < 40 && ((px === a && py === b) || (px === 0 && py === 0)))
    return gaPontoNaCircunferencia(dificuldade, tentativa + 1);
  const d2 = (px - a) * (px - a) + (py - b) * (py - b);
  const rel = d2 === r * r ? "=" : d2 < r * r ? "<" : ">";
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Circunferência",
    dificuldade,
    enunciado: `A circunferência λ tem centro C(${a}, ${b}) e raio ${r}. Considerando o ponto P(${px}, ${py}), qual das afirmações é verdadeira?`,
    correctText: correta,
    distractorTexts: opcoes.filter((o) => o !== correta),
    explicacao: `d² = (${px} − (${a}))² + (${py} − (${b}))² = ${d2}; r² = ${r * r}. Como d² ${rel} r², conclui-se que ${correta}`,
  });
}

function gaAreaTrianguloVertices(dificuldade, tentativa = 0) {
  const R = dificuldade === "facil" ? 3 : dificuldade === "dificil" ? 6 : 4;
  const xa = randInt(-R, R), ya = randInt(-R, R);
  const xb = randInt(-R, R), yb = randInt(-R, R);
  const xc = randInt(-R, R), yc = randInt(-R, R);
  const det = xa * (yb - yc) + xb * (yc - ya) + xc * (ya - yb);
  const area = Math.abs(det) / 2;
  const detErr = xa * (yb - yc) + xb * (yc - ya) - xc * (ya - yb);
  const areaErr = Math.abs(detErr) / 2;
  const bx = Math.max(xa, xb, xc) - Math.min(xa, xb, xc);
  const by = Math.max(ya, yb, yc) - Math.min(ya, yb, yc);
  const correctText = _gaNum(area);
  const distractorTexts = [
    _gaNum(Math.abs(det)),
    _gaNum(bx * by),
    _gaNum((bx * by) / 2),
    _gaNum(areaErr),
  ];
  if (tentativa < 40 && (area === 0 || !_gaDistintos([correctText, ...distractorTexts])))
    return gaAreaTrianguloVertices(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Distância entre Pontos",
    dificuldade,
    enunciado: `Um triângulo tem vértices A(${xa}, ${ya}), B(${xb}, ${yb}) e C(${xc}, ${yc}). Qual é a sua área?`,
    correctText,
    distractorTexts,
    explicacao: `Área = |x_A(y_B − y_C) + x_B(y_C − y_A) + x_C(y_A − y_B)| / 2 = |${det}| / 2 = ${correctText}.`,
  });
}

function gaAlinhamento(dificuldade, tentativa = 0) {
  const ms =
    dificuldade === "facil" ? [1, 2] : dificuldade === "dificil" ? [-3, -2, -1, 2, 3] : [-2, -1, 2, 3];
  const m = pick(ms);
  const [x1, x2, x3] = shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 3);
  const y1 = randInt(-3, 3);
  const y2 = y1 + m * (x2 - x1);
  const k = y1 + m * (x3 - x1);
  const correctText = `${k}`;
  const distractorTexts = [
    `${y1 - m * (x3 - x1)}`,
    `${m * (x3 - x1)}`,
    `${y1 + m * (x3 - x2)}`,
    `${y2 + m * (x3 - x1)}`,
  ];
  if (tentativa < 40 && (y1 === 0 || !_gaDistintos([correctText, ...distractorTexts])))
    return gaAlinhamento(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Equação da Reta",
    dificuldade,
    enunciado: `Os pontos A(${x1}, ${y1}), B(${x2}, ${y2}) e C(${x3}, k) estão alinhados. Qual é o valor de k?`,
    correctText,
    distractorTexts,
    explicacao: `A reta por A e B tem coeficiente angular m = (${y2} − (${y1}))/(${x2} − (${x1})) = ${m}. Então k = y_A + m(x_C − x_A) = ${y1} + (${m})(${x3} − (${x1})) = ${k}.`,
  });
}

function gaSimetrico(dificuldade, tentativa = 0) {
  const eixo = dificuldade === "facil" ? "x" : dificuldade === "medio" ? "y" : "origem";
  const R = dificuldade === "dificil" ? 8 : 6;
  const vals = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8].filter((v) => Math.abs(v) <= R);
  const x = pick(vals);
  const y = pick(vals.filter((v) => Math.abs(v) !== Math.abs(x)));
  const correta =
    eixo === "x" ? `(${x}, ${-y})` : eixo === "y" ? `(${-x}, ${y})` : `(${-x}, ${-y})`;
  const todas = [
    `(${x}, ${y})`,
    `(${x}, ${-y})`,
    `(${-x}, ${y})`,
    `(${-x}, ${-y})`,
    `(${y}, ${x})`,
  ];
  const distractorTexts = todas.filter((t) => t !== correta);
  if (tentativa < 40 && !_gaDistintos([correta, ...distractorTexts]))
    return gaSimetrico(dificuldade, tentativa + 1);
  const regra =
    eixo === "x"
      ? "troca-se o sinal da ordenada: (x, −y)"
      : eixo === "y"
        ? "troca-se o sinal da abscissa: (−x, y)"
        : "trocam-se os sinais das duas coordenadas: (−x, −y)";
  const nome = eixo === "origem" ? "à origem" : `ao eixo ${eixo}`;
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Distância entre Pontos",
    dificuldade,
    enunciado: `Qual é o ponto simétrico de P(${x}, ${y}) em relação ${nome}?`,
    correctText: correta,
    distractorTexts,
    explicacao: `Na simetria em relação ${nome}, ${regra}. Logo o simétrico de P(${x}, ${y}) é ${correta}.`,
  });
}

function gaBaricentro(dificuldade, tentativa = 0) {
  const R = dificuldade === "facil" ? 4 : dificuldade === "dificil" ? 9 : 6;
  const x1 = randInt(-R, R), x2 = randInt(-R, R);
  const y1 = randInt(-R, R), y2 = randInt(-R, R);
  const gx = randInt(-3, 3), gy = randInt(-3, 3);
  const x3 = 3 * gx - x1 - x2;
  const y3 = 3 * gy - y1 - y2;
  const Sx = x1 + x2 + x3, Sy = y1 + y2 + y3;
  const correctText = `(${gx}, ${gy})`;
  const distractorTexts = [
    `(${Sx}, ${Sy})`,
    `(${gy}, ${gx})`,
    `(${2 * gx}, ${2 * gy})`,
    `(${Sx}, ${gy})`,
  ];
  if (
    tentativa < 40 &&
    (gx === 0 ||
      gy === 0 ||
      gx === gy ||
      Math.abs(x3) > R + 4 ||
      Math.abs(y3) > R + 4 ||
      !_gaDistintos([correctText, ...distractorTexts]))
  )
    return gaBaricentro(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "geometria-analitica",
    subtopico: "Distância entre Pontos",
    dificuldade,
    enunciado: `Um triângulo tem vértices A(${x1}, ${y1}), B(${x2}, ${y2}) e C(${x3}, ${y3}). Quais são as coordenadas do seu baricentro?`,
    correctText,
    distractorTexts,
    explicacao: `O baricentro é ((x_A+x_B+x_C)/3, (y_A+y_B+y_C)/3) = (${Sx}/3, ${Sy}/3) = (${gx}, ${gy}).`,
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

// --- Trigonometria: +5 moldes (Fase 8 parte 1) ---
// Todos usam a tabela ANGULOS (valores APROXIMADOS) e a MESMA regra de
// arredondamento do gerador (Math.round). A aproximação usada é sempre
// declarada no enunciado e repetida na explicação, como em trigTrianguloRetangulo.
function _trigNum(v) {
  return String(v).replace(".", ",");
}

function trigRampa(dificuldade, tentativa = 0) {
  const angs =
    dificuldade === "facil"
      ? ANGULOS.filter((a) => a.graus === 30 || a.graus === 60)
      : ANGULOS.filter((a) => a.graus !== 45);
  const ang = pick(angs);
  if (dificuldade === "dificil") {
    const h = pick([10, 15, 20, 25, 30]);
    const comprimento = Math.round(h / ang.sin);
    const correctText = `${comprimento} m`;
    const distractorTexts = [
      `${h} m`, // usou o desnível como se fosse o comprimento
      `${Math.round(h * ang.sin)} m`, // multiplicou em vez de dividir
      `${Math.round(h / ang.tan)} m`, // usou tangente
      `${Math.round(h / ang.cos)} m`, // usou cosseno
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return trigRampa(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "trigonometria",
      subtopico: "Triângulo Retângulo",
      dificuldade,
      enunciado: `Um projeto de acessibilidade prevê uma rampa reta que deve vencer um desnível vertical de ${h} m, formando um ângulo de ${ang.graus}° com o plano horizontal. Usando sen ${ang.graus}° = ${_trigNum(ang.sin)}, qual deve ser aproximadamente o comprimento da rampa?`,
      correctText,
      distractorTexts,
      explicacao: `O desnível é o cateto oposto ao ângulo de ${ang.graus}° e a rampa é a hipotenusa. Como sen ${ang.graus}° = desnível ÷ comprimento, então comprimento = ${h} ÷ sen ${ang.graus}° = ${h} ÷ ${_trigNum(ang.sin)} ≈ ${correctText}.`,
    });
  }
  const c = pick(dificuldade === "facil" ? [8, 10, 12] : [10, 12, 15, 18, 20, 24]);
  const altura = Math.round(c * ang.sin);
  const correctText = `${altura} m`;
  const distractorTexts = [
    `${c} m`, // confundiu a hipotenusa (comprimento) com a altura
    `${Math.round(c * ang.cos)} m`, // usou cosseno (dá o afastamento horizontal)
    `${Math.round(c * ang.tan)} m`, // usou tangente
    `${Math.round(c / ang.sin)} m`, // dividiu em vez de multiplicar
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return trigRampa(dificuldade, tentativa + 1);
  const enunciado =
    dificuldade === "facil"
      ? `Uma rampa de acesso para cadeirantes tem ${c} m de comprimento e forma um ângulo de ${ang.graus}° com o piso. Usando sen ${ang.graus}° = ${_trigNum(ang.sin)}, qual é aproximadamente a altura vencida pela rampa?`
      : `Para embarcar veículos, um caminhão-cegonha usa uma rampa reta de ${c} m que faz um ângulo de ${ang.graus}° com o solo. Adotando sen ${ang.graus}° = ${_trigNum(ang.sin)}, a que altura do chão fica a extremidade superior da rampa?`;
  return makeQuestao({
    categoriaId: "trigonometria",
    subtopico: "Triângulo Retângulo",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao: `A altura é o cateto oposto ao ângulo de ${ang.graus}° e o comprimento da rampa é a hipotenusa. Logo, altura = comprimento × sen ${ang.graus}° = ${c} × ${_trigNum(ang.sin)} ≈ ${correctText}.`,
  });
}

function trigSombra(dificuldade, tentativa = 0) {
  const angs =
    dificuldade === "facil"
      ? ANGULOS.filter((a) => a.graus === 30 || a.graus === 60)
      : ANGULOS.filter((a) => a.graus !== 45);
  const ang = pick(angs);
  if (dificuldade === "dificil") {
    const s = pick([15, 20, 25, 30, 40]);
    const altura = Math.round(s * ang.tan);
    const correctText = `${altura} m`;
    const distractorTexts = [
      `${Math.round(s / ang.tan)} m`, // dividiu em vez de multiplicar
      `${s} m`, // repetiu o comprimento da sombra
      `${Math.round(s * ang.sin)} m`, // usou seno
      `${Math.round(s * ang.cos)} m`, // usou cosseno
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return trigSombra(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "trigonometria",
      subtopico: "Triângulo Retângulo",
      dificuldade,
      enunciado: `A sombra de uma torre em terreno plano mede ${s} m no instante em que os raios solares fazem um ângulo de ${ang.graus}° com o chão. Usando tg ${ang.graus}° = ${_trigNum(ang.tan)}, qual é aproximadamente a altura da torre?`,
      correctText,
      distractorTexts,
      explicacao: `A altura é o cateto oposto ao ângulo de elevação e a sombra é o cateto adjacente. Como tg ${ang.graus}° = altura ÷ sombra, então altura = sombra × tg ${ang.graus}° = ${s} × ${_trigNum(ang.tan)} ≈ ${correctText}.`,
    });
  }
  const h = pick(dificuldade === "facil" ? [12, 15, 18] : [20, 24, 30, 36, 40, 45]);
  const sombra = Math.round(h / ang.tan);
  const correctText = `${sombra} m`;
  const distractorTexts = [
    `${Math.round(h * ang.tan)} m`, // multiplicou em vez de dividir
    `${h} m`, // repetiu a altura
    `${Math.round(h / ang.sin)} m`, // usou seno
    `${Math.round(h / ang.cos)} m`, // usou cosseno
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return trigSombra(dificuldade, tentativa + 1);
  const enunciado =
    dificuldade === "facil"
      ? `Um poste vertical de ${h} m de altura projeta uma sombra no chão quando os raios solares formam um ângulo de ${ang.graus}° com o solo. Usando tg ${ang.graus}° = ${_trigNum(ang.tan)}, qual é o comprimento aproximado da sombra?`
      : `No fim da tarde, os raios de sol chegam a ${ang.graus}° de elevação e uma antena de ${h} m projeta sombra sobre um pátio plano e horizontal. Adotando tg ${ang.graus}° = ${_trigNum(ang.tan)}, qual é aproximadamente o comprimento dessa sombra?`;
  return makeQuestao({
    categoriaId: "trigonometria",
    subtopico: "Triângulo Retângulo",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao: `A altura é o cateto oposto ao ângulo de elevação e a sombra é o cateto adjacente. Como tg ${ang.graus}° = altura ÷ sombra, então sombra = altura ÷ tg ${ang.graus}° = ${h} ÷ ${_trigNum(ang.tan)} ≈ ${correctText}.`,
  });
}

function trigEscada(dificuldade, tentativa = 0) {
  const angs =
    dificuldade === "facil"
      ? ANGULOS.filter((a) => a.graus === 30 || a.graus === 60)
      : ANGULOS.filter((a) => a.graus !== 45);
  const ang = pick(angs);
  const L = pick(dificuldade === "facil" ? [8, 10, 12] : [10, 12, 15, 18, 20, 24]);
  if (dificuldade === "dificil") {
    const base = Math.round(L * ang.cos);
    const correctText = `${base} m`;
    const distractorTexts = [
      `${L} m`, // usou o comprimento da escada
      `${Math.round(L * ang.sin)} m`, // usou seno (dá a altura alcançada)
      `${Math.round(L * ang.tan)} m`, // usou tangente
      `${Math.round(L / ang.cos)} m`, // dividiu em vez de multiplicar
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return trigEscada(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "trigonometria",
      subtopico: "Triângulo Retângulo",
      dificuldade,
      enunciado: `Uma escada de ${L} m está encostada em uma parede vertical e forma um ângulo de ${ang.graus}° com o chão. Usando cos ${ang.graus}° = ${_trigNum(ang.cos)}, qual é aproximadamente a distância do pé da escada até a parede?`,
      correctText,
      distractorTexts,
      explicacao: `A distância do pé da escada à parede é o cateto adjacente ao ângulo de ${ang.graus}° e a escada é a hipotenusa. Logo, distância = escada × cos ${ang.graus}° = ${L} × ${_trigNum(ang.cos)} ≈ ${correctText}.`,
    });
  }
  const altura = Math.round(L * ang.sin);
  const correctText = `${altura} m`;
  const distractorTexts = [
    `${L} m`, // usou o comprimento da escada
    `${Math.round(L * ang.cos)} m`, // usou cosseno (dá a distância à parede)
    `${Math.round(L * ang.tan)} m`, // usou tangente
    `${Math.round(L / ang.sin)} m`, // dividiu em vez de multiplicar
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return trigEscada(dificuldade, tentativa + 1);
  const enunciado =
    dificuldade === "facil"
      ? `Uma escada de ${L} m está apoiada em uma parede vertical e forma um ângulo de ${ang.graus}° com o chão. Usando sen ${ang.graus}° = ${_trigNum(ang.sin)}, a que altura da parede a escada se apoia?`
      : `Um pintor apoia uma escada de ${L} m contra um muro, formando um ângulo de ${ang.graus}° com o piso horizontal. Adotando sen ${ang.graus}° = ${_trigNum(ang.sin)}, qual é aproximadamente a altura atingida pelo topo da escada?`;
  return makeQuestao({
    categoriaId: "trigonometria",
    subtopico: "Triângulo Retângulo",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao: `A altura atingida é o cateto oposto ao ângulo de ${ang.graus}° e a escada é a hipotenusa. Logo, altura = escada × sen ${ang.graus}° = ${L} × ${_trigNum(ang.sin)} ≈ ${correctText}.`,
  });
}

function trigLeiSenos(dificuldade, tentativa = 0) {
  const opcoes = dificuldade === "facil" ? [30, 60] : [30, 37, 53, 60];
  const gA = pick(opcoes);
  const gB = pick(opcoes.filter((g) => g !== gA));
  const angA = ANGULOS.find((a) => a.graus === gA);
  const angB = ANGULOS.find((a) => a.graus === gB);
  const a = pick(dificuldade === "facil" ? [10, 20, 30] : [12, 15, 18, 24, 30, 36]);
  const b = Math.round((a * angB.sin) / angA.sin);
  const correctText = `${b} m`;
  const distractorTexts = [
    `${Math.round((a * angA.sin) / angB.sin)} m`, // inverteu a razão dos senos
    `${Math.round(a * angB.sin)} m`, // esqueceu de dividir por sen A
    `${a} m`, // repetiu o lado dado
    `${Math.round(a * angA.sin * angB.sin)} m`, // multiplicou os senos em vez de dividir
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return trigLeiSenos(dificuldade, tentativa + 1);
  const enunciado =
    dificuldade === "facil"
      ? `Em um triângulo ABC, o ângulo A mede ${gA}° e o ângulo B mede ${gB}°. O lado a, oposto ao ângulo A, mede ${a} m. Usando sen ${gA}° = ${_trigNum(angA.sin)} e sen ${gB}° = ${_trigNum(angB.sin)}, quanto mede aproximadamente o lado b, oposto ao ângulo B?`
      : dificuldade === "medio"
      ? `Um terreno tem a forma de um triângulo ABC no qual o ângulo A mede ${gA}° e o ângulo B mede ${gB}°. O lado oposto ao ângulo A mede ${a} m. Adotando sen ${gA}° = ${_trigNum(angA.sin)} e sen ${gB}° = ${_trigNum(angB.sin)}, qual é a medida aproximada do lado oposto ao ângulo B?`
      : `Para estimar a distância entre dois pontos A e B em margens opostas de um lago, um topógrafo mede, de um terceiro ponto C, um triângulo em que o ângulo A vale ${gA}° e o ângulo B vale ${gB}°. O lado oposto ao ângulo A mede ${a} m. Usando sen ${gA}° = ${_trigNum(angA.sin)} e sen ${gB}° = ${_trigNum(angB.sin)}, qual é aproximadamente a medida do lado oposto ao ângulo B?`;
  return makeQuestao({
    categoriaId: "trigonometria",
    subtopico: "Lei dos Senos",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao: `Pela lei dos senos, a ÷ sen A = b ÷ sen B. Logo, b = a × sen B ÷ sen A = ${a} × ${_trigNum(angB.sin)} ÷ ${_trigNum(angA.sin)} ≈ ${correctText}.`,
  });
}

function trigLeiCossenos(dificuldade, tentativa = 0) {
  const opcoes = dificuldade === "facil" ? [60] : [30, 37, 53, 60];
  const gA = pick(opcoes);
  const angA = ANGULOS.find((a) => a.graus === gA);
  const pares = [
    [8, 5],
    [8, 3],
    [7, 4],
    [9, 5],
    [6, 5],
    [10, 6],
    [7, 6],
  ];
  let [b, c] = pick(pares);
  const k = dificuldade === "dificil" ? pick([1, 2, 3]) : dificuldade === "medio" ? pick([1, 2]) : 1;
  b *= k;
  c *= k;
  const disc = b * b + c * c - 2 * b * c * angA.cos;
  const a = Math.round(Math.sqrt(disc));
  const correctText = `${a} m`;
  const distractorTexts = [
    `${Math.round(Math.sqrt(b * b + c * c))} m`, // esqueceu o termo −2·b·c·cos A (usou Pitágoras)
    `${Math.round(Math.sqrt(b * b + c * c + 2 * b * c * angA.cos))} m`, // trocou o sinal do termo
    `${b + c} m`, // somou os dois lados
    `${Math.round(Math.sqrt(Math.abs(b * b + c * c - 2 * b * c * angA.sin)))} m`, // usou seno no lugar do cosseno
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return trigLeiCossenos(dificuldade, tentativa + 1);
  const discFmt = _trigNum(Math.round(disc * 100) / 100);
  const enunciado =
    dificuldade === "facil"
      ? `Em um triângulo, dois lados medem ${b} m e ${c} m e o ângulo entre eles mede ${gA}°. Usando cos ${gA}° = ${_trigNum(angA.cos)}, qual é a medida aproximada do terceiro lado?`
      : dificuldade === "medio"
      ? `Um terreno triangular tem dois lados que medem ${b} m e ${c} m e formam entre si um ângulo de ${gA}°. Adotando cos ${gA}° = ${_trigNum(angA.cos)}, qual é o comprimento aproximado do terceiro lado?`
      : `Dois trechos retos de uma trilha, de ${b} m e ${c} m, partem de um mesmo ponto formando um ângulo de ${gA}° entre si. Usando cos ${gA}° = ${_trigNum(angA.cos)}, qual é aproximadamente a distância em linha reta entre as extremidades dos dois trechos?`;
  return makeQuestao({
    categoriaId: "trigonometria",
    subtopico: "Lei dos Cossenos",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao: `Pela lei dos cossenos, a² = b² + c² − 2·b·c·cos ${gA}° = ${b}² + ${c}² − 2·${b}·${c}·${_trigNum(angA.cos)} = ${discFmt}. Logo, a = √${discFmt} ≈ ${correctText}.`,
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

// --- Probabilidade: +6 moldes (Fase 7 parte 2) ---
function _probFr(n, d) {
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}

function probComReposicao(dificuldade, tentativa = 0) {
  const bases = [[1, 3], [1, 4], [1, 5], [2, 5], [2, 7], [3, 7]];
  const [bn, bd] = pick(bases);
  const k = dificuldade === "facil" ? 2 : dificuldade === "medio" ? 3 : pick([2, 3, 4]);
  const a = bn * k;
  const n = bd * k;
  const correctText = _probFr(bn * bn, bd * bd);
  const contextos = [
    ["bola", "bolas", "verde", "verdes"],
    ["ficha", "fichas", "vermelha", "vermelhas"],
    ["esfera", "esferas", "amarela", "amarelas"],
    ["peça", "peças", "preta", "pretas"],
  ];
  const [sing, plur, corS, corP] = pick(contextos);
  const distractorTexts = [
    _probFr(bn, bd), // esqueceu de elevar ao quadrado (probabilidade de uma só retirada)
    _probFr(a * (a - 1), n * (n - 1)), // calculou como se fosse sem reposição
    _probFr(2 * bn, bd), // somou as probabilidades em vez de multiplicar
    _probFr(a, n * n), // 1 caso favorável sobre todos os pares ordenados
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return probComReposicao(dificuldade, tentativa + 1);
  const enunciado =
    dificuldade === "dificil"
      ? `Uma máquina sorteia ${plur}, ao acaso e com reposição, de uma caixa que contém ${n} delas, sendo ${a} ${corP}. Em dois sorteios consecutivos, qual é a probabilidade de sair uma ${sing} ${corS} nas duas vezes?`
      : `Uma urna contém ${n} ${plur}, das quais ${a} são ${corP}. Retira-se uma ${sing} ao acaso, observa-se sua cor e recoloca-se na urna; em seguida, retira-se outra ${sing}. Qual é a probabilidade de que ambas as retiradas resultem em ${plur} ${corP}?`;
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Eventos Sucessivos",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao: `Com reposição, as duas retiradas são independentes e cada uma tem probabilidade ${a}/${n} = ${bn}/${bd} de resultar em ${sing} ${corS}. Logo P = (${bn}/${bd}) × (${bn}/${bd}) = ${correctText}.`,
  });
}

function probComplementar(dificuldade, tentativa = 0) {
  const bases = [[1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]];
  const [pn, pd] = pick(bases); // p = probabilidade de o evento desfavorável ocorrer numa tentativa
  const k = dificuldade === "facil" ? 2 : dificuldade === "medio" ? 3 : pick([3, 4]);
  const pkN = Math.pow(pn, k);
  const pkD = Math.pow(pd, k);
  const correctText = _probFr(pkD - pkN, pkD);
  const contextos = [
    ["um jogo de tiro ao alvo", "errar o alvo", "disparos", "acertar o alvo pelo menos uma vez"],
    ["uma máquina de arcade", "não liberar o prêmio", "tentativas", "liberar o prêmio ao menos uma vez"],
    ["um controle de qualidade", "não identificar o defeito", "inspeções", "identificar o defeito ao menos uma vez"],
    ["um sorteio de brindes", "não contemplar o cliente", "cupons", "o cliente ser contemplado ao menos uma vez"],
  ];
  const [cenario, ruim, unidade, objetivo] = pick(contextos);
  const distractorTexts = [
    _probFr(pkN, pkD), // esqueceu de subtrair de 1 (deu a probabilidade de falhar em todas)
    _probFr(pd - pn, pd), // usou apenas uma tentativa
    _probFr(Math.pow(pd - pn, k), pkD), // probabilidade de ter sucesso em TODAS as k tentativas
    _probFr(k * (pd - pn) * Math.pow(pn, k - 1), pkD), // probabilidade de exatamente um sucesso
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return probComplementar(dificuldade, tentativa + 1);
  const enunciado =
    dificuldade === "dificil"
      ? `Um equipamento possui ${k} dispositivos de segurança que funcionam de forma independente. Cada dispositivo deixa de acionar com probabilidade ${pn}/${pd}. O equipamento fica protegido se pelo menos um dispositivo acionar. Qual é a probabilidade de o equipamento ficar protegido?`
      : `Em ${cenario}, a probabilidade de ${ruim} em cada tentativa é ${pn}/${pd}, de forma independente. Fazendo-se ${k} ${unidade}, qual é a probabilidade de ${objetivo}?`;
  const explicacao =
    dificuldade === "dificil"
      ? `P(pelo menos um aciona) = 1 − P(nenhum aciona). Como os dispositivos são independentes, P(nenhum aciona) = (${pn}/${pd})^${k} = ${pkN}/${pkD}. Logo P = 1 − ${pkN}/${pkD} = ${correctText}.`
      : `P(${objetivo}) = 1 − P(o evento desfavorável ocorrer nas ${k} tentativas). Sendo as tentativas independentes, P(desfavorável em todas) = (${pn}/${pd})^${k} = ${pkN}/${pkD}. Portanto P = 1 − ${pkN}/${pkD} = ${correctText}.`;
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Eventos Sucessivos",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

function probUniaoExclusiva(dificuldade, tentativa = 0) {
  const faces = [1, 2, 3, 4, 5, 6];
  if (dificuldade === "dificil") {
    const N = pick([10, 12, 15, 20]);
    const m = pick([3, 4, 5]);
    let k = randInt(1, N);
    let guard = 0;
    while (k % m === 0 && guard < 60) {
      k = randInt(1, N);
      guard++;
    }
    let favA = 0;
    for (let x = 1; x <= N; x++) if (x % m === 0) favA++;
    const fav = favA + 1;
    const correctText = _probFr(fav, N);
    const distractorTexts = [
      _probFr(favA, N), // considerou só os múltiplos de m
      _probFr(favA, N * N), // multiplicou P(múltiplo)·P(número k)
      _probFr(fav, N - fav), // razão casos favoráveis : desfavoráveis
      _probFr(N - fav, N), // probabilidade de NÃO ocorrer nenhum dos dois
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return probUniaoExclusiva(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "probabilidade",
      subtopico: "Probabilidade Simples",
      dificuldade,
      enunciado: `Uma roleta é dividida em ${N} setores iguais, numerados de 1 a ${N}, e o ponteiro tem a mesma chance de parar em qualquer setor. Girando-a uma vez, qual é a probabilidade de o ponteiro parar em um número múltiplo de ${m} ou no número ${k}?`,
      correctText,
      distractorTexts,
      explicacao: `Como ${k} não é múltiplo de ${m}, os dois eventos são mutuamente exclusivos. Entre 1 e ${N} há ${favA} múltiplos de ${m}, com probabilidade ${favA}/${N}; o número ${k} tem probabilidade 1/${N}. Logo P = ${favA}/${N} + 1/${N} = ${fav}/${N} = ${correctText}.`,
    });
  }
  if (dificuldade === "facil") {
    const f1 = randInt(1, 5);
    const f2 = randInt(f1 + 1, 6);
    let fav = 0;
    for (const x of faces) if (x === f1 || x === f2) fav++;
    const correctText = _probFr(fav, 6);
    const distractorTexts = [
      `1/6`, // considerou apenas uma das faces
      `1/36`, // multiplicou P(f1)·P(f2) em vez de somar
      _probFr(fav, 6 - fav), // razão casos favoráveis : desfavoráveis
      _probFr(6 - fav, 6), // probabilidade de não sair nenhuma delas
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return probUniaoExclusiva(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "probabilidade",
      subtopico: "Probabilidade Simples",
      dificuldade,
      enunciado: `Um dado comum e honesto é lançado uma única vez. Qual é a probabilidade de sair a face ${f1} ou a face ${f2}?`,
      correctText,
      distractorTexts,
      explicacao: `Os eventos "sair ${f1}" e "sair ${f2}" são mutuamente exclusivos. Como P(sair ${f1}) = 1/6 e P(sair ${f2}) = 1/6, temos P = 1/6 + 1/6 = ${fav}/6 = ${correctText}.`,
    });
  }
  const k = pick([1, 3, 5]);
  let favPar = 0;
  for (const x of faces) if (x % 2 === 0) favPar++;
  const fav = favPar + 1;
  const correctText = _probFr(fav, 6);
  const distractorTexts = [
    _probFr(favPar, 6), // considerou só os pares
    `1/6`, // considerou só o número k
    _probFr(favPar, 36), // multiplicou P(par)·P(k)
    _probFr(6 - fav, 6), // probabilidade de não ocorrer
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return probUniaoExclusiva(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Probabilidade Simples",
    dificuldade,
    enunciado: `Um dado comum e honesto é lançado uma única vez. Qual é a probabilidade de o resultado ser um número par ou ser igual a ${k}?`,
    correctText,
    distractorTexts,
    explicacao: `Como ${k} é ímpar, os eventos "sair par" e "sair ${k}" são mutuamente exclusivos. P(par) = 3/6 e P(${k}) = 1/6, então P = 3/6 + 1/6 = ${fav}/6 = ${correctText}.`,
  });
}

function probDoisDados(dificuldade, tentativa = 0) {
  const total = 36;
  let alvo, testar, enunciado;
  if (dificuldade === "facil") {
    alvo = pick([5, 6, 8, 9]);
    testar = (x, y) => x + y === alvo;
    enunciado = `Dois dados comuns e honestos são lançados simultaneamente. Qual é a probabilidade de a soma dos pontos obtidos ser igual a ${alvo}?`;
  } else if (dificuldade === "medio") {
    alvo = pick([3, 4]);
    testar = (x, y) => Math.max(x, y) === alvo;
    enunciado = `Dois dados comuns e honestos são lançados ao mesmo tempo. Qual é a probabilidade de o maior dos dois valores obtidos ser igual a ${alvo}? (Quando os dois dados mostram o mesmo número, esse número é o maior valor.)`;
  } else {
    alvo = pick([9, 10]);
    testar = (x, y) => x + y >= alvo;
    enunciado = `No lançamento simultâneo de dois dados comuns e honestos, qual é a probabilidade de a soma dos pontos obtidos ser maior ou igual a ${alvo}?`;
  }
  let fav = 0;
  let favNaoOrdenado = 0;
  const pares = [];
  for (let x = 1; x <= 6; x++) {
    for (let y = 1; y <= 6; y++) {
      if (testar(x, y)) {
        fav++;
        if (x <= y) {
          favNaoOrdenado++;
          pares.push(`(${x}, ${y})`);
        }
      }
    }
  }
  const correctText = _probFr(fav, total);
  const distractorTexts = [
    _probFr(total - fav, total), // probabilidade do evento complementar
    _probFr(favNaoOrdenado, total), // contou apenas os pares não ordenados
    _probFr(fav, 12), // usou espaço amostral 6 + 6 = 12
    _probFr(fav, total - fav), // razão casos favoráveis : desfavoráveis
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return probDoisDados(dificuldade, tentativa + 1);
  const criterio =
    dificuldade === "medio"
      ? `o maior valor é ${alvo}`
      : dificuldade === "facil"
        ? `a soma é ${alvo}`
        : `a soma é maior ou igual a ${alvo}`;
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Probabilidade Simples",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao: `Há 6 × 6 = 36 pares ordenados igualmente prováveis. Os casos (com x ≤ y) em que ${criterio}: ${pares.join(", ")}; contando também os pares simétricos, são ${fav} pares ordenados. Logo P = ${fav}/36 = ${correctText}.`,
  });
}

function probBaralho(dificuldade, tentativa = 0) {
  const naipes = ["copas", "espadas", "ouros", "paus"];
  const deck = [];
  for (const np of naipes) for (let v = 1; v <= 13; v++) deck.push({ naipe: np, valor: v });
  if (dificuldade === "facil") {
    const alvo = pick(naipes);
    const fav = deck.filter((c) => c.naipe === alvo).length;
    const correctText = _probFr(fav, 52);
    const distractorTexts = [
      `1/52`, // uma única carta
      _probFr(4, 52), // número de naipes sobre o total
      _probFr(fav, 52 - fav), // favoráveis : restantes
      _probFr(12, 52), // confundiu naipe com figura
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return probBaralho(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "probabilidade",
      subtopico: "Probabilidade Simples",
      dificuldade,
      enunciado: `De um baralho comum de 52 cartas (13 de cada naipe), retira-se uma carta ao acaso. Qual é a probabilidade de ela ser do naipe de ${alvo}?`,
      correctText,
      distractorTexts,
      explicacao: `São 13 cartas de ${alvo} em 52. Logo P = 13/52 = ${correctText}.`,
    });
  }
  if (dificuldade === "medio") {
    const fav = deck.filter((c) => c.valor >= 11).length;
    const correctText = _probFr(fav, 52);
    const distractorTexts = [
      _probFr(3, 52), // apenas as 3 figuras de um naipe
      _probFr(4, 52), // apenas os 4 reis
      _probFr(fav, 52 - fav), // favoráveis : restantes
      _probFr(13, 52), // incluiu o ás entre as figuras
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return probBaralho(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "probabilidade",
      subtopico: "Probabilidade Simples",
      dificuldade,
      enunciado: `De um baralho comum de 52 cartas, retira-se uma carta ao acaso. Qual é a probabilidade de ela ser uma figura, isto é, um valete, uma dama ou um rei?`,
      correctText,
      distractorTexts,
      explicacao: `Cada naipe tem 3 figuras (valete, dama e rei), num total de 4 × 3 = 12 figuras em 52 cartas. Logo P = 12/52 = ${correctText}.`,
    });
  }
  const favCopas = deck.filter((c) => c.naipe === "copas").length;
  const favRei = deck.filter((c) => c.valor === 13).length;
  const favInter = deck.filter((c) => c.naipe === "copas" && c.valor === 13).length;
  const fav = favCopas + favRei - favInter;
  const correctText = _probFr(fav, 52);
  const distractorTexts = [
    _probFr(favCopas + favRei, 52), // esqueceu de subtrair a carta contada duas vezes
    _probFr(favCopas, 52), // considerou apenas copas
    _probFr(favCopas * favRei, 52 * 52), // multiplicou P(copas)·P(rei)
    _probFr(fav, 52 - fav), // favoráveis : restantes
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return probBaralho(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Probabilidade Simples",
    dificuldade,
    enunciado: `De um baralho comum de 52 cartas, retira-se uma carta ao acaso. Qual é a probabilidade de ela ser uma carta de copas ou ser um rei?`,
    correctText,
    distractorTexts,
    explicacao: `P(copas) = 13/52, P(rei) = 4/52 e P(rei de copas) = 1/52. Pela regra da adição, P(copas ou rei) = 13/52 + 4/52 − 1/52 = 16/52 = ${correctText}.`,
  });
}

function probTabelaContingencia(dificuldade, tentativa = 0) {
  const tabelas = [
    { a: 12, b: 8, c: 6, d: 24 },
    { a: 15, b: 5, c: 10, d: 20 },
    { a: 9, b: 6, c: 12, d: 3 },
    { a: 20, b: 10, c: 5, d: 15 },
    { a: 16, b: 4, c: 12, d: 8 },
    { a: 18, b: 12, c: 6, d: 24 },
    { a: 8, b: 12, c: 20, d: 10 },
    { a: 10, b: 15, c: 9, d: 6 },
    { a: 24, b: 6, c: 8, d: 12 },
    { a: 6, b: 9, c: 15, d: 30 },
  ];
  const { a, b, c, d } = pick(tabelas);
  const N = a + b + c + d;
  const linha1 = a + b;
  const linha2 = c + d;
  const col1 = a + c;
  const col2 = b + d;
  const contextos = [
    { pop: "estudantes de uma turma", grp: "o sexo", art1: "os", r1: "meninos", art2: "as", r2: "meninas", it1: "estudar de manhã", it2: "estudar à noite" },
    { pop: "funcionários de uma empresa", grp: "o cargo", art1: "os", r1: "técnicos", art2: "os", r2: "analistas", it1: "o regime presencial", it2: "o regime remoto" },
    { pop: "moradores de um bairro", grp: "a faixa etária", art1: "os", r1: "jovens", art2: "os", r2: "idosos", it1: "o transporte público", it2: "o carro particular" },
  ];
  const ctx = pick(contextos);
  const G1 = ctx.art1.charAt(0).toUpperCase() + ctx.art1.slice(1);
  const G2 = ctx.art2.charAt(0).toUpperCase() + ctx.art2.slice(1);
  const tabelaTxt = `Uma pesquisa com ${N} ${ctx.pop} cruzou ${ctx.grp} com a preferência entre ${ctx.it1} e ${ctx.it2}. ${G1} ${ctx.r1}: ${a} preferem ${ctx.it1} e ${b} preferem ${ctx.it2} (total ${linha1}). ${G2} ${ctx.r2}: ${c} preferem ${ctx.it1} e ${d} preferem ${ctx.it2} (total ${linha2}). No total, ${col1} pessoas preferem ${ctx.it1} e ${col2} preferem ${ctx.it2}, somando ${N} pessoas.`;
  if (dificuldade === "medio") {
    const correctText = _probFr(a, linha1);
    const distractorTexts = [
      _probFr(a, N), // dividiu pelo total geral em vez do total do grupo
      _probFr(a, col1), // dividiu pelo total da coluna
      _probFr(b, linha1), // usou a outra célula da linha
      _probFr(col1, N), // deu a probabilidade marginal P(preferir it1)
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return probTabelaContingencia(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "probabilidade",
      subtopico: "Probabilidade Condicional",
      dificuldade,
      enunciado: `${tabelaTxt} Escolhendo-se ao acaso uma pessoa entre ${ctx.art1} ${ctx.r1}, qual é a probabilidade de que ela prefira ${ctx.it1}?`,
      correctText,
      distractorTexts,
      explicacao: `É uma probabilidade condicional. Entre ${ctx.art1} ${ctx.r1} há ${linha1} pessoas, das quais ${a} preferem ${ctx.it1}. Logo P = ${a}/${linha1} = ${correctText}.`,
    });
  }
  if (dificuldade === "facil") {
    const correctText = _probFr(linha1, N);
    const distractorTexts = [
      _probFr(a, N), // usou só uma célula da linha
      _probFr(col1, N), // somou a coluna em vez da linha
      _probFr(linha2, N), // deu a probabilidade do outro grupo
      _probFr(linha1, linha2), // dividiu pelo total do grupo oposto
    ];
    if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
      return probTabelaContingencia(dificuldade, tentativa + 1);
    return makeQuestao({
      categoriaId: "probabilidade",
      subtopico: "Probabilidade Simples",
      dificuldade,
      enunciado: `${tabelaTxt} Escolhendo-se ao acaso uma dessas ${N} pessoas, qual é a probabilidade de que ela pertença ao grupo d${ctx.art1} ${ctx.r1}?`,
      correctText,
      distractorTexts,
      explicacao: `São ${linha1} ${ctx.r1} em um total de ${N} pessoas. Logo P = ${linha1}/${N} = ${correctText}.`,
    });
  }
  const correctText = _probFr(b, N);
  const distractorTexts = [
    _probFr(b, linha1), // dividiu pelo total da linha (condicional em vez de conjunta)
    _probFr(b, col2), // dividiu pelo total da coluna
    _probFr(a, N), // pegou a célula errada da linha
    _probFr(col2, N), // deu a probabilidade marginal P(preferir it2)
  ];
  if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
    return probTabelaContingencia(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "probabilidade",
    subtopico: "Probabilidade Simples",
    dificuldade,
    enunciado: `${tabelaTxt} Escolhendo-se ao acaso uma dessas ${N} pessoas, qual é a probabilidade de que ela pertença ao grupo d${ctx.art1} ${ctx.r1} e prefira ${ctx.it2}?`,
    correctText,
    distractorTexts,
    explicacao: `A probabilidade pedida é a da interseção. Entre as ${N} pessoas, ${b} são d${ctx.art1} ${ctx.r1} e preferem ${ctx.it2}. Logo P = ${b}/${N} = ${correctText}.`,
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

function arranjo(n, k) { return Math.round(fatorial(n) / fatorial(n - k)); }
function _combDistintos(correct, distractors) {
  const all = [String(correct), ...distractors.map((d) => String(d))];
  if (all.some((s) => /undefined|NaN|Infinity/.test(s))) return false;
  return new Set(all).size === all.length;
}

// n objetos distintos em fila/sequência ⇒ n!.
function combPermutacaoSimples(dificuldade, tentativa = 0) {
  let n, enunciado;
  if (dificuldade === "facil") {
    n = 4;
    const ctx = pick([
      "entrar no cinema",
      "tirar uma foto",
      "serem atendidas em um caixa",
      "subir em um brinquedo do parque",
    ]);
    enunciado = `De quantas maneiras diferentes ${n} pessoas podem formar uma única fila para ${ctx}?`;
  } else if (dificuldade === "medio") {
    n = randInt(5, 6);
    const obj = pick(["livros diferentes", "troféus", "quadros", "vasos decorativos"]);
    enunciado = `Uma prateleira será usada para expor ${n} ${obj}, lado a lado. De quantas formas distintas esses objetos podem ser dispostos na prateleira?`;
  } else {
    n = randInt(6, 7);
    const grupo = pick(["grupos musicais", "candidatos", "peças de teatro", "atletas na cerimônia"]);
    enunciado = `Em um evento, ${n} ${grupo} vão se apresentar em sequência, um após o outro. Quantas ordens diferentes de apresentação são possíveis?`;
  }
  const correct = fatorial(n);
  const correctText = `${correct}`;
  const distractorTexts = [
    `${fatorial(n - 1)}`,
    `${n * n}`,
    `${fatorial(n) / 2}`,
    `${fatorial(n + 1)}`,
  ];
  const explicacao = `São ${n} elementos distintos a serem ordenados em ${n} posições. O total é a permutação P(${n}) = ${n}! = ${correct}.`;
  if (tentativa < 20 && !_combDistintos(correctText, distractorTexts))
    return combPermutacaoSimples(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Permutação",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// n pessoas em torno de uma mesa redonda ⇒ (n − 1)!.
function combPermutacaoCircular(dificuldade, tentativa = 0) {
  let n, enunciado;
  if (dificuldade === "facil") {
    n = 4;
    enunciado = `${n} amigos vão se sentar ao redor de uma mesa redonda. Considerando iguais duas disposições quando uma pode ser obtida da outra por rotação, de quantas maneiras diferentes eles podem ocupar os lugares?`;
  } else if (dificuldade === "medio") {
    n = randInt(5, 6);
    enunciado = `Em uma reunião, ${n} pessoas vão se acomodar em torno de uma mesa circular. Duas acomodações são consideradas a mesma quando diferem apenas por uma rotação da mesa. De quantos modos distintos elas podem se sentar?`;
  } else {
    n = randInt(6, 7);
    enunciado = `${n} convidados serão dispostos ao redor de uma mesa redonda em um jantar. Quantas disposições circulares distintas existem, sabendo que só importam as posições relativas entre os convidados?`;
  }
  const correct = fatorial(n - 1);
  const correctText = `${correct}`;
  const distractorTexts = [
    `${fatorial(n)}`,
    `${fatorial(n - 2)}`,
    `${fatorial(n - 1) / 2}`,
    `${n * (n - 1)}`,
  ];
  const explicacao = `Em uma permutação circular de ${n} elementos, fixa-se um deles como referência e permutam-se os outros ${n - 1}: (${n} − 1)! = ${n - 1}! = ${correct}.`;
  if (tentativa < 20 && !_combDistintos(correctText, distractorTexts))
    return combPermutacaoCircular(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Permutação",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// k posições ordenadas com elementos distintos escolhidos entre n ⇒ A(n,k) = n!/(n−k)!.
function combArranjo(dificuldade, tentativa = 0) {
  let n, k, enunciado;
  if (dificuldade === "facil") {
    k = 2;
    n = randInt(5, 7);
    enunciado = `Em uma corrida com ${n} atletas, serão premiados o 1º e o 2º colocados, com medalhas distintas para cada posição. De quantas maneiras diferentes esse pódio pode ser formado?`;
  } else if (dificuldade === "medio") {
    k = 3;
    n = randInt(5, 7);
    enunciado = `Um cofre é aberto por uma senha de ${k} algarismos distintos, todos escolhidos entre os números de 1 a ${n}. Quantas senhas diferentes podem ser criadas?`;
  } else {
    k = 3;
    n = randInt(7, 9);
    enunciado = `Uma equipe de ${n} pessoas precisa escolher um presidente, um vice-presidente e um tesoureiro, sendo os três cargos ocupados por pessoas diferentes. De quantas formas distintas essa escolha pode ser feita?`;
  }
  const correct = arranjo(n, k);
  const correctText = `${correct}`;
  const distractorTexts = [
    `${Math.pow(n, k)}`,
    `${combinacao(n, k)}`,
    `${fatorial(n)}`,
    `${Math.round(fatorial(n) / fatorial(k))}`,
  ];
  const explicacao = `A ordem das posições importa e não há repetição: arranjo A(${n}, ${k}) = ${n}! / (${n} − ${k})! = ${n}!/${n - k}! = ${correct}.`;
  if (tentativa < 20 && !_combDistintos(correctText, distractorTexts))
    return combArranjo(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Arranjo",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// k posições, m símbolos disponíveis, repetição livre ⇒ m^k.
function combComRepeticao(dificuldade, tentativa = 0) {
  let m, k, enunciado;
  if (dificuldade === "facil") {
    m = 10;
    k = 3;
    enunciado = `O teclado de um cofre é destravado por uma senha de ${k} algarismos, e cada posição pode receber qualquer um dos ${m} algarismos de 0 a 9, inclusive repetidos. Quantas senhas diferentes são possíveis?`;
  } else if (dificuldade === "medio") {
    m = 26;
    k = 2;
    enunciado = `Um sistema identifica lotes com um código de ${k} letras, cada uma escolhida entre as ${m} letras do alfabeto, podendo haver repetição. Quantos códigos distintos podem ser gerados?`;
  } else {
    k = randInt(3, 4);
    m = randInt(k + 2, k + 4);
    enunciado = `Um cadeado tem ${k} anéis, e em cada anel estão gravados ${m} símbolos diferentes. O segredo é uma sequência formada por um símbolo de cada anel, e símbolos podem se repetir. Quantos segredos diferentes o cadeado admite?`;
  }
  const correct = Math.pow(m, k);
  const correctText = `${correct}`;
  const distractorTexts = [
    `${arranjo(m, k)}`,
    `${combinacao(m + k - 1, k)}`,
    `${m * k}`,
    `${Math.pow(m, k - 1)}`,
  ];
  const explicacao = `Cada uma das ${k} posições pode ser preenchida livremente de ${m} formas, independentemente das demais. Pelo princípio multiplicativo: ${m}^${k} = ${correct}.`;
  if (tentativa < 20 && !_combDistintos(correctText, distractorTexts))
    return combComRepeticao(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Princípio Multiplicativo",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Anagramas: letras distintas ⇒ n!; uma letra dupla ⇒ n!/2!.
function combAnagramas(dificuldade, tentativa = 0) {
  let palavra, n, correct, distractorTexts, enunciado, explicacao;
  if (dificuldade === "dificil") {
    palavra = pick(["PANELA", "CAVALO", "PAREDE", "CARETA", "COELHO"]);
    n = palavra.length;
    const rep = [...palavra].find((c, i) => palavra.indexOf(c) !== i);
    correct = Math.round(fatorial(n) / fatorial(2));
    distractorTexts = [
      `${fatorial(n)}`,
      `${Math.round(fatorial(n) / 4)}`,
      `${n * n}`,
      `${fatorial(n - 1)}`,
    ];
    enunciado = `Quantos anagramas distintos podem ser formados com todas as letras da palavra ${palavra}, observando que uma de suas letras aparece repetida?`;
    explicacao = `A palavra ${palavra} tem ${n} letras, com a letra ${rep} repetida 2 vezes. O número de anagramas é ${n}! / 2! = ${fatorial(n)} / 2 = ${correct}.`;
  } else {
    const facil = dificuldade === "facil";
    palavra = pick(facil ? ["MESA", "SAPO", "VELA", "LIRA", "PATO"] : ["LIVRO", "PRATO", "TEMPO", "CAMPO", "MUNDO"]);
    n = palavra.length;
    correct = fatorial(n);
    distractorTexts = [
      `${fatorial(n) / 2}`,
      `${fatorial(n - 1)}`,
      `${n * n}`,
      `${2 * fatorial(n)}`,
    ];
    enunciado = facil
      ? `Quantas "palavras" diferentes (com ou sem significado) podem ser formadas reordenando todas as letras da palavra ${palavra}?`
      : `Um anagrama é qualquer reordenação das letras de uma palavra. Quantos anagramas distintos a palavra ${palavra} possui?`;
    explicacao = `Todas as ${n} letras da palavra ${palavra} são distintas, então o número de anagramas é ${n}! = ${correct}.`;
  }
  const correctText = `${correct}`;
  if (tentativa < 20 && !_combDistintos(correctText, distractorTexts))
    return combAnagramas(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Permutação",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Grupo de x+y com x de um subgrupo de a e y de outro de b ⇒ C(a,x)·C(b,y).
function combComissaoRestricao(dificuldade, tentativa = 0) {
  const ctx = pick([
    { a: "homens", b: "mulheres", aSing: "homem", bSing: "mulher", grupo: "comissão" },
    { a: "professores", b: "alunos", aSing: "professor", bSing: "aluno", grupo: "comissão organizadora" },
    { a: "médicos", b: "enfermeiros", aSing: "médico", bSing: "enfermeiro", grupo: "equipe de plantão" },
    { a: "veteranos", b: "novatos", aSing: "veterano", bSing: "novato", grupo: "equipe" },
  ]);
  const nomeA = (q) => (q === 1 ? ctx.aSing : ctx.a);
  const nomeB = (q) => (q === 1 ? ctx.bSing : ctx.b);
  let a, b, x, y;
  if (dificuldade === "facil") {
    a = 4; b = 4; x = 2; y = 1;
  } else if (dificuldade === "medio") {
    a = 5; b = 4; x = 2; y = 2;
  } else {
    a = 6; b = 5; x = 3; y = 2;
  }
  const correct = combinacao(a, x) * combinacao(b, y);
  const correctText = `${correct}`;
  const distractorTexts = [
    `${combinacao(a, x) + combinacao(b, y)}`,
    `${combinacao(a + b, x + y)}`,
    `${combinacao(a, x) * combinacao(b, y === 1 ? 2 : 1)}`,
    `${arranjo(a, x) * arranjo(b, y)}`,
  ];
  const enunciado = `Uma ${ctx.grupo} de ${x + y} pessoas será formada a partir de um grupo com ${a} ${ctx.a} e ${b} ${ctx.b}. De quantas maneiras diferentes ela pode ser composta, sabendo que deve conter exatamente ${x} ${nomeA(x)} e ${y} ${nomeB(y)}?`;
  const explicacao = `Escolhem-se ${x} entre os ${a} ${ctx.a} — C(${a}, ${x}) = ${combinacao(a, x)} modos — e ${y} entre os ${b} ${ctx.b} — C(${b}, ${y}) = ${combinacao(b, y)} modos. Pelo princípio multiplicativo: ${combinacao(a, x)} × ${combinacao(b, y)} = ${correct}.`;
  if (tentativa < 20 && !_combDistintos(correctText, distractorTexts))
    return combComissaoRestricao(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Combinação",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Número de subconjuntos de um conjunto com n elementos ⇒ 2^n (variações: −1, −2).
function combSubconjuntos(dificuldade, tentativa = 0) {
  let n, correct, distractorTexts, enunciado, explicacao;
  if (dificuldade === "facil") {
    n = randInt(4, 6);
    correct = Math.pow(2, n);
    distractorTexts = [
      `${2 * n}`,
      `${n * n * n}`,
      `${Math.pow(2, n) - 1}`,
      `${Math.pow(2, n) - 2}`,
    ];
    enunciado = `De um cardápio com ${n} pratos diferentes, um cliente pode escolher qualquer quantidade de pratos, inclusive nenhum ou todos. De quantas maneiras diferentes ele pode fazer a sua escolha?`;
    explicacao = `Cada um dos ${n} pratos pode ser incluído ou não na escolha, o que dá 2 opções por prato. Total = 2^${n} = ${correct} (equivale ao número de subconjuntos de um conjunto com ${n} elementos).`;
  } else if (dificuldade === "medio") {
    n = randInt(3, 6);
    correct = Math.pow(2, n) - 1;
    distractorTexts = [
      `${Math.pow(2, n)}`,
      `${Math.pow(2, n) - 2}`,
      `${2 * n - 1}`,
      `${n * n * n - 1}`,
    ];
    enunciado = `Uma pessoa tem ${n} amigos e quer convidar pelo menos um deles para um jantar. De quantos modos diferentes ela pode formar o grupo de convidados?`;
    explicacao = `São 2^${n} = ${Math.pow(2, n)} subconjuntos possíveis do conjunto de ${n} amigos. Retirando o caso do grupo vazio (nenhum convidado): 2^${n} − 1 = ${correct}.`;
  } else {
    n = randInt(4, 6);
    correct = Math.pow(2, n) - 2;
    distractorTexts = [
      `${Math.pow(2, n) - 1}`,
      `${Math.pow(2, n)}`,
      `${n * n * n - 2}`,
      `${2 * n - 2}`,
    ];
    enunciado = `Um conjunto B possui ${n} elementos. Quantos subconjuntos de B são, ao mesmo tempo, não vazios e diferentes do próprio B?`;
    explicacao = `O conjunto B tem 2^${n} = ${Math.pow(2, n)} subconjuntos. Excluindo o conjunto vazio e o próprio B: 2^${n} − 2 = ${correct}.`;
  }
  const correctText = `${correct}`;
  if (tentativa < 20 && !_combDistintos(correctText, distractorTexts))
    return combSubconjuntos(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "analise-combinatoria",
    subtopico: "Combinação",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
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

// Helper local de Lógica: exige 5 textos de alternativa distintos e sem lixo.
function _logDistintos(correct, distractors) {
  const all = [String(correct), ...distractors.map((d) => String(d))];
  if (all.some((s) => s.includes("undefined") || s.includes("NaN"))) return false;
  return new Set(all).size === all.length;
}

// Sequência de 2ª ordem: as diferenças entre termos consecutivos formam uma PA
// (fácil/médio) ou a regra é do tipo Fibonacci (difícil). Pede o próximo termo.
function logSequenciaSegundaOrdem(dificuldade, tentativa = 0) {
  let seq, next, correctText, distractorTexts, enunciado, explicacao;
  if (dificuldade === "dificil") {
    const a = randInt(1, 6);
    const b = randInt(a + 1, a + 8);
    const t = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
    next = 3 * a + 5 * b; // t[3] + t[4]
    seq = t;
    correctText = `${next}`;
    distractorTexts = [
      `${3 * a + 4 * b}`, // repetiu a diferença do fim (t4 − t3) como se fosse constante
      `${4 * a + 6 * b}`, // dobrou o último termo
      `${2 * a + 4 * b}`, // somou o 5º termo ao 2º
      `${5 * a + 7 * b}`, // somou os cinco termos exibidos
    ];
    enunciado = `Em uma sequência numérica, cada termo, a partir do terceiro, é igual à soma dos dois termos imediatamente anteriores. Os cinco primeiros termos são ${seq.join(", ")}. Qual é o sexto termo dessa sequência?`;
    explicacao = `O sexto termo é a soma do quarto com o quinto termos: ${t[3]} + ${t[4]} = ${next}.`;
  } else {
    const a1 = dificuldade === "facil" ? randInt(1, 5) : randInt(3, 9);
    const d1 = dificuldade === "facil" ? randInt(1, 4) : randInt(2, 6);
    const e = dificuldade === "facil" ? randInt(1, 3) : randInt(2, 4);
    const t = [a1];
    for (let i = 0; i < 4; i++) t.push(t[i] + (d1 + i * e));
    next = t[4] + (d1 + 4 * e);
    seq = t;
    const difs = [];
    for (let i = 0; i < 4; i++) difs.push(d1 + i * e);
    correctText = `${next}`;
    distractorTexts = [
      `${t[4] + (d1 + 3 * e)}`, // repetiu a última diferença (diferença constante)
      `${t[4] + d1}`,           // usou a primeira diferença
      `${t[4] + (d1 + 5 * e)}`, // avançou duas diferenças de uma vez
      `${2 * t[4]}`,            // dobrou o último termo
    ];
    enunciado = dificuldade === "facil"
      ? `Observe o padrão de formação da sequência ${seq.join(", ")}. As diferenças entre termos consecutivos são ${difs.join(", ")}, ou seja, aumentam de ${e} em ${e}. Qual é o próximo termo?`
      : `Na sequência ${seq.join(", ")}, a diferença entre cada termo e o termo anterior cresce sempre ${e} unidade(s). Mantendo esse padrão, qual é o próximo termo?`;
    explicacao = `As diferenças entre termos consecutivos são ${difs.join(", ")} — uma PA de razão ${e}. A próxima diferença é ${d1 + 4 * e}, logo o próximo termo é ${t[4]} + ${d1 + 4 * e} = ${next}.`;
  }
  if (tentativa < 40 && !_logDistintos(correctText, distractorTexts))
    return logSequenciaSegundaOrdem(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Sequências e Padrões",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// "Pensei num número, apliquei operações, deu R" — desfazer na ordem inversa.
// Os parâmetros são escolhidos para que todo passo intermediário seja inteiro.
function logNumeroPensado(dificuldade, tentativa = 0) {
  const a = pick([2, 3, 4, 5]);
  const x = randInt(3, dificuldade === "facil" ? 12 : dificuldade === "medio" ? 20 : 30);
  let enunciado, resposta, correctText, distractorTexts, explicacao;
  if (dificuldade === "facil") {
    const b = randInt(2, 25);
    const resultado = a * x + b;
    resposta = (resultado - b) / a;
    correctText = `${resposta}`;
    distractorTexts = [
      `${resultado - b}`,       // esqueceu de dividir por a
      `${(resultado - b) * a}`, // multiplicou por a em vez de dividir
      `${resposta + b}`,        // dividiu certo, mas somou b de novo
      `${resultado}`,           // não desfez nenhuma operação
    ];
    enunciado = `Pensei em um número natural, multipliquei-o por ${a} e somei ${b} ao resultado, obtendo ${resultado}. Em que número pensei?`;
    explicacao = `Desfazendo as operações de trás para frente: ${resultado} − ${b} = ${resultado - b}; em seguida ${resultado - b} ÷ ${a} = ${resposta}.`;
  } else if (dificuldade === "medio") {
    const b = randInt(3, Math.min(20, a * x - 1));
    const resultado = a * x - b;
    resposta = (resultado + b) / a;
    correctText = `${resposta}`;
    distractorTexts = [
      `${resultado + b}`,       // esqueceu de dividir por a
      `${(resultado + b) * a}`, // multiplicou por a em vez de dividir
      `${resultado}`,           // não desfez nenhuma operação
      `${resultado - b}`,       // subtraiu b de novo em vez de somar
    ];
    enunciado = `Pensei em um número, multipliquei-o por ${a} e subtraí ${b} do resultado, chegando a ${resultado}. Qual é o número em que pensei?`;
    explicacao = `Desfazendo de trás para frente: ${resultado} + ${b} = ${resultado + b}; depois ${resultado + b} ÷ ${a} = ${resposta}.`;
  } else {
    const b = randInt(2, 12);
    const d = randInt(2, Math.min(15, a * (x + b) - 1));
    const R = a * (x + b) - d;
    resposta = (R + d) / a - b;
    correctText = `${resposta}`;
    distractorTexts = [
      `${(R + d) / a}`,     // esqueceu de subtrair b no fim
      `${R + d - b}`,       // esqueceu de dividir por a
      `${R + d}`,           // só desfez a subtração final
      `${(R + d) / a + b}`, // somou b em vez de subtrair no fim
    ];
    enunciado = `Pensei em um número, somei ${b} a ele, multipliquei o total por ${a} e, do produto, subtraí ${d}, chegando a ${R}. Qual é o número pensado?`;
    explicacao = `Desfazendo de trás para frente: ${R} + ${d} = ${R + d}; ${R + d} ÷ ${a} = ${(R + d) / a}; ${(R + d) / a} − ${b} = ${resposta}.`;
  }
  if (tentativa < 40 && !_logDistintos(correctText, distractorTexts))
    return logNumeroPensado(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Problemas de Raciocínio",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Torneio todos contra todos: 1 turno ⇒ C(n,2) = n(n−1)/2; turno e returno ⇒ n(n−1).
function logTorneio(dificuldade, tentativa = 0) {
  const esporte = pick(["futebol", "vôlei", "basquete", "handebol", "futsal"]);
  let n, correct, distr, enunciado, explicacao;
  if (dificuldade === "dificil") {
    n = randInt(7, 11);
    correct = n * (n - 1);
    distr = [n * (n - 1) / 2, n * (n + 1), 2 * (n - 1), n * n];
    enunciado = `Um campeonato de ${esporte} tem ${n} equipes e é disputado em turno e returno: cada equipe enfrenta cada uma das outras exatamente duas vezes. Quantas partidas serão disputadas no total?`;
    explicacao = `Em turno único haveria C(${n}, 2) = ${n}·${n - 1}/2 = ${n * (n - 1) / 2} partidas. Com turno e returno esse número dobra: ${correct}.`;
  } else {
    n = dificuldade === "facil" ? randInt(5, 7) : randInt(7, 10);
    correct = n * (n - 1) / 2;
    distr = [n * (n - 1), n * (n + 1) / 2, n - 1, n * n];
    enunciado = `Em um torneio de ${esporte} com ${n} equipes, cada equipe joga uma única vez contra cada uma das outras. Quantas partidas são disputadas ao todo?`;
    explicacao = `Cada partida corresponde a um par de equipes distintas: C(${n}, 2) = ${n}·${n - 1}/2 = ${correct}.`;
  }
  const correctText = `${correct}`;
  const distractorTexts = distr.map((v) => `${v}`);
  if (tentativa < 40 && !_logDistintos(correctText, distractorTexts))
    return logTorneio(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Problemas de Raciocínio",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Calendário: hoje é <dia>; daqui a N dias ⇒ dias[(hoje + N) mod 7].
function logCalendario(dificuldade, tentativa = 0) {
  const dias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  const eventos = [
    "a inauguração de uma loja",
    "a entrega de uma encomenda",
    "o início de um curso",
    "uma consulta médica",
    "a viagem de férias",
  ];
  const evento = pick(eventos);
  const hoje = randInt(0, 6);
  const N = dificuldade === "facil" ? randInt(10, 25) : dificuldade === "medio" ? randInt(40, 90) : randInt(150, 600);
  const r = (hoje + N) % 7;
  const correctText = dias[r];
  const distractorTexts = [
    dias[(r + 1) % 7],
    dias[(r + 6) % 7],
    dias[N % 7],
    dias[((hoje - N) % 7 + 7) % 7],
  ];
  const enunciado = `Hoje é ${dias[hoje]} e faltam exatamente ${N} dias para ${evento}. Em que dia da semana esse evento vai ocorrer?`;
  const explicacao = `Como os dias da semana se repetem em ciclos de 7, calcula-se o resto de ${N} por 7: ${N} = 7 · ${Math.floor(N / 7)} + ${N % 7}. Basta então avançar ${N % 7} dia(s) a partir de ${dias[hoje]}, chegando a ${dias[r]}.`;
  if (tentativa < 40 && !_logDistintos(correctText, distractorTexts))
    return logCalendario(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Problemas de Raciocínio",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Negação de proposições quantificadas / De Morgan — alternativas textuais.
function logNegacao(dificuldade) {
  let enunciado, correctText, distractorTexts, explicacao;
  if (dificuldade === "facil") {
    const c = pick([
      { pl: "os funcionários do setor", sg: "funcionário do setor", vP: "cumpriram a meta", v: "cumpriu a meta", vNeg: "não cumpriu a meta", vNegP: "não cumpriram a meta" },
      { pl: "as casas do condomínio", sg: "casa do condomínio", vP: "têm garagem", v: "tem garagem", vNeg: "não tem garagem", vNegP: "não têm garagem" },
      { pl: "os produtos do lote", sg: "produto do lote", vP: "passaram no teste de qualidade", v: "passou no teste de qualidade", vNeg: "não passou no teste de qualidade", vNegP: "não passaram no teste de qualidade" },
      { pl: "os candidatos inscritos", sg: "candidato inscrito", vP: "enviaram os documentos", v: "enviou os documentos", vNeg: "não enviou os documentos", vNegP: "não enviaram os documentos" },
    ]);
    enunciado = `Considere a afirmação: "Todos ${c.pl} ${c.vP}." Qual das alternativas é a negação correta dessa afirmação?`;
    correctText = `Pelo menos um ${c.sg} ${c.vNeg}.`;
    distractorTexts = [
      `Nenhum ${c.sg} ${c.v}.`,
      `Todos ${c.pl} ${c.vNegP}.`,
      `Pelo menos um ${c.sg} ${c.v}.`,
      `Nenhum ${c.sg} ${c.vNeg}.`,
    ];
    explicacao = `A negação de "todo A tem a propriedade P" é "existe pelo menos um A que não tem P". Um único contraexemplo já torna a afirmação original falsa — não é preciso que nenhum A tenha a propriedade.`;
  } else if (dificuldade === "medio") {
    const c = pick([
      { sg: "morador do bairro", pl: "os moradores do bairro", v: "usa transporte público", vP: "usam transporte público", vNeg: "não usa transporte público" },
      { sg: "aluno da turma", pl: "os alunos da turma", v: "foi à excursão", vP: "foram à excursão", vNeg: "não foi à excursão" },
      { sg: "loja do shopping", pl: "as lojas do shopping", v: "abre aos domingos", vP: "abrem aos domingos", vNeg: "não abre aos domingos" },
      { sg: "atleta da equipe", pl: "os atletas da equipe", v: "foi convocado", vP: "foram convocados", vNeg: "não foi convocado" },
    ]);
    enunciado = `Considere a afirmação: "Algum ${c.sg} ${c.v}." Qual das alternativas é a negação correta dessa afirmação?`;
    correctText = `Nenhum ${c.sg} ${c.v}.`;
    distractorTexts = [
      `Algum ${c.sg} ${c.vNeg}.`,
      `Todos ${c.pl} ${c.vP}.`,
      `Nem todos ${c.pl} ${c.vP}.`,
      `Existe exatamente um ${c.sg} que ${c.v}.`,
    ];
    explicacao = `"Algum A é B" afirma que existe ao menos um caso. Negá-la exige dizer que não existe nenhum: "nenhum A é B". Apenas negar o predicado ("algum A não é B") ou trocar por "todos" não nega a afirmação original.`;
  } else {
    const c = pick([
      { p: "O time venceu a partida", np: "O time não venceu a partida", q: "o técnico foi premiado", nq: "o técnico não foi premiado" },
      { p: "João foi aprovado no vestibular", np: "João não foi aprovado no vestibular", q: "ganhou a bolsa de estudos", nq: "não ganhou a bolsa de estudos" },
      { p: "A empresa aumentou o faturamento", np: "A empresa não aumentou o faturamento", q: "distribuiu bônus aos funcionários", nq: "não distribuiu bônus aos funcionários" },
    ]);
    enunciado = `Considere a afirmação: "${c.p} e ${c.q}." Qual das alternativas é a negação correta dessa afirmação?`;
    correctText = `${c.np} ou ${c.nq}.`;
    distractorTexts = [
      `${c.np} e ${c.nq}.`,
      `${c.p} ou ${c.q}.`,
      `${c.np} ou ${c.q}.`,
      `${c.p} ou ${c.nq}.`,
    ];
    explicacao = `Pela lei de De Morgan, a negação de "p e q" é "não p ou não q": basta que uma das duas partes falhe. Manter o conectivo "e" ao negar, ou negar apenas um dos termos, produz afirmações diferentes.`;
  }
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Proposições Lógicas",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Dada "se p, então q", identificar a contrapositiva "se ¬q, então ¬p".
function logCondicional(dificuldade) {
  const c = pick([
    { se: "chove", entao: "a rua fica molhada", naoSe: "não chove", naoEntao: "a rua não fica molhada", seCap: "Chove" },
    { se: "hoje é feriado", entao: "o banco não abre", naoSe: "hoje não é feriado", naoEntao: "o banco abre", seCap: "Hoje é feriado" },
    { se: "a lâmpada está acesa", entao: "há energia elétrica na casa", naoSe: "a lâmpada não está acesa", naoEntao: "não há energia elétrica na casa", seCap: "A lâmpada está acesa" },
    { se: "Maria está no Brasil", entao: "Maria está na América do Sul", naoSe: "Maria não está no Brasil", naoEntao: "Maria não está na América do Sul", seCap: "Maria está no Brasil" },
    { se: "o polígono é um quadrado", entao: "o polígono tem quatro lados", naoSe: "o polígono não é um quadrado", naoEntao: "o polígono não tem quatro lados", seCap: "O polígono é um quadrado" },
  ]);
  const prop = `Se ${c.se}, então ${c.entao}.`;
  const correctText = `Se ${c.naoEntao}, então ${c.naoSe}.`;
  const distractorTexts = [
    `Se ${c.entao}, então ${c.se}.`,       // recíproca
    `Se ${c.naoSe}, então ${c.naoEntao}.`, // inversa
    `Se ${c.se}, então ${c.entao}.`,       // a própria condicional
    `${c.seCap} e ${c.naoEntao}.`,         // p e não q
  ];
  let enunciado;
  if (dificuldade === "facil") {
    enunciado = `Considere a proposição condicional: "${prop}" Qual das alternativas é a sua contrapositiva (proposição logicamente equivalente)?`;
  } else if (dificuldade === "medio") {
    enunciado = `Uma proposição "se p, então q" é sempre equivalente à sua contrapositiva "se não q, então não p". Qual é a contrapositiva da proposição "${prop}"?`;
  } else {
    enunciado = `A contrapositiva de uma proposição condicional é obtida negando-se os dois termos e invertendo-se a ordem entre eles. Determine a contrapositiva de: "${prop}"`;
  }
  const explicacao = `A contrapositiva de "se p, então q" é "se não q, então não p", sempre equivalente à original: "${correctText}". A recíproca ("se q, então p") e a inversa ("se não p, então não q") não são equivalentes à condicional dada.`;
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Proposições Lógicas",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
  });
}

// Comparações transitivas: ordenar 4–5 nomes, ou achar quem ocupa a k-ésima posição.
function logComparacaoTransitiva(dificuldade, tentativa = 0) {
  const nomes = shuffle(["Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio", "Gabi", "Hugo"]);
  const ctx = pick([
    { ordem: "da maior para a menor idade", clausula: (a, b) => `${a} tem mais idade que ${b}` },
    { ordem: "da maior para a menor altura", clausula: (a, b) => `${a} tem mais altura que ${b}` },
    { ordem: "da maior para a menor nota", clausula: (a, b) => `${a} tirou uma nota maior que ${b}` },
  ]);
  const m = dificuldade === "facil" ? 4 : 5;
  const ordem = nomes.slice(0, m); // ordem[0] = primeiro colocado
  const pistas = shuffle(ordem.slice(0, m - 1).map((_, i) => ctx.clausula(ordem[i], ordem[i + 1])));
  let enunciado, correctText, distractorTexts, explicacao;
  if (dificuldade === "medio") {
    correctText = ordem[2];
    distractorTexts = [ordem[0], ordem[m - 1], ordem[1], ordem[3]];
    enunciado = `Em um grupo de ${m} pessoas, sabe-se que: ${pistas.join("; ")}. Colocando-as em ordem, ${ctx.ordem}, quem ocupa a 3ª posição?`;
    explicacao = `Encadeando as comparações: ${ordem.join(" > ")}. Na ordem ${ctx.ordem}, a 3ª posição é de ${ordem[2]}.`;
  } else {
    correctText = ordem.join(", ");
    distractorTexts = [
      [...ordem].reverse().join(", "),
      [ordem[1], ordem[0], ...ordem.slice(2)].join(", "),
      [...ordem.slice(0, m - 2), ordem[m - 1], ordem[m - 2]].join(", "),
      [...ordem.slice(1), ordem[0]].join(", "),
    ];
    enunciado = `${m} amigos foram comparados dois a dois. Sabe-se que: ${pistas.join("; ")}. Qual é a ordenação correta, ${ctx.ordem}?`;
    explicacao = `Encadeando todas as comparações, obtém-se: ${ordem.join(" > ")}. Essa é a ordem ${ctx.ordem}.`;
  }
  if (tentativa < 40 && !_logDistintos(correctText, distractorTexts))
    return logComparacaoTransitiva(dificuldade, tentativa + 1);
  return makeQuestao({
    categoriaId: "logica",
    subtopico: "Problemas de Raciocínio",
    dificuldade,
    enunciado,
    correctText,
    distractorTexts,
    explicacao,
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
  "funcao-afim": [afimTarifa, afimCoeficiente, afimRaiz, afimDepreciacao, afimConversaoTemperatura, afimComissao, afimPontoEquilibrio, afimValorPrevisto],
  "funcao-quadratica": [quadVertice, quadTrajetoria, quadLucroMaximo, quadRaizesContexto, quadSomaProdutoRaizes, quadAreaCercado, quadDoisNumeros, quadAlcanceProjetil, quadAlturaNoInstante, quadVerticeCoordenadas, quadArcoParabolico, quadCustoMinimo],
  "exponenciais-logaritmos": [expCrescimento, expMeiaVida],
  progressoes: [progPA, progPG],
  "geometria-plana": [geoAreaPerimetro, geoPitagoras],
  "geometria-espacial": [geoVolumePrisma, geoVolumeCilindro, geoVolumeCone, geoVolumePiramide, geoEsfera, geoPlanificacaoCaixa],
  "geometria-analitica": [geoDistanciaPontos, geoEquacaoReta, gaPontoMedio, gaDistanciaOrigem, gaCoefAngularDoisPontos, gaEquacaoRetaPorDoisPontos, gaParalelaPerpendicular, gaInterseccaoRetas, gaCircunferenciaCentroRaio, gaCircunferenciaGeralParaReduzida, gaPontoNaCircunferencia, gaAreaTrianguloVertices, gaAlinhamento, gaSimetrico, gaBaricentro],
  trigonometria: [trigTrianguloRetangulo, trigRampa, trigSombra, trigEscada, trigLeiSenos, trigLeiCossenos],
  estatistica: [estMedia, estMediana, estLeituraGraficoDiferenca, estLeituraGraficoTotal, estLeituraGraficoPercentual],
  probabilidade: [probSimples, probSucessiva, probComReposicao, probComplementar, probUniaoExclusiva, probDoisDados, probBaralho, probTabelaContingencia],
  "analise-combinatoria": [combMultiplicativo, combComissao, combPermutacaoSimples, combPermutacaoCircular, combArranjo, combComRepeticao, combAnagramas, combComissaoRestricao, combSubconjuntos],
  "matematica-financeira": [finJurosCompostos],
  matrizes: [matDeterminante, matDeterminante3x3, matSoma, matSubtracao, matEscalar, matProduto, matTransposta, matTraco, matIgualdade, matLeiDeFormacao, matSimetrica, matPotencia, matInversa, matDeterminanteComIncognita, matCramer, matFaturamento, matIdentidadePropriedade],
  logica: [logSequencia, logRaciocinioIdade, logSequenciaSegundaOrdem, logNumeroPensado, logTorneio, logCalendario, logNegacao, logCondicional, logComparacaoTransitiva],
  conjuntos: [conjDoisConjuntos, conjDiferenca, conjUniaoDeInterseccao, conjComplementar, conjTresConjuntos, conjTresConjuntosEsporte, conjOperacoesExplicitas, conjDiferencaSimetrica, conjProdutoCartesiano, conjSubconjuntos, conjIntervalosReais, conjMultiplos, conjTresLinguas, conjPesquisaProduto, conjDivisores],
};
