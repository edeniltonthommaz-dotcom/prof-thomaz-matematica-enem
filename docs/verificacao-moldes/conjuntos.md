# Verificação manual — 13 moldes de "Conjuntos"

Task 8 / Fase 3 do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/conjuntos.json` pelo pipeline `node scripts/generate.mjs`
(ids `conjuntos-ined-0124` … `-0162`). Para cada uma: enunciado como ficou no
arquivo, resolução independente com a aritmética, e a letra + texto que o gerador
marcou `correta`. Devem concordar.

**Resultado: 39/39 questões gravadas conferidas (13 moldes × facil/medio/dificil) —
a resolução independente bate com a alternativa `correta` do gerador em todas.**
Todas as 45 questões de `conjuntos.json` têm 5 alternativas distintas, sem placeholder
e sem "nudge" numérico (verificado por script).

| id | Molde / dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-------------|--------------------------|------------------------|---------|
| 0124 | `conjUniaoDeInterseccao` facil | \|A\|=24, \|B\|=18, \|A∩B\|=14, achar \|A∪B\| | 24+18−14 = **28** | B) 28 ✓ |
| 0125 | " medio | \|A\|=23, \|B\|=30, \|A∪B\|=40, achar \|A∩B\| | 23+30−40 = **13** | B) 13 ✓ |
| 0126 | " dificil | \|A∪B\|=34, \|A∩B\|=9, \|A\|=16, achar \|B\| | 34−16+9 = **27** | D) 27 ✓ |
| 0127 | `conjComplementar` facil | 57 moradores, 15 com vaga, achar sem vaga | 57−15 = **42** | B) 42 ✓ |
| 0128 | " medio | 74 funcionários, 20 não aderiram, achar quantos aderiram | 74−20 = **54** | C) 54 ✓ |
| 0129 | " dificil | 126 estudantes, grupos disjuntos de 30 e 31, achar fora dos dois | 126−30−31 = **65** | B) 65 ✓ |
| 0130 | `conjTresConjuntos` facil | \|A\|=27, \|A∩B\|=9, \|A∩C\|=9, centro=4, achar só A | 27−9−9+4 = **13** | E) 13 ✓ |
| 0131 | " medio | regiões 10,15,14,6,4,4; união 55; achar centro | 55−(10+15+14+6+4+4) = 55−53 = **2** | D) 2 ✓ |
| 0132 | " dificil | \|A\|=24,\|B\|=23,\|C\|=28; pares 6,9,8; centro 2; achar união | (24+23+28)−(6+9+8)+2 = 75−23+2 = **54** | D) 54 ✓ |
| 0133 | `conjTresConjuntosEsporte` facil | 36 surfe, 14 tb skate, 14 tb vôlei de praia, 5 os três; só surfe | 36−14−14+5 = **13** | A) 13 ✓ |
| 0134 | " medio | pares 8,8,12; três=3; exatamente dois | (8−3)+(8−3)+(12−3) = **19** | E) 19 ✓ |
| 0135 | " dificil | 78 total, 5 nenhum → 73 união; 6 regiões somam 69; os três | 73−69 = **4** | A) 4 ✓ |
| 0136 | `conjOperacoesExplicitas` facil | A={12,16,18,19}, B={4,10,12,17,18}, \|A∩B\| | comuns {12,18} → **2** | C) 2 ✓ |
| 0137 | " medio | A={6,9,11,15,19}, B={1,9,12,13,14,15}, \|A∪B\| | comuns {9,15}=2 → 5+6−2 = **9** | C) 9 ✓ |
| 0138 | " dificil | A (8 elem.), B (9 elem.), \|A−B\| | comuns {2,3,7,9,19}=5 → 8−5 = **3** | B) 3 ✓ |
| 0139 | `conjDiferencaSimetrica` facil | A={1,2,8,9,15,19}, B={4,8,9,10,19}, \|A△B\| | comuns {8,9,19}=3 → (6−3)+(5−3) = 3+2 = **5** | A) 5 ✓ |
| 0140 | " medio | A (8 elem.), B (7 elem.), \|A△B\| | comuns {3,5,7,8}=4 → 4+3 = **7** | B) 7 ✓ |
| 0141 | " dificil | A={3,7,11,12,13,15}, B={5,6,7,9,11,12,15,19}, \|A△B\| | comuns {7,11,12,15}=4 → 2+4 = **6** | B) 6 ✓ |
| 0142 | `conjProdutoCartesiano` facil | \|A\|=4, \|B\|=6, \|A×B\| | 4·6 = **24** | A) 24 ✓ |
| 0143 | " medio | A={3,4,6,10,16} (5), \|B\|=8, \|A×B\| | 5·8 = **40** | D) 40 ✓ |
| 0144 | " dificil | \|A×B\|=48, \|A\|=8, achar \|B\| | 48÷8 = **6** | A) 6 ✓ |
| 0145 | `conjSubconjuntos` facil | n=5, total de subconjuntos | 2⁵ = **32** | E) 32 ✓ |
| 0146 | " medio | n=6, subconjuntos próprios | 2⁶−1 = **63** | C) 63 ✓ |
| 0147 | " dificil | n=5, subconjuntos ≠ ∅ e ≠ próprio | 2⁵−2 = **30** | D) 30 ✓ |
| 0148 | `conjIntervalosReais` facil | [−4,0] ∩ [−3,12] | **[−3, 0]** | E) [-3, 0] ✓ |
| 0149 | " medio | [−1,12] ∪ [6,13] | **[−1, 13]** | C) [-1, 13] ✓ |
| 0150 | " dificil | [−3,6] ∩ [3,4] (B ⊂ A) | **[3, 4]** | E) [3, 4] ✓ |
| 0151 | `conjMultiplos` facil | N=60, múltiplos de 5 ou 6 | ⌊60/5⌋+⌊60/6⌋−⌊60/30⌋ = 12+10−2 = **20** | E) 20 ✓ |
| 0152 | " medio | N=130, múltiplos de 5 ou 4 | 26+32−⌊130/20⌋ = 26+32−6 = **52** | A) 52 ✓ |
| 0153 | " dificil | N=260, múltiplos de 5 ou 4 | 52+65−⌊260/20⌋ = 52+65−13 = **104** | B) 104 ✓ |
| 0154 | `conjTresLinguas` facil | turma 78, 7 regiões somam 65, achar nenhuma | 78−65 = **13** | D) 13 ✓ |
| 0155 | " medio | pares 10,7,9; três=3; exatamente dois | (10−3)+(7−3)+(9−3) = **17** | D) 17 ✓ |
| 0156 | " dificil | escola 99, 7 nenhum → 92 união; 6 regiões somam 88; os três | 92−88 = **4** | D) 4 ✓ |
| 0157 | `conjPesquisaProduto` facil | 55 total, nenhum 11, dois 15, três 4; exatamente um | 55−11−15−4 = **25** | B) 25 ✓ |
| 0158 | " medio | 59 total, nenhum 7, dois 16, três 4; exatamente um | 59−7−16−4 = **32** | B) 32 ✓ |
| 0159 | " dificil | 56 total, nenhum 14, dois 16, três 9; exatamente um | 56−14−16−9 = **17** | A) 17 ✓ |
| 0160 | `conjDivisores` facil | D(108), quantos divisores | 108 = 2²·3³ → (2+1)(3+1) = **12** | C) 12 ✓ |
| 0161 | " medio | D(28), quantos pares | 28 = 2²·7 → {1,2,4,7,14,28}, pares {2,4,14,28} = **4** | D) 4 ✓ |
| 0162 | " dificil | \|D(116) ∩ D(24)\| | = \|D(mdc(116,24))\| = \|D(4)\| = {1,2,4} → **3** | E) 3 ✓ |

## Distratores

Todos calculados em código como erros clássicos, distintos entre si e da resposta
(guarda `_conjOk` + recursão `tentativa < 40` quando algum colide). Exemplos:

- União/interseção: esquecer de subtrair a interseção (`|A|+|B|`), subtrair duas vezes,
  responder o total geral.
- Complementar (dois grupos disjuntos): subtrair só um grupo (`u−x1` / `u−x2`),
  responder a soma dos grupos (`x1+x2`), responder a diferença entre eles (`|x1−x2|`).
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
  Só `conjuntos.json` (e, na 1ª corrida, `_resumo.json`) muda — categoria é a última
  do PRNG semeado.
- `node scripts/validate-all.mjs` → `974 questões, 974 enunciados únicos, 0 erros` (exit 0).
- `node --test scripts/rng.test.mjs` → 5/5 (inclui idempotência); rodado 2×, `git status`
  estável após o 2º `generate`.
- `npm run build` → `✓ Compiled successfully`.

## Total real alcançado

**49** (4 realLike + 45 inéditas = 15 moldes × 3 dificuldades, sem dedupe). Abaixo de
50 por 1, dentro da faixa permitida pela decisão do controlador. Um 14º molde não foi
adicionado: a diferença é de apenas 1 questão e as 13 estruturas já cobrem os casos
distintos do catálogo da spec §6.
