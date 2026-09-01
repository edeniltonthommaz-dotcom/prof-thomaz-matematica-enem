# Verificação à mão — moldes de Função Quadrática (Fase 5)

Fonte: `src/data/questions/funcao-quadratica.json` (questões `funcao-quadratica-ined-0013` … `-0046`).
Cada linha traz o `id`, o enunciado do arquivo, a resolução independente e a alternativa `correta`
gravada no arquivo. Todas conferem.

`ined-0013`…`-0018` são dos moldes pré-existentes `quadVertice` / `quadTrajetoria` (inalterados por esta fase) — não reverificados aqui.

---

## 1. `quadLucroMaximo` — lucro máximo = L(x_v), x_v = −b/2a, a = 1 → L_max = x_v² − c

- **`ined-0019`** — "L(x) = −x² + 28x − 100. Qual é o lucro máximo mensal possível?"
  x_v = 28/2 = 14; L(14) = −196 + 392 − 100 = **96** → `R$ 96,00`. Arquivo: **D) R$ 96,00**. ✔
  Distratores: 196+100=296 (sinal em c); 2·196−100=292 (ignorou −ax²); 14 (confundiu x com L); 28 (coef. b).
- **`ined-0020`** — "L(x) = −x² + 36x − 150." x_v = 18; L(18) = −324 + 648 − 150 = **174**. Arquivo: **A) R$ 174,00**. ✔
- **`ined-0021`** — "L(x) = −x² + 52x − 400." x_v = 26; L(26) = −676 + 1352 − 400 = **276**. Arquivo: **A) R$ 276,00**. ✔

## 2. `quadRaizesContexto` — raízes de −x² + Sx − P = 0 (Δ quadrado perfeito)

- **`ined-0022`** — "f(x) = −x² + 9x − 18. Para quais valores de x esse valor é nulo?"
  x² − 9x + 18 = 0 → (x−3)(x−6) = 0 → x = 3 ou x = 6. Arquivo: **A) x = 3 ou x = 6**. ✔
  Distratores: −3/−6 (sinais trocados na fórmula); 9/18 (S e P no lugar das raízes); 9/3 (S e √Δ); −6/−12 (esqueceu o /2a).
- **`ined-0023`** — "f(x) = −x² + 9x − 18." Mesmas raízes 3 e 6. Arquivo: **C) x = 3 ou x = 6**. ✔
- **`ined-0024`** — "f(x) = −x² + 14x − 40." x² − 14x + 40 = 0 → (x−4)(x−10) = 0 → x = 4 ou x = 10. Arquivo: **A) x = 4 ou x = 10**. ✔

## 3. `quadSomaProdutoRaizes` — Girard: S = −b/a, P = c/a

- **`ined-0025`** — "2x² − 12x + 18 = 0. … a soma das raízes adicionada ao produto das raízes."
  S = 12/2 = 6; P = 18/2 = 9; S + P = **15**. Arquivo: **C) 15**. ✔
  Distratores: 6−9=−3; 6·9=54; 6 (só S); 9 (só P).
- **`ined-0026`** — "3x² − 24x + 9 = 0. … o produto das raízes." P = 9/3 = **3**. Arquivo: **B) 3**. ✔
  Distratores: −3; 3·3=9 (c bruto); 8 (=S); −8.
- **`ined-0027`** — "2x² − 8x + 6 = 0. … o produto das raízes." P = 6/2 = **3**. Arquivo: **A) 3**. ✔

## 4. `quadAreaCercado` — P m de tela, 3 lados: x + 2y = P, A_max = P²/8 (P = 4k → 2k²)

- **`ined-0028`** — "20 m de tela … apenas três lados. Qual é a maior área?"
  x + 2y = 20 → A(y) = (20−2y)y, máx. em y = 5, x = 10 → A = **50 m²**. Arquivo: **A) 50 m²**. ✔
  Distratores: 25 (quadrado de lado P/4); 100 (=(P/2)²); 20 (perímetro como área); 10 (dimensão x).
- **`ined-0029`** — "28 m de tela." y = 7, x = 14 → A = **98 m²**. Arquivo: **A) 98 m²**. ✔
- **`ined-0030`** — "40 m de tela." y = 10, x = 20 → A = **200 m²**. Arquivo: **D) 200 m²**. ✔

## 5. `quadDoisNumeros` — soma S fixa, produto máx. com ambos S/2 → (S/2)²

- **`ined-0031`** — "Dois números positivos têm soma igual a 12. … maior valor possível para o produto?"
  p(n) = n(12−n), máx. em n = 6 → 6·6 = **36**. Arquivo: **C) 36**. ✔
  Distratores: 35 (=6²−1, divisão 5 e 7); 144 (=S²); 6 (um dos números); 72 (=S²/2).
- **`ined-0032`** — "soma igual a 22." n = 11 → 11·11 = **121**. Arquivo: **A) 121**. ✔
- **`ined-0033`** — "soma … é 36." n = 18 → 18·18 = **324**. Arquivo: **A) 324**. ✔

## 6. `quadAlcanceProjetil` — h(t) = −at² + bt; volta ao solo em t = b/a

- **`ined-0034`** — "h(t) = −3t² + 18t. Quantos segundos … retorna ao solo?"
  t(−3t + 18) = 0 → t = 0 ou t = 18/3 = **6 s**. Arquivo: **D) 6 s**. ✔
  Distratores: 3 (=b/2a, tempo do ápice); 18 (=b, esqueceu ÷a); 12 (=2t); 27 (=a·t²/4, valor da altura máx.).
- **`ined-0035`** — "h(t) = −4t² + 40t." t = 40/4 = **10 s**. Arquivo: **C) 10 s**. ✔
- **`ined-0036`** — "h(t) = −3t² + 30t." t = 30/3 = **10 s**. Arquivo: **C) 10 s**. ✔

## 7. `quadAlturaNoInstante` — avaliar h(t₀) de h(t) = −at² + bt + c

- **`ined-0037`** — "h(t) = −t² + 15t + 9 … altura no instante t = 2 s?"
  h(2) = −4 + 30 + 9 = **35 m**. Arquivo: **D) 35 m**. ✔
  Distratores: +4+30+9=43 (erro de sinal em at²); −4+30=26 (esqueceu c); 30+9=39 (largou o termo quadrático); 9 (=c, avaliou em t=0).
- **`ined-0038`** — "h(t) = −2t² + 11t + 10 … t = 2 s." h(2) = −8 + 22 + 10 = **24 m**. Arquivo: **D) 24 m**. ✔
- **`ined-0039`** — "h(t) = −t² + 11t + 10 … t = 3 s." h(3) = −9 + 33 + 10 = **34 m**. Arquivo: **D) 34 m**. ✔

## 8. `quadVerticeCoordenadas` — vértice (x_v, y_v), x_v = −b/2a, y_v = y(x_v)

- **`ined-0040`** — "y = −x² − 2x + 2 tem vértice em qual ponto?"
  x_v = −(−2)/(2·(−1)) = −1; y_v = −(−1)² − 2(−1) + 2 = −1 + 2 + 2 = 3 → **(−1, 3)**. Arquivo: **D) (-1, 3)**. ✔
  Distratores: (−2,3) (esqueceu o 2 em −b/2a); (1,3) (sinal em x_v); (−1,−3) (sinal em y_v); (3,−1) (trocou coordenadas).
- **`ined-0041`** — "y = −x² + 2x + 5." x_v = −2/(−2) = 1; y_v = −1 + 2 + 5 = 6 → **(1, 6)**. Arquivo: **D) (1, 6)**. ✔
- **`ined-0042`** — "y = −2x² − 20x − 57." x_v = 20/(−4) = −5; y_v = −2·25 + 100 − 57 = −7 → **(−5, −7)**. Arquivo: **D) (-5, -7)**. ✔

## 9. `quadArcoParabolico` — h(x) = H − k·x², h(±L) = 0 → k = H/L²; pede h(d) (k = 1/4 nas tuplas)

- **`ined-0043`** — "vão 24 m (L = 12), altura máx. 36 m. Altura a 8 m do centro?"
  k = 36/12² = 1/4; h(8) = 36 − ¼·64 = 36 − 16 = **20 m**. Arquivo: **B) 20 m**. ✔
  Distratores: 16 (só a queda k·d²); 36−32=4 (usou k=1/2); 36−24=12 (interpolação linear H·d/L); 36−8=28 (não elevou d ao quadrado).
- **`ined-0044`** — "vão 32 m (L = 16), altura máx. 64 m. A 10 m." h(10) = 64 − ¼·100 = 64 − 25 = **39 m**. Arquivo: **C) 39 m**. ✔
- **`ined-0045`** — "vão 40 m (L = 20), altura máx. 100 m. A 12 m." h(12) = 100 − ¼·144 = 100 − 36 = **64 m**. Arquivo: **A) 64 m**. ✔

## 10. `quadCustoMinimo` — C(x) = ax² − bx + c; custo mínimo C(x_min), x_min = b/2a

- **`ined-0046`** — "C(x) = x² − 8x + 132. Qual é o menor custo possível?"
  x_min = 8/2 = 4; C(4) = 16 − 32 + 132 = **116** → `R$ 116,00`. Arquivo: **B) R$ 116,00**. ✔
  Distratores: 132+16=148 (sinal em −ax_min²); 132 (=c, avaliou em x=0); 132+48=180 (sinal em −bx); 132−32=100 (subtraiu 2·ax_min²).

---

**Resultado: 34/34 questões conferidas; todas as respostas do arquivo batem com a resolução independente.**
`node scripts/validate-all.mjs` → 1039 questões, 0 erros.
