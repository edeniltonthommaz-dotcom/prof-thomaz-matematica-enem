# Verificação manual — 6 moldes novos de "Probabilidade"

Task 12b / Fase 7 (parte 2) do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/probabilidade.json` por `node scripts/generate.mjs`
(ids `probabilidade-ined-0140` … `-0156`). Para cada uma: enunciado como ficou
no arquivo, resolução independente com a aritmética das frações, e a alternativa
que o gerador marcou `correta`. Devem concordar.

`TEMPLATES["probabilidade"]` = `[probSimples, probSucessiva, probComReposicao,
probComplementar, probUniaoExclusiva, probDoisDados, probBaralho,
probTabelaContingencia]` → 8 moldes × teto 3 = 24; `need` = 50 − realLike 27 =
**23**, então os 7 primeiros moldes emitem as 3 dificuldades e o 8º
(`probTabelaContingencia`) emite só fácil + médio. `probabilidade` fecha em
**total 50** (real 11 + banco 16 + inéditas 23). `_resumo.json`:
`{"categoriaId":"probabilidade","real":11,"banco":16,"realLike":27,"inedita":23,"total":50}`.

**Resultado: 17/17 questões gravadas conferidas — a resolução independente bate
com a alternativa `correta` do gerador em todas.** `node scripts/validate-all.mjs`
sai 0 (1114 questões, 1114 enunciados únicos, 0 erros); nenhuma estrutura repete
mais de 3×; 5 alternativas distintas por questão, sem placeholder.

## Moldes pré-existentes (contexto) — `probSimples`, `probSucessiva`

| id | Molde / dif | Cálculo | Gerador |
|----|-------------|---------|---------|
| 0134–0136 | `probSimples` | favoráveis / total, simplificado | inalterados |
| 0137–0139 | `probSucessiva` | sem reposição: (a/t)·((a−1)/(t−1)) | inalterados |

## 1 — `probComReposicao` → "Eventos Sucessivos"

2 retiradas COM reposição de urna com `a` favoráveis em `n`, `a/n = bn/bd`
(fração base já irredutível). Resposta `(bn/bd)² = bn²/bd²` (já irredutível).
Distratores: `bn/bd` (1 retirada), `a(a−1)/(n(n−1))` (sem reposição),
`2·bn/bd` (somou em vez de multiplicar), `a/n²` (1 caso favorável / pares ordenados).

| id | dif | urna | Resolução | Gerador |
|----|-----|------|-----------|---------|
| 0140 | facil | 4 verm. em 10 | (4/10)² = (2/5)² = **4/25** | E) 4/25 ✓ |
| 0141 | medio | 6 amar. em 21 | (6/21)² = (2/7)² = **4/49** | C) 4/49 ✓ |
| 0142 | dificil | 8 verdes em 20 | (8/20)² = (2/5)² = **4/25** | A) 4/25 ✓ |

## 2 — `probComplementar` → "Eventos Sucessivos"

`k` tentativas independentes, prob. `p = pn/pd` do evento desfavorável em cada.
Resposta `1 − pᵏ = (pdᵏ − pnᵏ)/pdᵏ` (nunca simplifica, pois gcd(pnᵏ,pdᵏ)=1).
Distratores: `pᵏ` (esqueceu o 1−), `1−p` (uma só tentativa),
`(1−p)ᵏ` (sucesso em todas), `k·(1−p)·pᵏ⁻¹` (exatamente um sucesso).

| id | dif | p, k | Resolução | Gerador |
|----|-----|------|-----------|---------|
| 0143 | facil | p=2/5, k=2 | 1 − (2/5)² = 1 − 4/25 = **21/25** | B) 21/25 ✓ |
| 0144 | medio | p=1/4, k=3 | 1 − (1/4)³ = 1 − 1/64 = **63/64** | C) 63/64 ✓ |
| 0145 | dificil | p=2/5, k=4 | 1 − (2/5)⁴ = 1 − 16/625 = **609/625** | C) 609/625 ✓ |

(0145: "fica protegido se pelo menos um dispositivo acionar" = 1 − P(nenhum aciona),
com P(um não aciona) = 2/5.)

## 3 — `probUniaoExclusiva` → "Probabilidade Simples"

Eventos mutuamente exclusivos: `P(A ∪ B) = P(A) + P(B)`. Contagem por laço.
Distratores: só P(A); P(A)·P(B) (multiplicou); favoráveis:desfavoráveis;
complementar.

| id | dif | evento | Resolução | Gerador |
|----|-----|--------|-----------|---------|
| 0146 | facil | dado: face 5 ou face 6 | 1/6 + 1/6 = 2/6 = **1/3** | C) 1/3 ✓ |
| 0147 | medio | dado: par ou o número 1 | 3/6 + 1/6 = 4/6 = **2/3** | B) 2/3 ✓ |
| 0148 | dificil | roleta 1–20: múltiplo de 4 ou o 7 | 5/20 + 1/20 = 6/20 = **3/10** | D) 3/10 ✓ |

(0148: múltiplos de 4 em 1..20 = {4,8,12,16,20} → 5; 7 não é múltiplo de 4, logo
disjuntos.)

## 4 — `probDoisDados` → "Probabilidade Simples"

2 dados, espaço amostral 36 (pares ordenados). Contagem por laço 1..6 × 1..6.
Distratores: complementar; contagem não ordenada / 36; favoráveis / 12
(espaço 6+6); favoráveis:desfavoráveis.

| id | dif | evento | Contagem | Resolução | Gerador |
|----|-----|--------|----------|-----------|---------|
| 0149 | facil | soma = 9 | (3,6)(4,5)(5,4)(6,3) = 4 | 4/36 = **1/9** | C) 1/9 ✓ |
| 0150 | medio | maior valor = 3 | (1,3)(2,3)(3,3)(3,2)(3,1) = 5 | 5/36 = **5/36** | C) 5/36 ✓ |
| 0151 | dificil | soma ≥ 9 | 4+3+2+1 = 10 (somas 9,10,11,12) | 10/36 = **5/18** | B) 5/18 ✓ |

## 5 — `probBaralho` → "Probabilidade Simples"

1 carta de 52. Contagem por `deck.filter`. Um modo por dificuldade.

| id | dif | evento | Resolução | Gerador |
|----|-----|--------|-----------|---------|
| 0152 | facil | naipe (copas) | 13/52 = **1/4** | B) 1/4 ✓ |
| 0153 | medio | figura (J, Q ou K) | 12/52 = **3/13** | A) 3/13 ✓ |
| 0154 | dificil | copas ou rei | 13/52 + 4/52 − 1/52 = 16/52 = **4/13** | A) 4/13 ✓ |

(0154: inclusão-exclusão — a carta "rei de copas" é contada uma vez só.
Distrator B) 17/52 = erro clássico de esquecer o −P(A∩B).)

## 6 — `probTabelaContingencia` → "Probabilidade Simples" / "Probabilidade Condicional"

Tabela 2×2 (grupo × preferência) montada como texto no enunciado, com os 4
valores internos e todas as margens. `need` corta em 23 → só fácil + médio saem.

| id | dif | tabela (a,b,c,d) | pergunta | Resolução | Gerador |
|----|-----|-----------------|----------|-----------|---------|
| 0155 | facil | técnicos 15/5 (20), analistas 10/20 (30), N=50 | P(técnico) | (15+5)/50 = 20/50 = **2/5** | B) 2/5 ✓ |
| 0156 | medio | meninos 12/8 (20), meninas 6/24 (30), N=50 | P(prefere manhã \| menino) | 12/20 = **3/5** | C) 3/5 ✓ |

- 0155 (`P(A)`, marginal da linha) → "Probabilidade Simples". Distratores:
  `a/N` (só uma célula), `(a+c)/N` (somou a coluna), `(c+d)/N` (outro grupo),
  `(a+b)/(c+d)` (dividiu pelo grupo oposto).
- 0156 (`P(A|B)` = célula / total da linha) → "Probabilidade Condicional".
  Distratores: `a/N` (dividiu pelo total geral — erro clássico da condicional),
  `a/(a+c)` (dividiu pela coluna), `b/(a+b)` (outra célula da linha),
  `(a+c)/N` (marginal).
- O modo `dificil` (`P(A ∩ B)` = `b/N`, "Probabilidade Simples") existe no molde
  mas não é gravado, pois `need` fecha em 23 antes dele.

## Concordância de distratores (não colisão)

Cada molde retesta `new Set([correta, ...4 distratores]).size < 5` e recursa (até
40 tentativas, re-sorteando parâmetros) se houver colisão de **string**. As 17
questões gravadas têm 5 alternativas distintas (confirmado por `validate-all`:
`[ALT DUPLICADA]` = 0).

## Ressalvas menores (cosméticas, não bloqueiam)

- `probDoisDados` 0150: explicação termina "P = 5/36 = 5/36" (a contagem crua já
  é irredutível). Não afeta a matemática.
- `probComReposicao` distrator `2·bn/bd` e `probTabelaContingencia` distratores
  do tipo `(a+b)/(c+d)`: podem resultar em fração > 1 quando os grupos são
  desbalanceados — erro clássico válido, porém pouco plausível; eliminado por
  prova de razoabilidade, não gera ambiguidade da resposta.
- `probTabelaContingencia`: enunciado usa "d${art}" → "dos técnicos" / "dos
  meninos" (art1 sempre "os" nos 3 contextos); a tabela é renderizada inline
  ("Os técnicos: 15 preferem … e 5 preferem … (total 20). …") porque o
  `enunciado` é exibido em `<p>` puro (quebras de linha colapsam), seguindo a
  convenção já usada em `real.json` (ex.: `enem-2020-b-172`).
