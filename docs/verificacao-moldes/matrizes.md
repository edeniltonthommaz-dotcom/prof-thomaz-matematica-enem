# Verificação manual — 16 moldes de "Matrizes e Determinantes"

Task 7 / Fase 2 do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: para cada molde, `resetRng(); fn("medio")` (RNG semeado, primeira instância),
resolução independente da questão (sem olhar o gabarito), comparação com a letra
que o gerador marcou `correta` e com o texto da alternativa nessa letra.

**Resultado: 16/16 conferidos — a aritmética resolvida à mão bate com a alternativa
marcada `correta` pelo gerador em todos os moldes.**

| # | Molde | subtópico | Enunciado (instância "medio") | Resolução independente | Gerador |
|---|-------|-----------|-------------------------------|------------------------|---------|
| 1 | `matDeterminante3x3` | Determinantes | A = [[-1,2,-3],[5,5,3],[4,0,5]], Sarrus | −1·(25−0) − 2·(25−12) + (−3)·(0−20) = −25 − 26 + 60 = **9** | C) 9 ✓ |
| 2 | `matSoma` | Operações com Matrizes | A=[[-1,4],[-6,9]], B=[[9,6],[7,-1]], C=A+B, elem (2,1) | (−6) + 7 = **1** | D) 1 ✓ |
| 3 | `matSubtracao` | Operações com Matrizes | mesmas A,B, C=A−B, elem (2,1) | (−6) − 7 = **−13** | D) −13 ✓ |
| 4 | `matEscalar` | Operações com Matrizes | A=[[5,-7],[9,9]], k=3, elem (2,2) de k·A | 3 · 9 = **27** | B) 27 ✓ |
| 5 | `matProduto` | Operações com Matrizes | A=[[-4,-2],[-2,5]], B=[[-1,1],[4,2]], C=A·B, elem (2,1) | (−2)(−1) + 5·4 = 2 + 20 = **22** | D) 22 ✓ |
| 6 | `matTransposta` | Operações com Matrizes | A=[[9,-3],[8,-9]], elem (1,2) de Aᵀ | Aᵀ(1,2) = A(2,1) = **8** | D) 8 ✓ |
| 7 | `matTraco` | Operações com Matrizes | M diag = (−1, −1, −6) | −1 −1 −6 = **−8** | C) −8 ✓ |
| 8 | `matIgualdade` | Operações com Matrizes | [[x+3, 9],[9, 2y]] = [[8,9],[9,14]], x+y | x = 8−3 = 5; y = 14/2 = 7; **x+y = 12** | A) 12 ✓ |
| 9 | `matLeiDeFormacao` | Operações com Matrizes | a_ij = i + 2j, elem a_31 | 3 + 2·1 = **5** | A) 5 ✓ |
| 10 | `matSimetrica` | Operações com Matrizes | A=[[-6, x+3],[8, 9]] simétrica | x + 3 = 8 ⇒ x = **5** | B) 5 ✓ |
| 11 | `matPotencia` | Operações com Matrizes | A=[[-1,2],[-3,5]], elem (1,1) de A² | (−1)(−1) + (2)(−3) = 1 − 6 = **−5** | B) −5 ✓ |
| 12 | `matInversa` | Determinantes | A=[[1,-2],[2,-5]], det=−1, elem (1,1) de A⁻¹ | A⁻¹ = (1/−1)[[−5,2],[−2,1]] ⇒ (1,1) = **5** | A) 5 ✓ |
| 13 | `matDeterminanteComIncognita` | Determinantes | det [[x,3],[4,2]] = 0 | 2x − 12 = 0 ⇒ x = **6** | A) 6 ✓ |
| 14 | `matCramer` | Aplicações Práticas | {2x+5y=45; 5x+5y=60}, Cramer, x | D = 10−25 = −15; Dx = 225−300 = −75; x = −75/−15 = **5** (confere: y=7, 25+35=60) | B) 5 ✓ |
| 15 | `matFaturamento` | Aplicações Práticas | Q linha1 = [6,20,20], p = [40,20,20], faturamento Filial Centro | 6·40 + 20·20 + 20·20 = 240 + 400 + 400 = **R$ 1.040,00** | C) R$ 1.040,00 ✓ |
| 16 | `matIdentidadePropriedade` | Aplicações Práticas | A=[[9,-3],[8,-9]], elem (1,2) de A·I | A·I = A ⇒ (1,2) = **−3** (definição: 9·0 + (−3)·1 = −3) | C) −3 ✓ |

## Distratores

Todos os distratores são erros clássicos calculados em código (sem ruído aleatório),
distintos entre si e da resposta. Exemplos: erro de sinal no determinante; somar em
vez de subtrair; multiplicar elementos correspondentes (erro de produto de matrizes);
trocar a_ij por a_ji (transposta); esquecer o fator 1/det na inversa; não dividir por
D na Regra de Cramer; usar apenas o primeiro preço no faturamento.

`node scripts/validate-all.mjs` → 0 erros, 0 placeholders em matrizes.json.

## Determinismo

`node scripts/generate.mjs` roda duas vezes com saída byte-idêntica
(`node --test scripts/rng.test.mjs` → 5/5, duas execuções). As categorias `logica` e
`conjuntos` (posteriores a `matrizes` na ordem de `CATEGORIAS`) regeneram com valores
diferentes porque o PRNG semeado é compartilhado e `matrizes` passou a consumir mais
sorteios — questões continuam válidas (validate-all 0 erros).
