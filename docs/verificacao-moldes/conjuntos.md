# Verificação manual — 13 moldes de "Conjuntos"

Task 8 / Fase 3 do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: `resetRng()` e depois `fn(dificuldade)` para cada dificuldade (RNG semeado,
primeira instância de cada), resolução independente sem olhar o gabarito, comparação
com a letra que o gerador marcou `correta` e com o texto dessa alternativa.

**Resultado: 39/39 instâncias conferidas (13 moldes × facil/medio/dificil) — a
aritmética resolvida à mão bate com a alternativa `correta` do gerador em todas.**

| Molde | subtópico | Instância verificada | Resolução independente | Gerador |
|-------|-----------|----------------------|------------------------|---------|
| `conjUniaoDeInterseccao` | União e Interseção | facil: \|A\|=20, \|B\|=24, \|A∩B\|=6, achar \|A∪B\| | 20+24−6 = **38** | A) 38 ✓ |
| " | " | medio: \|A\|=20, \|B\|=24, \|A∪B\|=38, achar \|A∩B\| | 20+24−38 = **6** | A) 6 ✓ |
| " | " | dificil: \|A∪B\|=38, \|A∩B\|=6, \|A\|=20, achar \|B\| | 38−20+6 = **24** | A) 24 ✓ |
| `conjComplementar` | União e Interseção | facil: 59 moradores, 28 com vaga, achar sem vaga | 59−28 = **31** | D) 31 ✓ |
| " | " | medio: 89 total, 42 não possuem, achar quantos possuem | 89−42 = **47** | D) 47 ✓ |
| " | " | dificil: 138 sócios, grupos disjuntos de 26 e 27, achar fora dos dois | 138−26−27 = **85** | A) 85 ✓ |
| `conjTresConjuntos` | Diagramas de Venn | facil: \|A\|=23, \|A∩B\|=7, \|A∩C\|=7, centro=2, achar só A | 23−7−7+2 = **11** | B) 11 ✓ |
| " | " | medio: regiões 11,10,13,5,5,4; união 50; achar centro | 50−(11+10+13+5+5+4)=50−48 = **2** | B) 2 ✓ |
| " | " | dificil: \|A\|=29,\|B\|=27,\|C\|=26; pares 11,11,7; centro 3; achar união | 82−29+3 = **56** | A) 56 ✓ |
| `conjTresConjuntosEsporte` | Diagramas de Venn | facil: 33 praticam xadrez, 9 tb damas, 9 tb gamão, 4 os três; só xadrez | 33−9−9+4 = **19** | B) 19 ✓ |
| " | " | medio: pares 6,12,7; três=3; exatamente dois | (6−3)+(12−3)+(7−3) = **16** | A) 16 ✓ |
| " | " | dificil: 88 total, 9 nenhum, 6 regiões somam 76; os três | (88−9)−76 = 79−76 = **3** | E) 3 ✓ |
| `conjOperacoesExplicitas` | União e Interseção | facil: A={1,2,5,11,15}, B={2,3,5,10}, \|A∩B\| | {2,5} → **2** | C) 2 ✓ |
| " | " | medio: A(5), B(7), comuns {1,2,15}=3, \|A∪B\| | 5+7−3 = **9** | B) 9 ✓ |
| " | " | dificil: A={5,8,11,12,16}, B={6,8,12,15,18,20}, \|A−B\| | comuns {8,12}=2 → 5−2 = **3** | C) 3 ✓ |
| `conjDiferencaSimetrica` | União e Interseção | facil: A(5), B(4), comuns {6,17}=2, \|A△B\| | 3+2 = **5** | D) 5 ✓ |
| " | " | medio: A(6), B(7), comuns {1,2,7}=3, \|A△B\| | 3+4 = **7** | B) 7 ✓ |
| " | " | dificil: A(6), B(5), comuns {1,11}=2, \|A△B\| | 4+3 = **7** | A) 7 ✓ |
| `conjProdutoCartesiano` | União e Interseção | facil: \|A\|=8, \|B\|=3, \|A×B\| | 8·3 = **24** | C) 24 ✓ |
| " | " | medio: A com 7 elementos, \|B\|=6, \|A×B\| | 7·6 = **42** | C) 42 ✓ |
| " | " | dificil: \|A×B\|=72, \|A\|=9, achar \|B\| | 72÷9 = **8** | D) 8 ✓ |
| `conjSubconjuntos` | União e Interseção | facil: n=6, total de subconjuntos | 2⁶ = **64** | A) 64 ✓ |
| " | " | medio: n=7, subconjuntos próprios | 2⁷−1 = **127** | E) 127 ✓ |
| " | " | dificil: n=5, subconjuntos ≠ ∅ e ≠ próprio | 2⁵−2 = **30** | C) 30 ✓ |
| `conjIntervalosReais` | União e Interseção | facil: [−4,3] ∩ [1,10] | **[1, 3]** | E) [1, 3] ✓ |
| " | " | medio: [−2,6] ∪ [3,13] | **[−2, 13]** | A) [-2, 13] ✓ |
| " | " | dificil: [−1,12] ∩ [0,8] (B ⊂ A) | **[0, 8]** | C) [0, 8] ✓ |
| `conjMultiplos` | União e Interseção | facil: N=130, múltiplos de 6 ou 3 | ⌊130/6⌋+⌊130/3⌋−⌊130/6⌋ = 21+43−21 = **43** | C) 43 ✓ |
| " | " | medio: N=220, múltiplos de 4 ou 9 | 55+24−⌊220/36⌋ = 55+24−6 = **73** | D) 73 ✓ |
| " | " | dificil: N=140, múltiplos de 3 ou 7 | 46+20−⌊140/21⌋ = 46+20−6 = **60** | C) 60 ✓ |
| `conjTresLinguas` | Diagramas de Venn | facil: turma 81, 7 regiões somam 77, achar nenhuma | 81−77 = **4** | A) 4 ✓ |
| " | " | medio: pares 7,9,8; três=4; exatamente dois | (7−4)+(9−4)+(8−4) = **12** | C) 12 ✓ |
| " | " | dificil: escola 80, 6 nenhum, 6 regiões somam 68; os três | (80−6)−68 = 74−68 = **6** | D) 6 ✓ |
| `conjPesquisaProduto` | Problemas de Pesquisa | facil: 67 total, nenhum 14, dois 19, três 8; exatamente um | 67−14−19−8 = **26** | A) 26 ✓ |
| " | " | medio: 65 total, nenhum 8, dois 19, três 4; exatamente um | 65−8−19−4 = **34** | E) 34 ✓ |
| " | " | dificil: 41 total, nenhum 7, dois 14, três 3; exatamente um | 41−7−14−3 = **17** | B) 17 ✓ |
| `conjDivisores` | Problemas de Pesquisa | facil: D(108), quantos divisores | 108 = 2²·3³ → (2+1)(3+1) = **12** | B) 12 ✓ |
| " | " | medio: D(96), quantos pares | 96 = 2⁵·3 → 12 total − 2 ímpares (1,3) = **10** | C) 10 ✓ |
| " | " | dificil: \|D(63) ∩ D(90)\| | = \|D(mdc(63,90))\| = \|D(9)\| = {1,3,9} → **3** | D) 3 ✓ |

## Distratores

Todos calculados em código como erros clássicos, distintos entre si e da resposta
(guarda `_conjOk` + recursão com `tentativa` quando algum colide). Exemplos:

- União/interseção: esquecer de subtrair a interseção (`|A|+|B|`), subtrair duas vezes,
  responder o total geral.
- 3 conjuntos: não somar de volta o centro na contagem de "só A"; somar as regiões
  erradas; inclusão-exclusão sem o `+|A∩B∩C|`.
- Produto cartesiano: `|A|+|B|` em vez de `|A|·|B|`, `|A|²`, `2|A||B|`.
- Subconjuntos: `n²`, `2n`, `n!` no lugar de `2ⁿ`; `2ⁿ−1` vs `2ⁿ−2`.
- Múltiplos: `⌊N/p⌋+⌊N/q⌋` sem a correção do mmc; somar o mmc em vez de subtrair;
  contar o complemento.
- Intervalos: trocar interseção por união, inverter os extremos, intervalo aberto.
- Divisores: contar `d(n)` ou `d(m)` em vez de `d(mdc(n,m))`; devolver o próprio mdc.

## Gate

- `node scripts/generate.mjs` → `conjuntos: +45 inéditas (realLike 4, total 49)`.
  Só `conjuntos.json` e `_resumo.json` mudam (categoria é a última do PRNG semeado).
- `node scripts/validate-all.mjs` → `974 questões, 974 enunciados únicos, 0 erros` (exit 0).
- `node --test scripts/rng.test.mjs` → 5/5 (inclui idempotência); rodado 2×, `git status`
  estável após o 2º `generate`.
- `npm run build` → `✓ Compiled successfully`.

## Total real alcançado

**49** (4 realLike + 45 inéditas = 15 moldes × 3 dificuldades, sem dedupe). Abaixo de
50 por 1, dentro da faixa 35–45+ permitida pela decisão do controlador. Um 14º molde
não foi adicionado: a diferença é de apenas 1 questão e as 13 estruturas já cobrem os
casos distintos do catálogo da spec §6.
