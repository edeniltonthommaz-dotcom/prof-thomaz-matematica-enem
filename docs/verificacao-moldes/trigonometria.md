# Verificação manual — 5 moldes novos de "Trigonometria"

Task 13a / Fase 8 (parte 1) do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/trigonometria.json` por `node scripts/generate.mjs`
(ids `trigonometria-ined-0128` … `-0140`). Para cada uma: enunciado como ficou
no arquivo, resolução independente usando **os mesmos valores aproximados da
tabela `ANGULOS`** e o **mesmo arredondamento do gerador** (`Math.round`), e a
alternativa que o gerador marcou `correta`. Devem concordar.

Tabela `ANGULOS` (valores APROXIMADOS, usados verbatim):

| ° | sen | cos | tg |
|---|-----|-----|-----|
| 30 | 0,5 | 0,87 | 0,58 |
| 37 | 0,6 | 0,8 | 0,75 |
| 45 | 0,71 | 0,71 | 1 |
| 53 | 0,8 | 0,6 | 1,33 |
| 60 | 0,87 | 0,5 | 1,73 |

`TEMPLATES["trigonometria"]` = `[trigTrianguloRetangulo, trigRampa, trigSombra,
trigEscada, trigLeiSenos, trigLeiCossenos]` → 6 moldes × teto 3 = 18; `need` =
50 − realLike 34 = **16**, então `trigTrianguloRetangulo`, `trigRampa`,
`trigSombra`, `trigEscada` e `trigLeiSenos` emitem as 3 dificuldades (15
questões) e o 6º (`trigLeiCossenos`) emite só a fácil (1 questão).
`trigonometria` fecha em **total 50** (real 4 + banco 30 + inéditas 16).
`_resumo.json`:
`{"categoriaId":"trigonometria","real":4,"banco":30,"realLike":34,"inedita":16,"total":50}`.

**Resultado: 13/13 questões novas gravadas conferidas — a resolução independente
com a aritmética arredondada da tabela bate com a alternativa `correta` do
gerador em todas.** `node scripts/validate-all.mjs` sai 0 (1127 questões, 1127
enunciados únicos, 0 erros); nenhuma estrutura repete mais de 3×; 5 alternativas
distintas por questão, sem placeholder.

## Molde pré-existente (contexto) — `trigTrianguloRetangulo`

| id | Molde / dif | Cálculo | Gerador |
|----|-------------|---------|---------|
| 0125–0127 | `trigTrianguloRetangulo` | `Math.round(cateto · tg θ)` | inalterados |

## 1 — `trigRampa` → "Triângulo Retângulo"

Rampa reta (hipotenusa). Fácil/médio: altura vencida = `round(c · sen θ)`.
Difícil (modo distinto): dado o desnível `h`, comprimento da rampa =
`round(h / sen θ)`.
Distratores fácil/médio: `c` (confundiu hipotenusa com altura), `round(c·cos θ)`
(usou cosseno), `round(c·tg θ)` (usou tangente), `round(c / sen θ)` (dividiu em
vez de multiplicar).
Distratores difícil: `h` (usou o desnível como comprimento), `round(h·sen θ)`
(multiplicou), `round(h / tg θ)` (usou tangente), `round(h / cos θ)` (usou cosseno).

| id | dif | dados | Resolução | Gerador |
|----|-----|-------|-----------|---------|
| 0128 | facil | c=8, θ=60° | round(8·0,87) = round(6,96) = **7** | C) 7 m ✓ |
| 0129 | medio | c=18, θ=53° | round(18·0,8) = round(14,4) = **14** | B) 14 m ✓ |
| 0130 | dificil | h=25, θ=37° | round(25 / 0,6) = round(41,67) = **42** | A) 42 m ✓ |

Distratores conferidos:
- 0128: 8 / round(8·0,87→ isso é a resposta; cos: round(8·0,5)=4) / round(8·1,73)=14 / round(8/0,87)=9 → {8,4,14,9} distintos da resposta 7.
- 0129: 18 / round(18·0,6)=11 / round(18·1,33)=24 / round(18/0,8)=23 → {18,11,24,23}.
- 0130: 25 / round(25·0,6)=15 / round(25/0,75)=33 / round(25/0,8)=31 → {25,15,33,31}.

## 2 — `trigSombra` → "Triângulo Retângulo"

Fácil/médio: poste de altura `h`, sol a `θ` de elevação, sombra = `round(h / tg θ)`.
Difícil (modo distinto): dada a sombra `s`, altura = `round(s · tg θ)`.
Distratores fácil/médio: `round(h·tg θ)` (multiplicou em vez de dividir), `h`
(repetiu a altura), `round(h / sen θ)` (usou seno), `round(h / cos θ)` (usou cosseno).
Distratores difícil: `round(s / tg θ)` (dividiu em vez de multiplicar), `s`
(repetiu a sombra), `round(s·sen θ)` (usou seno), `round(s·cos θ)` (usou cosseno).

| id | dif | dados | Resolução | Gerador |
|----|-----|-------|-----------|---------|
| 0131 | facil | h=15, θ=30° | round(15 / 0,58) = round(25,86) = **26** | C) 26 m ✓ |
| 0132 | medio | h=20, θ=53° | round(20 / 1,33) = round(15,04) = **15** | A) 15 m ✓ |
| 0133 | dificil | s=25, θ=53° | round(25 · 1,33) = round(33,25) = **33** | B) 33 m ✓ |

Distratores conferidos:
- 0131: round(15·0,58)=9 / 15 / round(15/0,5)=30 / round(15/0,87)=17 → {9,15,30,17}.
- 0132: round(20·1,33)=27 / 20 / round(20/0,8)=25 / round(20/0,6)=33 → {27,20,25,33}.
- 0133: round(25/1,33)=19 / 25 / round(25·0,8)=20 / round(25·0,6)=15 → {19,25,20,15}.

## 3 — `trigEscada` → "Triângulo Retângulo"

Fácil/médio: escada de `L` m a `θ` com o chão, altura alcançada = `round(L · sen θ)`.
Difícil (modo distinto, já previsto pelo molde): distância do pé à parede =
`round(L · cos θ)`.
Distratores fácil/médio: `L` (comprimento da escada), `round(L·cos θ)` (dá a
distância à parede), `round(L·tg θ)` (usou tangente), `round(L / sen θ)` (dividiu).
Distratores difícil: `L`, `round(L·sen θ)` (dá a altura), `round(L·tg θ)`,
`round(L / cos θ)` (dividiu).

| id | dif | dados | Resolução | Gerador |
|----|-----|-------|-----------|---------|
| 0134 | facil | L=10, θ=60° | round(10·0,87) = round(8,7) = **9** | E) 9 m ✓ |
| 0135 | medio | L=24, θ=53° | round(24·0,8) = round(19,2) = **19** | D) 19 m ✓ |
| 0136 | dificil | L=24, θ=30° | round(24·0,87) = round(20,88) = **21** | E) 21 m ✓ |

Distratores conferidos:
- 0134: 10 / round(10·0,5)=5 / round(10·1,73)=17 / round(10/0,87)=11 → {10,5,17,11}.
- 0135: 24 / round(24·0,6)=14 / round(24·1,33)=32 / round(24/0,8)=30 → {24,14,32,30}.
- 0136: 24 / round(24·0,5)=12 / round(24·0,58)=14 / round(24/0,87)=28 → {24,12,14,28}.

## 4 — `trigLeiSenos` → "Lei dos Senos"

Triângulo com ângulos A, B e lado `a` oposto a A. `b = round(a · sen B / sen A)`.
As 3 dificuldades usam a mesma fórmula, com narrativas distintas (triângulo ABC
genérico / terreno triangular / triangulação de ponto inacessível).
Distratores: `round(a·sen A / sen B)` (inverteu a razão dos senos),
`round(a·sen B)` (esqueceu de dividir por sen A), `a` (repetiu o lado dado),
`round(a·sen A·sen B)` (multiplicou os senos em vez de dividir).

| id | dif | dados | Resolução | Gerador |
|----|-----|-------|-----------|---------|
| 0137 | facil | A=60°, B=30°, a=20 | round(20·0,5 / 0,87) = round(11,49) = **11** | D) 11 m ✓ |
| 0138 | medio | A=60°, B=37°, a=36 | round(36·0,6 / 0,87) = round(24,83) = **25** | B) 25 m ✓ |
| 0139 | dificil | A=60°, B=37°, a=24 | round(24·0,6 / 0,87) = round(16,55) = **17** | C) 17 m ✓ |

Distratores conferidos:
- 0137: round(20·0,87/0,5)=35 / round(20·0,5)=10 / 20 / round(20·0,87·0,5)=round(8,7)=9 → {35,10,20,9}.
- 0138: round(36·0,87/0,6)=round(52,2)=52 / round(36·0,6)=round(21,6)=22 / 36 / round(36·0,87·0,6)=round(18,79)=19 → {52,22,36,19}.
- 0139: round(24·0,87/0,6)=round(34,8)=35 / round(24·0,6)=round(14,4)=14 / 24 / round(24·0,87·0,6)=round(12,53)=13 → {35,14,24,13}.

## 5 — `trigLeiCossenos` → "Lei dos Cossenos"

Lados `b`, `c` e ângulo A entre eles. `a = round(√(b² + c² − 2·b·c·cos A))`.
Fácil usa sempre A=60° (cos 0,5 ⇒ a² = b² + c² − b·c). Só a fácil é gravada na
config atual; médio/difícil (com os demais ângulos e escala k) permanecem
implementados e protegidos pelo mesmo guard de colisão.
Distratores: `round(√(b²+c²))` (esqueceu o −2·b·c·cos A / usou Pitágoras),
`round(√(b²+c²+2·b·c·cos A))` (trocou o sinal do termo), `b+c` (somou os lados),
`round(√|b²+c²−2·b·c·sen A|)` (usou seno no lugar do cosseno).

| id | dif | dados | Resolução | Gerador |
|----|-----|-------|-----------|---------|
| 0140 | facil | b=9, c=5, A=60° | 81 + 25 − 2·9·5·0,5 = 61; round(√61) = round(7,81) = **8** | C) 8 m ✓ |

Distratores conferidos (0140):
- round(√(81+25)) = round(√106) = round(10,30) = 10
- round(√(106+45)) = round(√151) = round(12,29) = 12
- b+c = 14
- round(√|106 − 2·9·5·0,87|) = round(√|106 − 78,3|) = round(√27,7) = round(5,26) = 5
→ {10,12,14,5} todos distintos da resposta 8.

## Guard de colisão

Todos os 5 moldes têm o mesmo guard usado em `probComReposicao` / `matCramer`:
`if (new Set([correctText, ...distractorTexts]).size < 5 && tentativa < 40)
return <molde>(dificuldade, tentativa + 1);`. Como a tabela só tem 5 ângulos e o
arredondamento pode fazer dois distratores caírem no mesmo inteiro (ex.: 37° tem
cos 0,8 ≈ tg 0,75; 53° tem tg 1,33 ≈ 1/sen), o guard re-sorteia até separar os 5
valores. As listas de ângulos/medidas foram escolhidas para que a primeira
tentativa quase sempre já dê 5 valores distintos (fácil usa só 30°/60°, que não
colidem).

## Determinismo

`node scripts/generate.mjs` duas vezes → `trigonometria.json` byte-idêntico.
`git status` após a 2ª geração: mudam apenas `scripts/templates.mjs`,
`src/data/questions/_resumo.json`, `trigonometria.json` (categoria 13) e as
categorias 14–20 (`estatistica`, `probabilidade`, `analise-combinatoria`,
`matematica-financeira`, `matrizes`, `logica`, `conjuntos`) — nenhuma categoria
antes de `trigonometria` muda. `node --test scripts/rng.test.mjs` → 5/5 (duas
execuções). `npm run build` compila.
