# Verificação manual — 7 moldes novos de "Análise Combinatória"

Task 11b / Fase 6 (parte 2) do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/analise-combinatoria.json` pelo pipeline
`node scripts/generate.mjs` (ids `analise-combinatoria-ined-0121` … `-0145`).
Para cada uma: enunciado como ficou no arquivo, resolução independente com a
aritmética de fatorial/combinação, e a letra + texto que o gerador marcou
`correta`. Devem concordar.

`TEMPLATES["analise-combinatoria"]` = `[combMultiplicativo, combComissao,
combPermutacaoSimples, combPermutacaoCircular, combArranjo, combComRepeticao,
combAnagramas, combComissaoRestricao, combSubconjuntos]` → 9 moldes × teto 3 = 27;
`need` = 50 − realLike 25 = **25**, então o gerador para no 25º (o último molde,
`combSubconjuntos`, emite só a versão fácil).

Helpers usados: `fatorial(n)`, `combinacao(n,k)` (já existentes) e
`arranjo(n,k) = n!/(n−k)!` (adicionado). `Math.pow` para `m^k` e `2^n`.

**Resultado: 25/25 questões gravadas conferidas — a resolução independente bate
com a alternativa `correta` do gerador em todas.** `node scripts/validate-all.mjs`
sai 0 (1079 questões, 1079 enunciados únicos, 0 erros); nenhuma estrutura repete
mais de 3×; 5 alternativas distintas por questão, sem placeholder.

## Moldes pré-existentes (contexto) — `combMultiplicativo`, `combComissao`

| id | Molde / dif | Enunciado (resumo) | Resolução | Gerador |
|----|-------------|--------------------|-----------|---------|
| 0121 | `combMultiplicativo` facil | 4 entradas × 4 pratos × 4 sobremesas | 4·4·4 = **64** | B) 64 ✓ |
| 0122 | `combMultiplicativo` medio | 4 × 5 × 2 | 4·5·2 = **40** | E) 40 ✓ |
| 0123 | `combMultiplicativo` dificil | 3 × 4 × 6 | 3·4·6 = **72** | E) 72 ✓ |
| 0124 | `combComissao` facil | C(8,3) | 8·7·6 / 6 = 336/6 = **56** | C) 56 ✓ |
| 0125 | `combComissao` medio | C(6,2) | 6·5 / 2 = **15** | E) 15 ✓ |
| 0126 | `combComissao` dificil | C(10,2) | 10·9 / 2 = **45** | A) 45 ✓ |

## 1 — `combPermutacaoSimples` → "Permutação"

`n` objetos distintos em fila/sequência ⇒ `n!`. Distratores: `(n−1)!`, `n²`,
`n!/2`, `(n+1)!`.

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0127 | facil | 4 pessoas em uma única fila para subir em um brinquedo | 4! = 4·3·2·1 = **24** | D) 24 ✓ |
| 0128 | medio | 6 troféus lado a lado numa prateleira | 6! = **720** | C) 720 ✓ |
| 0129 | dificil | 6 grupos musicais se apresentando em sequência | 6! = **720** | C) 720 ✓ |

Distratores conferidos distintos da resposta: 0127 {6, 16, 12, 120}; 0128 {120, 36, 360, 5040}; 0129 {5040, 36, 360, 120}.

## 2 — `combPermutacaoCircular` → "Permutação"

`n` pessoas em torno de mesa redonda (só posições relativas) ⇒ `(n−1)!`.
Distratores: `n!`, `(n−2)!`, `(n−1)!/2`, `n(n−1)`.

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0130 | facil | 4 amigos ao redor de mesa redonda, rotações iguais | (4−1)! = 3! = **6** | E) 6 ✓ |
| 0131 | medio | 5 pessoas em mesa circular, rotações iguais | (5−1)! = 4! = **24** | A) 24 ✓ |
| 0132 | dificil | 6 convidados em mesa redonda, posições relativas | (6−1)! = 5! = **120** | E) 120 ✓ |

Distratores conferidos distintos da resposta: 0130 {24, 2, 3, 12}; 0131 {120, 6, 12, 20}; 0132 {720, 24, 60, 30}.

## 3 — `combArranjo` → "Arranjo"

`k` posições ordenadas com elementos distintos escolhidos entre `n` ⇒
`A(n,k) = n!/(n−k)!`. Distratores: `nᵏ` (com repetição), `C(n,k)` (ordem não
importa), `n!` (permuta todos), `n!/k!`.

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0133 | facil | Pódio 1º e 2º (medalhas distintas) entre 6 atletas | A(6,2) = 6·5 = **30** | E) 30 ✓ |
| 0134 | medio | Senha de 3 algarismos distintos entre 1 e 7 | A(7,3) = 7·6·5 = **210** | D) 210 ✓ |
| 0135 | dificil | Presidente, vice e tesoureiro entre 8 pessoas | A(8,3) = 8·7·6 = **336** | E) 336 ✓ |

Distratores conferidos distintos da resposta: 0133 {36 = 6², 15 = C(6,2), 720 = 6!, 360 = 6!/2!}; 0134 {343 = 7³, 35 = C(7,3), 5040 = 7!, 840 = 7!/3!}; 0135 {512 = 8³, 56 = C(8,3), 40320 = 8!, 6720 = 8!/3!}.

## 4 — `combComRepeticao` → "Princípio Multiplicativo"

`k` posições, `m` símbolos, repetição livre ⇒ `mᵏ`. Distratores: `A(m,k)` (sem
repetição), `C(m+k−1,k)` (combinação com repetição), `m·k` (linear),
`m^(k−1)` (uma posição a menos).

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0136 | facil | Senha de 3 algarismos, cada um de 0 a 9, repetição livre | 10³ = **1000** | B) 1000 ✓ |
| 0137 | medio | Código de 2 letras entre as 26, repetição permitida | 26² = **676** | A) 676 ✓ |
| 0138 | dificil | Cadeado de 4 anéis, 7 símbolos por anel, repetição livre | 7⁴ = 2401 → **2401** | C) 2401 ✓ |

Distratores conferidos distintos da resposta: 0136 {A(10,3)=720, C(12,3)=220, 30, 10²=100}; 0137 {A(26,2)=650, C(27,2)=351, 52, 26¹=26}; 0138 {A(7,4)=840, C(10,4)=210, 28, 7³=343}.

## 5 — `combAnagramas` → "Permutação"

Palavra com todas as letras distintas ⇒ `n!`; com uma letra dupla ⇒ `n!/2!`.
Um tipo por dificuldade (fácil 4 letras distintas, médio 5 distintas, difícil 6
letras com uma repetida).

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0139 | facil | Anagramas de SAPO (S, A, P, O — todas distintas) | 4! = **24** | D) 24 ✓ |
| 0140 | medio | Anagramas de TEMPO (T, E, M, P, O — todas distintas) | 5! = **120** | E) 120 ✓ |
| 0141 | dificil | Anagramas de PAREDE (E repetida 2×, 6 letras) | 6!/2! = 720/2 = **360** | D) 360 ✓ |

Distratores conferidos distintos da resposta: 0139 {12 = 4!/2, 6 = 3!, 16 = 4², 48 = 2·4!}; 0140 {60 = 5!/2, 24 = 4!, 25 = 5², 240 = 2·5!}; 0141 {720 = 6! (esqueceu de dividir), 180 = 6!/4, 36 = 6², 120 = 5!}.

## 6 — `combComissaoRestricao` → "Combinação"

Grupo de `x+y` com exatamente `x` de um subgrupo de `a` e `y` de outro de `b` ⇒
`C(a,x)·C(b,y)`. Distratores: `C(a,x)+C(b,y)` (somou), `C(a+b,x+y)` (ignorou a
restrição), `C(a,x)·C(b,y∓1)` (contou errado no 2º subgrupo), `A(a,x)·A(b,y)`
(usou arranjo).

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0142 | facil | Equipe de 3: exatamente 2 de 4 veteranos e 1 de 4 novatos | C(4,2)·C(4,1) = 6·4 = **24** | E) 24 ✓ |
| 0143 | medio | Equipe de 4: exatamente 2 de 5 veteranos e 2 de 4 novatos | C(5,2)·C(4,2) = 10·6 = **60** | E) 60 ✓ |
| 0144 | dificil | Equipe de 5: exatamente 3 de 6 veteranos e 2 de 5 novatos | C(6,3)·C(5,2) = 20·10 = **200** | C) 200 ✓ |

Distratores conferidos distintos da resposta: 0142 {10 = 6+4, 56 = C(8,3), 36 = C(4,2)·C(4,2), 48 = A(4,2)·A(4,1)}; 0143 {16 = 10+6, 126 = C(9,4), 40 = C(5,2)·C(4,1), 240 = A(5,2)·A(4,2)}; 0144 {30 = 20+10, 462 = C(11,5), 100 = C(6,3)·C(5,1), 2400 = A(6,3)·A(5,2)}.

## 7 — `combSubconjuntos` → "Combinação"

Número de subconjuntos de um conjunto com `n` elementos ⇒ `2ⁿ` (todos),
`2ⁿ − 1` (não vazios), `2ⁿ − 2` (nem vazio nem total). Um modo por dificuldade.
`need` esgota-se no 25º item, então só a versão fácil (modo `2ⁿ`) foi gravada.

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0145 | facil | Cardápio de 5 pratos, escolher qualquer quantidade (inclusive 0 ou todos) | 2⁵ = **32** | A) 32 ✓ |

Distratores conferidos distintos da resposta: 0145 {10 = 2·5, 125 = 5³, 31 = 2⁵−1, 30 = 2⁵−2}.

Os modos `medio` (`2ⁿ − 1`) e `dificil` (`2ⁿ − 2`) do molde estão implementados e
verificados por leitura de código; só não são exercitados neste ciclo porque a
meta de 25 inéditas é atingida antes. Distratores desses modos foram escolhidos
para não colidir com a resposta em `n` ∈ 3..6 (evitando `n²`, que iguala `2ⁿ` em
`n = 4`; usa-se `n³` no lugar).
