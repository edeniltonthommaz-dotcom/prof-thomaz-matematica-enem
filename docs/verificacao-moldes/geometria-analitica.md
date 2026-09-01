# Verificação manual — 13 moldes de "Geometria Analítica"

Task 9 / Fase 4 do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/geometria-analitica.json` pelo pipeline `node scripts/generate.mjs`
(ids `geometria-analitica-ined-0041` … `-0077`; os ids `-0035`…`-0040` são os 2 moldes
antigos `geoDistanciaPontos`/`geoEquacaoReta`, inalterados). Para cada questão nova:
enunciado como ficou no arquivo, resolução independente com a aritmética, e a letra +
texto que o gerador marcou `correta`. Devem concordar.

**Resultado: 37/37 questões novas gravadas conferidas — a resolução independente bate
com a alternativa `correta` do gerador em todas.** (`gaBaricentro` só emitiu 1 das 3
dificuldades porque o teto de 43 inéditas da categoria foi atingido antes — o teste
manual das 3 abaixo cobre a lógica; só a `facil` foi gravada.)

As 43 questões inéditas de `geometria-analitica.json` têm 5 alternativas distintas,
sem placeholder e sem "nudge" numérico (verificado por script). `max sig count = 3`
(nenhuma estrutura repetida mais de 3×).

| id | Molde / dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-------------|--------------------------|------------------------|---------|
| 0041 | `gaPontoMedio` facil | ponto médio de A(-4, 3) e B(-6, 5) | ((-4-6)/2, (3+5)/2) = **(-5, 4)** | E) (-5, 4) ✓ |
| 0042 | " medio | ponto médio de A(-1, 3) e B(-3, 11) | (-4/2, 14/2) = **(-2, 7)** | A) (-2, 7) ✓ |
| 0043 | " dificil | ponto médio de A(-9, 8) e B(-11, 16) | (-20/2, 24/2) = **(-10, 12)** | A) (-10, 12) ✓ |
| 0044 | `gaDistanciaOrigem` facil | dist. de P(-3, 4) à origem | √(9+16) = √25 = **5** | B) 5 ✓ |
| 0045 | " medio | dist. de P(-9, 12) à origem | √(81+144) = √225 = **15** | E) 15 ✓ |
| 0046 | " dificil | dist. de P(-20, 21) à origem | √(400+441) = √841 = **29** | B) 29 ✓ |
| 0047 | `gaCoefAngularDoisPontos` facil | m da reta por A(2, 2) e B(4, 8) | (8-2)/(4-2) = 6/2 = **3** | B) 3 ✓ |
| 0048 | " medio | m da reta por A(0, 1) e B(2, 7) | 6/2 = **3** | E) 3 ✓ |
| 0049 | " dificil | m da reta por A(1, 4) e B(4, -2) | -6/3 = **-2** | B) -2 ✓ |
| 0050 | `gaEquacaoRetaPorDoisPontos` facil | n de r por A(3, 4) e B(6, 13) | m = 9/3 = 3; n = 4 - 3·3 = **-5** | D) -5 ✓ |
| 0051 | " medio | n de r por A(3, 0) e B(4, 2) | m = 2; n = 0 - 2·3 = **-6** | D) -6 ✓ |
| 0052 | " dificil | n de r por A(3, 0) e B(4, -3) | m = -3; n = 0 - (-3)·3 = **9** | E) 9 ✓ |
| 0053 | `gaParalelaPerpendicular` facil | m de paralela a y = -3x + 5 | mesmo m = **-3** | A) -3 ✓ |
| 0054 | " medio | m de perpendicular a y = -2x - 4 | -1/(-2) = **1/2** | B) 1/2 ✓ |
| 0055 | " dificil | m de s ⟂ r: y = -2x - 4 | -1/(-2) = **1/2** | A) 1/2 ✓ |
| 0056 | `gaInterseccaoRetas` facil | r: y = -x - 7, s: y = -3x - 13 | -x-7 = -3x-13 ⇒ x = -3; y = 3-7 = **(-3, -4)** | D) (-3, -4) ✓ |
| 0057 | " medio | r: y = x - 3, s: y = 2x - 6 | x-3 = 2x-6 ⇒ x = 3; y = 0 → **(3, 0)** | C) (3, 0) ✓ |
| 0058 | " dificil | r: y = -3x + 5, s: y = -x - 1 | -3x+5 = -x-1 ⇒ x = 3; y = -4 → **(3, -4)** | B) (3, -4) ✓ |
| 0059 | `gaCircunferenciaCentroRaio` facil | centro de (x+3)² + (y-2)² = 36 | a = -3, b = 2 → **(-3, 2)** | C) (-3, 2) ✓ |
| 0060 | " medio | raio de (x+3)² + (y-4)² = 49 | √49 = **7** | C) 7 ✓ |
| 0061 | " dificil | eq. reduzida: centro C(-4, 5), raio 6 | **(x + 4)² + (y - 5)² = 36** | A ✓ |
| 0062 | `gaCircunferenciaGeralParaReduzida` facil | centro de x²+y²+2x+10y-10 = 0 | (-D/2, -E/2) = (-1, -5) | B) (-1, -5) ✓ |
| 0063 | " medio | raio de x²+y²-10x-2y+10 = 0 | r = √(25+1-10) = √16 = **4** | E) 4 ✓ |
| 0064 | " dificil | centro e raio de x²+y²+6x+2y+1 = 0 | centro (-3, -1); r = √(9+1-1) = **3** | E) centro (-3, -1), raio 3 ✓ |
| 0065 | `gaPontoNaCircunferencia` facil | C(3, 3), r = 5, P(0, -1) | d² = 9+16 = 25 = r² → **sobre** | D) P está sobre λ ✓ |
| 0066 | " medio | C(2, -2), r = 8, P(-2, -2) | d² = 16 < 64 → **interior** | A) P está no interior de λ ✓ |
| 0067 | " dificil | C(-3, 0), r = 6, P(4, 0) | d² = 49 > 36 → **exterior** | C) P está no exterior de λ ✓ |
| 0068 | `gaAreaTrianguloVertices` facil | A(-1, 3), B(1, -3), C(-2, -1) | det = -1(-2) + 1(-4) - 2(6) = -14; \|−14\|/2 = **7** | B) 7 ✓ |
| 0069 | " medio | A(4, -1), B(-4, 3), C(2, 3) | det = 0 - 4(4) + 2(-4) = -24; /2 = **12** | C) 12 ✓ |
| 0070 | " dificil | A(-6, 3), B(6, -4), C(-5, 0) | det = -6(-4) + 6(-3) - 5(7) = -29; \|−29\|/2 = **14,5** | B) 14,5 ✓ |
| 0071 | `gaAlinhamento` facil | A(1, -3), B(2, -1), C(-3, k) | m = 2/1 = 2; k = -3 + 2(-4) = **-11** | A) -11 ✓ |
| 0072 | " medio | A(-1, -3), B(-3, -9), C(3, k) | m = -6/-2 = 3; k = -3 + 3(4) = **9** | E) 9 ✓ |
| 0073 | " dificil | A(3, 1), B(-3, -11), C(-2, k) | m = -12/-6 = 2; k = 1 + 2(-5) = **-9** | E) -9 ✓ |
| 0074 | `gaSimetrico` facil | simétrico de P(1, 6) no eixo x | (x, -y) = **(1, -6)** | D) (1, -6) ✓ |
| 0075 | " medio | simétrico de P(5, -3) no eixo y | (-x, y) = **(-5, -3)** | A) (-5, -3) ✓ |
| 0076 | " dificil | simétrico de P(-3, -1) na origem | (-x, -y) = **(3, 1)** | E) (3, 1) ✓ |
| 0077 | `gaBaricentro` facil | A(4, -3), B(4, -4), C(-2, -2) | (6/3, -9/3) = **(2, -3)** | A) (2, -3) ✓ |

`gaBaricentro` medio/dificil (não gravados, teto atingido) — teste da lógica com o
runner `resetRng()` isolado: p.ex. medio A(0,4) B(-2,-1) C(...) → em todos os casos
`Sx = 3·gx`, `Sy = 3·gy` por construção, e o gerador devolve `(gx, gy)`. Conferido.

## Distratores (erros clássicos calculados em código)

- **Ponto médio:** `((x₁−x₂)/2, (y₁−y₂)/2)` (subtrai em vez de somar), `(x₁+x₂, y₁+y₂)`
  (esquece o ÷2), `(m_y, m_x)` (troca as coordenadas), `((x₂−x₁)/2, (y₂−y₁)/2)`
  (erro de sinal). Guarda `m_x ≠ m_y` + recursão de distinção.
- **Distância à origem:** `x+y` (soma os catetos), `|x−y|`, `d²` (esquece a raiz), `2d`.
  Triplas pitagóricas garantem raiz inteira.
- **Coef. angular:** `−m` (erro de sinal), `Δy` sozinho (não divide), `Δx` sozinho,
  `n = y₁ − m·x₁` (confunde coef. angular com linear). `Δx | Δy` (Δx ∈ {2,3}, ≠ |m|)
  ⇒ `m` inteiro.
- **n da reta:** `y₁ + m·x₁` (erro de sinal), `y₂ + m·x₂` (idem no ponto B), `m`
  (confunde os coeficientes), `y₁` (toma a ordenada do 1º ponto). Ambos os pontos com
  `x ≠ 0`.
- **Paralela/perpendicular:** para paralela — `−m`, `−1/m` (a perpendicular), `1/m`
  (recíproco sem sinal), `b`. Para perpendicular — `m` (não transforma), `−m`, `1/m`,
  `b`. `m ∈ {±2, ±3}` mantém `−1/m` como fração própria distinta dos inteiros.
- **Interseção de retas:** `(−x, y)` (erro de sinal ao isolar x), `(y, x)` (troca),
  `(x, m₁x)` (esquece `+ n₁` na volta), `(x, n₁)` (usa o coef. linear como y).
  Guardas `x ≠ 0`, `x ≠ y`, `n₁ ≠ 0`, `m₁ ≠ 0`.
- **Centro/raio da circ. (reduzida):** ler os sinais direto `(−a, −b)`, trocar
  `(b, a)`, um sinal só `(−a, b)`, trocar+sinal `(−b, −a)`; raio — `r²` (não tira raiz),
  `2r` (diâmetro), `r²+1`, `r+1`; equação — sinais não invertidos, RHS = `r` (não eleva
  ao quadrado), centro trocado, RHS = `2r`.
- **Geral → reduzida:** centro `(D, E)` (lê direto), `(−D, −E)` (esquece o ÷2), um
  sinal só, troca; raio — `r²`, `2r`, `|a|+|b|`, `r+1`. `D, E` pares por construção
  (`D = −2a`), `F = a²+b²−r²` ⇒ `r` inteiro.
- **Posição do ponto:** as 3 classificações erradas (interior/sobre/exterior) +
  2 afirmações-isca ("é o centro", "coincide com a origem"). Ponto de teste construído
  com tripla pitagórica (sobre) ou offset axial (interior/exterior) ⇒ `d²` exato.
- **Área do triângulo:** `|det|` (esquece o ÷2), área do retângulo envolvente
  `Δx·Δy`, metade dele, e `|det com sinal trocado no último termo|/2`. Guarda `área ≠ 0`.
- **Alinhamento:** `y₁ − m(x_C−x_A)` (sinal), `m(x_C−x_A)` (esquece `+ y₁`),
  `y₁ + m(x_C−x_B)` (mistura os pontos), `y₂ + m(x_C−x_A)` (usa y_B). Guarda `y₁ ≠ 0`.
- **Simétrico:** as outras 3 transformações do trio {eixo x, eixo y, origem} + `(x, y)`
  (sem mudança) + `(y, x)` (troca/rotação). Guardas `x, y ≠ 0`, `|x| ≠ |y|` ⇒ 5 distintos.
- **Baricentro:** `(Sx, Sy)` (esquece o ÷3), `(g_y, g_x)` (troca), `(2g_x, 2g_y)`
  (usa 2/3), `(Sx, g_y)` (só divide y). Vértice C construído p/ `Sx = 3g_x`, `Sy = 3g_y`.

## Gate

- `node scripts/generate.mjs` → `geometria-analitica: +43 inéditas (realLike 7, total 50)`.
  Mudam só `geometria-analitica.json`, `_resumo.json` e os JSONs das categorias que
  vêm **depois** no `TEMPLATES` (trigonometria, estatistica, probabilidade,
  analise-combinatoria, matematica-financeira, matrizes, logica, conjuntos) — o stream
  do PRNG semeado desloca. Nenhuma categoria anterior mudou.
- `node scripts/validate-all.mjs` → `1011 questões, 1011 enunciados únicos, 0 erros` (exit 0).
- `node --test scripts/rng.test.mjs` → 5/5 (inclui idempotência); rodado 2×, `git status`
  estável após o 2º `generate`.
- `npm run build` → compila.

## Total real alcançado

**50** (7 realLike + 43 inéditas). Atinge a meta de 50. As 43 inéditas = 2 moldes
antigos (6) + 13 moldes novos (37, com `gaBaricentro` truncado no teto).
