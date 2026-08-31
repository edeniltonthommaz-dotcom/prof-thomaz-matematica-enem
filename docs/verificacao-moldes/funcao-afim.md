# Verificação manual — 6 moldes novos de "Função Afim"

Task 12a / Fase 7 (parte 1) do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/funcao-afim.json` pelo pipeline `node scripts/generate.mjs`
(ids `funcao-afim-ined-0013` … `-0030`). Para cada uma: enunciado como ficou no
arquivo, resolução independente, e a letra + texto que o gerador marcou
`correta`. Devem concordar.

`TEMPLATES["funcao-afim"]` = `[afimTarifa, afimCoeficiente, afimRaiz,
afimDepreciacao, afimConversaoTemperatura, afimComissao, afimPontoEquilibrio,
afimValorPrevisto]` → 8 moldes × teto 3 = 24; `need` = 50 − realLike 26 = **24**,
então cada molde emite exatamente as 3 dificuldades. `funcao-afim` fecha em
**total 50** (real 11 + banco 15 + inéditas 24).

**Resultado: 24/24 questões gravadas conferidas — a resolução independente bate
com a alternativa `correta` do gerador em todas.** `node scripts/validate-all.mjs`
sai 0 (1097 questões, 1097 enunciados únicos, 0 erros); nenhuma estrutura repete
mais de 3×; 5 alternativas distintas por questão, sem placeholder.

## Moldes pré-existentes (contexto) — `afimTarifa`, `afimCoeficiente`

| id | Molde / dif | Enunciado (resumo) | Resolução | Gerador |
|----|-------------|--------------------|-----------|---------|
| 0007 | `afimTarifa` facil | 9 + 1,48·29 | 9 + 42,92 = **51,92** | A) R$ 51,92 ✓ |
| 0008 | `afimTarifa` medio | 9 + 2,60·21 | 9 + 54,60 = **63,60** | A) R$ 63,60 ✓ |
| 0009 | `afimTarifa` dificil | 15 + 3,38·23 | 15 + 77,74 = **92,74** | C) R$ 92,74 ✓ |
| 0010 | `afimCoeficiente` facil | (5,28),(9,44) | (44−28)/(9−5) = 16/4 = **4** | B) 4 ✓ |
| 0011 | `afimCoeficiente` medio | (3,30),(8,55) | 25/5 = **5** | A) 5 ✓ |
| 0012 | `afimCoeficiente` dificil | (3,71),(7,143) | 72/4 = **18** | A) 18 ✓ |

## 1 — `afimRaiz` → "f(x) = ax + b"

`f(t) = b − a·t`; evento quando `f(t) = 0` ⇒ `t = b/a` (escolhido inteiro).
Distratores: `b·a`, `b+a`, `b−a`, `b`.

| id | dif | f(t) | Resolução | Gerador |
|----|-----|------|-----------|---------|
| 0013 | facil | 15 − 3t | 3t = 15 ⇒ t = **5** | C) 5 dias ✓ |
| 0014 | medio | 35 − 5t | 5t = 35 ⇒ t = **7** | D) 7 meses ✓ |
| 0015 | dificil | 48 − 6t | 6t = 48 ⇒ t = **8** | D) 8 horas ✓ |

## 2 — `afimDepreciacao` → "f(x) = ax + b"

`V(t) = V₀ − d·t`. Facil/medio: pedir `V(t)`. Dificil: pedir `t` com `V = k`
⇒ `t = (V₀−k)/d` (escolhido divisível).

| id | dif | Dados | Resolução | Gerador |
|----|-----|-------|-----------|---------|
| 0016 | facil | V₀=58000, d=2000, t=9 | 58000 − 18000 = **40000** | E) R$ 40.000,00 ✓ |
| 0017 | medio | V₀=57500, d=2500, t=3 | 57500 − 7500 = **50000** | A) R$ 50.000,00 ✓ |
| 0018 | dificil | V₀=175000, d=5000, k=150000 | (175000−150000)/5000 = **5** | E) 5 anos ✓ |

## 3 — `afimConversaoTemperatura` → "f(x) = ax + b"

`F = 9C/5 + 32`. Facil/medio: C→F (C múltiplo de 5). Dificil: F→C,
`C = 5(F−32)/9` (F−32 múltiplo de 9).

| id | dif | Dado | Resolução | Gerador |
|----|-----|------|-----------|---------|
| 0019 | facil | C = 25 | 9·25/5 + 32 = 45 + 32 = **77** | D) 77 °F ✓ |
| 0020 | medio | C = 30 | 54 + 32 = **86** | C) 86 °F ✓ |
| 0021 | dificil | F = 68 | 5·(68−32)/9 = 5·36/9 = **20** | B) 20 °C ✓ |

## 4 — `afimComissao` → "Tarifas e Planos"

Salário `= fixo + (p/100)·vendas`. Facil/medio: dado `vendas`, achar o total.
Dificil: dado o total, achar `vendas = (total−fixo)/(p/100)`.

| id | dif | Dados | Resolução | Gerador |
|----|-----|-------|-----------|---------|
| 0022 | facil | fixo=1500, p=4%, vendas=47000 | 1500 + 1880 = **3380** | C) R$ 3.380,00 ✓ |
| 0023 | medio | fixo=1700, p=6%, vendas=57000 | 1700 + 3420 = **5120** | B) R$ 5.120,00 ✓ |
| 0024 | dificil | fixo=2000, p=5%, total=3200 | 1200 ÷ 0,05 = **24000** | A) R$ 24.000,00 ✓ |

## 5 — `afimPontoEquilibrio` → "Tarifas e Planos"

Opção I `f + a·x`, opção II `g + b·x`; igualam em `x = (f−g)/(b−a)`
(escolhido inteiro positivo). Distratores: `−x`, `x·(b−a)`, `(f+g)/(b−a)`, `x+1`.

| id | dif | Opções | Resolução | Gerador |
|----|-----|--------|-----------|---------|
| 0025 | facil | I: 69 + 2x · II: 36 + 5x | (69−36)/(5−2) = 33/3 = **11** | A) 11 GB ✓ |
| 0026 | medio | I: 72 + 4x · II: 24 + 7x | 48/3 = **16** | D) 16 horas ✓ |
| 0027 | dificil | I: 54 + 2x · II: 24 + 4x | 30/2 = **15** | B) 15 horas ✓ |

## 6 — `afimValorPrevisto` → "Coeficiente Angular"

Dados `(x₁,y₁)`, `(x₂,y₂)`: `a = (y₂−y₁)/(x₂−x₁)`, `b = y₁ − a·x₁`,
resposta `a·x₃ + b`.

| id | dif | Pontos → x₃ | Resolução | Gerador |
|----|-----|-------------|-----------|---------|
| 0028 | facil | (1,19),(3,31) → 7 | a=6, b=13; 6·7+13 = **55** | A) 55 reais ✓ |
| 0029 | medio | (1,41),(6,71) → 12 | a=6, b=35; 6·12+35 = **107** | E) 107 pontos ✓ |
| 0030 | dificil | (2,35),(6,59) → 12 | a=6, b=23; 6·12+23 = **95** | A) 95 pontos ✓ |

## Concordância de distratores (não colisão)

Cada molde retesta `new Set([correta, ...4 distratores]).size < 5` e recursa
(até 40 tentativas) se houver colisão — as 24 questões gravadas têm 5
alternativas distintas (confirmado por `validate-all`).

## Ressalvas menores (cosméticas, não bloqueiam)

- `afimRaiz` dificil / `afimDepreciacao` dificil: concordância de gênero/número
  no enunciado montado — "Após quantos horas", "quando nova" (para "trator"/
  "caminhão"), "é modelada" (para "o saldo"/"o volume"). Não afeta a matemática.
- `afimPontoEquilibrio`: "Dois planos… cobram, cada uma" — "cada um".
- `afimDepreciacao` dificil: distrator "25000 anos" (numerador sem dividir) e
  `afimComissao` dificil: distrator "R$ -24.000,00" — erros clássicos válidos
  porém pouco plausíveis; eliminados por prova de razoabilidade, não afetam a
  não ambiguidade da resposta.
