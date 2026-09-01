# Verificação manual — 5 moldes novos de "Matemática Financeira"

Task 13b / Fase 8 (parte 2) do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/matematica-financeira.json` por `node scripts/generate.mjs`
(ids `matematica-financeira-ined-0198` … `-0212`). Para cada uma: enunciado como
ficou no arquivo, resolução independente com a **mesma aritmética de dinheiro do
gerador** (`Math.round(x * 100) / 100` para centavos; `(1 + i)**k` calculado em
código) e a alternativa que o gerador marcou `correta`. Devem concordar.

`TEMPLATES["matematica-financeira"]` = `[finJurosCompostos, finJurosSimples,
finValorPresente, finTaxaEquivalente, finDescontoAVista, finParcelamento]` → 6
moldes × teto 3 = 18; `need` = 50 − realLike 32 = **18**, então **todos os 6
moldes emitem as 3 dificuldades**. `matematica-financeira` fecha em **total 50**
(real 2 + banco 30 + inéditas 18).
`_resumo.json`:
`{"categoriaId":"matematica-financeira","real":2,"banco":30,"realLike":32,"inedita":18,"total":50}`.

**Resultado: 15/15 questões novas gravadas conferidas — a resolução
independente bate com a alternativa `correta` do gerador em todas.**
`node scripts/validate-all.mjs` sai 0 (1142 questões, 1142 enunciados únicos, 0
erros); nenhuma estrutura repete mais de 3×; 5 alternativas distintas por
questão, sem placeholder. `node --test scripts/rng.test.mjs` → 5/5 (2×).

## Molde pré-existente (contexto) — `finJurosCompostos`

| id | Molde / dif | Cálculo | Gerador |
|----|-------------|---------|---------|
| 0195–0197 | `finJurosCompostos` | `round(C · (1+i)^t)` | inalterado |

---

## 1 — `finJurosSimples` → "Financiamentos e Prestações"

`J = C · i · t` (i em % ao mês, t em meses); montante `M = C + J`. `C` múltiplo
de 100 e `i`, `t` inteiros ⇒ `J` inteiro. Modos: **fácil** pede `J`; **médio**
pede `M` (pagamento único do financiamento); **difícil** pede `M` (empréstimo
para quitar dívida). Distratores calculados: juros compostos no lugar dos
simples, esqueceu de somar o capital, ± um mês, juros em dobro.

### 0198 — fácil
"Uma loja financia um sofá de R$ 4.800,00 cobrando juros simples de 2% ao mês
durante 3 meses. Qual é o total de juros cobrado nesse financiamento?"

- `J = 4800 · 0,02 · 3 = 288,00` → **R$ 288,00**.
- Distratores: `M = 4800 + 288 = 5.088,00`; composto `4800·1,02³ − 4800 =
  293,80`; só 1 mês `4800·0,02 = 96,00`; 2 meses `4800·0,02·2 = 192,00`.
- Gerador: `correta = B` = **R$ 288,00**. ✔

### 0199 — médio
"Um cliente financiou um sofá no valor de R$ 5.600,00 a juros simples de 2% ao
mês, com pagamento único após 9 meses. Qual será o valor desse pagamento?"

- `J = 5600 · 0,02 · 9 = 1.008,00`; `M = 5600 + 1008 = 6.608,00` → **R$ 6.608,00**.
- Distratores: só `J` = `1.008,00`; capital `5.600,00`; composto
  `5600·1,02⁹ = 6.692,52`; +1 mês `5600·(1+0,02·10) = 6.720,00`.
- Gerador: `correta = E` = **R$ 6.608,00**. ✔

### 0200 — difícil
"Para quitar um débito, uma pessoa pegou um empréstimo de R$ 2.700,00 a juros
simples de 2% ao mês, para pagar tudo de uma só vez após 22 meses. Qual será o
valor total a devolver?"

- `J = 2700 · 0,02 · 22 = 1.188,00`; `M = 2700 + 1188 = 3.888,00` → **R$ 3.888,00**.
- Distratores: só `J` = `1.188,00`; composto `2700·1,02²² = 4.174,15`; −1 mês
  `2700 + 2700·0,02·21 = 3.834,00`; juros em dobro `2700 + 2·1188 = 5.076,00`.
- Gerador: `correta = A` = **R$ 3.888,00**. ✔

---

## 2 — `finValorPresente` → "Juros Compostos"

`C = M / (1 + i)^t`. `i ∈ {10, 20}` %, `t ∈ {2, 3}` ⇒ fator ∈ {1,21; 1,331;
1,44; 1,728}; `C = base · 1000` (base inteiro) ⇒ `M = C · fator` **inteiro
exato**, logo `C` volta exato. Modos por dificuldade: **fácil** aplicação/
resgate; **médio** meta de entrada de imóvel; **difícil** valor presente de um
título de dívida. Distratores: multiplicou por `(1+i)^t` em vez de dividir;
usou juros simples `M/(1+i·t)`; descontou juros simples `M·(1−i·t)`; descontou
só um período `M/(1+i)`.

### 0201 — fácil
"Quanto uma pessoa precisa depositar hoje em uma aplicação que rende 10% ao mês
a juros compostos para resgatar R$ 5.324,00 daqui a 3 meses?"

- fator `1,1³ = 1,331`; `C = 5324 / 1,331 = 4.000,00` → **R$ 4.000,00**
  (confere: `4000 · 1,331 = 5324`).
- Distratores: `5324·1,331 = 7.086,24`; `5324/1,3 = 4.095,38`;
  `5324·0,7 = 3.726,80`; `5324/1,1 = 4.840,00`.
- Gerador: `correta = A` = **R$ 4.000,00**. ✔

### 0202 — médio
"Uma família quer ter R$ 7.260,00 daqui a 2 meses para dar entrada em um imóvel.
Aplicando o dinheiro a juros compostos de 10% ao mês, quanto precisa investir
agora?"

- fator `1,1² = 1,21`; `C = 7260 / 1,21 = 6.000,00` → **R$ 6.000,00**
  (`6000 · 1,21 = 7260`).
- Distratores: `7260·1,21 = 8.784,60`; `7260/1,2 = 6.050,00`;
  `7260·0,8 = 5.808,00`; `7260/1,1 = 6.600,00`.
- Gerador: `correta = A` = **R$ 6.000,00**. ✔

### 0203 — difícil
"Um título de dívida será resgatado por R$ 20.736,00 daqui a 3 meses.
Considerando juros compostos de 20% ao mês, qual é o valor presente (valor justo
hoje) desse título?"

- fator `1,2³ = 1,728`; `C = 20736 / 1,728 = 12.000,00` → **R$ 12.000,00**
  (`12000 · 1,728 = 20736`).
- Distratores: `20736·1,728 = 35.831,81`; `20736/1,6 = 12.960,00`;
  `20736·0,4 = 8.294,40`; `20736/1,2 = 17.280,00`.
- Gerador: `correta = D` = **R$ 12.000,00**. ✔

---

## 3 — `finTaxaEquivalente` → "Taxas Equivalentes"

`i_k = (1 + i)^k − 1`, resposta em % com o arredondamento do helper `pct`
(inteiro → `n%`; senão `n.n%`). `i ∈ {10, 20}`, `k ∈ {2, 3}`. **Fácil/médio**:
modo direto (mensal → bimestre/trimestre). **Difícil**: modo inverso (dada a
taxa do período maior, achar a mensal) — construído como o inverso de um caso
limpo, então a raiz é exata. Distratores diretos: proporcional `i·k`; esqueceu
o `−1` (`(1+i)^k` como %); um período a mais `(1+i)^{k+1}−1`; manteve a mensal
`i`. Distratores inversos: dividiu proporcionalmente `i_k/k`; não converteu
`i_k`; raiz errada `i_k^{1/(k+1)}`; multiplicou `i_k·k`.

### 0204 — fácil (direto)
"A que taxa ao bimestre equivale uma taxa de juros compostos de 10% ao mês?"

- `i_2 = 1,1² − 1 = 0,21` → **21%**.
- Distratores: `10·2 = 20%`; `1,1² = 121%`; `1,1³ − 1 = 33.1%`; `10%`.
- Gerador: `correta = A` = **21%**. ✔

### 0205 — médio (direto)
"Um banco cobra juros compostos de 20% ao mês no cheque especial. Qual é a taxa
equivalente para um bimestre (2 meses)?"

- `i_2 = 1,2² − 1 = 0,44` → **44%**.
- Distratores: `20·2 = 40%`; `1,2² = 144%`; `1,2³ − 1 = 72.8%`; `20%`.
- Gerador: `correta = E` = **44%**. ✔

### 0206 — difícil (inverso)
"Um empréstimo cobra juros compostos de 44% ao bimestre. Qual é a taxa mensal
equivalente?"

- `(1 + i)² = 1,44` ⇒ `1 + i = 1,2` ⇒ `i = 0,20` → **20%**.
- Distratores: `44/2 = 22%`; não converteu `44%`; raiz errada
  `1,44^{1/3} − 1 ≈ 12.9%`; `44·2 = 88%`.
- Gerador: `correta = A` = **20%**. ✔

---

## 4 — `finDescontoAVista` → "Financiamentos e Prestações"

Preço a prazo `P` vs. à vista `P·(1 − d)`; economia `P·d`. `P` múltiplo de 100
e `d` em % ⇒ economia e à vista inteiros. **Fácil** pede o preço à vista;
**médio** pede a economia em R$; **difícil** (modo inverso) dá o à vista e pede
o preço de tabela `P = à vista / (1 − d)`. Distratores: troca `P·d` ↔ `P·(1−d)`;
somou `P·(1+d)`; sem desconto `P`; desconto aplicado duas vezes.

### 0207 — fácil
"Na loja, um micro-ondas custa R$ 2.000,00 no cartão. Pagando à vista, o cliente
recebe 10% de desconto. Qual é o preço à vista?"

- à vista `= 2000 · (1 − 0,10) = 2000 − 200 = 1.800,00` → **R$ 1.800,00**.
- Distratores: desconto `200,00`; `2000·1,1 = 2.200,00`; `2.000,00`;
  desconto 2× `2000 − 400 = 1.600,00`.
- Gerador: `correta = A` = **R$ 1.800,00**. ✔

### 0208 — médio
"Uma loja anuncia um micro-ondas por R$ 800,00 a prazo e concede 25% de desconto
para pagamento à vista. Quanto o cliente economiza pagando à vista?"

- economia `= 800 · 0,25 = 200,00` → **R$ 200,00**.
- Distratores: à vista `800·0,75 = 600,00`; preço `800,00`; `800·1,25 =
  1.000,00`; desconto sobre já descontado `600·0,25 = 150,00`.
- Gerador: `correta = E` = **R$ 200,00**. ✔

### 0209 — difícil (inverso)
"Pagando à vista, um micro-ondas sai por R$ 3.520,00, valor que já embute um
desconto de 12% sobre o preço de tabela (valor a prazo). Qual é o preço de
tabela?"

- `3520 = (1 − 0,12) · P` ⇒ `P = 3520 / 0,88 = 4.000,00` → **R$ 4.000,00**
  (confere: `4000·0,88 = 3520`; economia `4000·0,12 = 480`).
- Distratores: `3520·1,12 = 3.942,40`; `3520·0,88 = 3.097,60`;
  `4000 + 480 = 4.480,00`; `3520/1,12 = 3.142,86`.
- Gerador: `correta = E` = **R$ 4.000,00**. ✔

---

## 5 — `finParcelamento` → "Financiamentos e Prestações"

Total pago `= E + n·p`; juros embutidos `= (E + n·p) − P_à vista`. **Fácil**:
entrada + parcelas, pede o total pago. **Médio**: entrada + parcelas, pede os
juros embutidos em R$. **Difícil**: sem entrada, pede quanto se paga a mais.
Todos os valores (entrada, parcela, à vista, juros) são múltiplos de 10 por
construção (`P_à vista = total − juros`, `juros` arredondado a múltiplo de 10).
Distratores: esqueceu a entrada `n·p`; ± uma parcela; deu o total no lugar dos
juros (e vice-versa); juros divididos pelas parcelas.

### 0210 — fácil
"No plano parcelado, uma geladeira tem entrada de R$ 300,00 e mais 3 parcelas de
R$ 160,00. Qual é o valor total pago nesse plano?"

- total `= 300 + 3·160 = 300 + 480 = 780,00` → **R$ 780,00**.
- Distratores: sem entrada `480,00`; −1 parcela `300 + 2·160 = 620,00`;
  +1 parcela `300 + 4·160 = 940,00`; subtraiu a entrada `480 − 300 = 180,00`.
- Gerador: `correta = D` = **R$ 780,00**. ✔

### 0211 — médio
"À vista, um sofá retrátil custa R$ 4.640,00. Parcelado, sai por uma entrada de
R$ 100,00 mais 10 prestações de R$ 570,00. Quanto de juros está embutido no
parcelamento?"

- total pago `= 100 + 10·570 = 5.800,00`; juros `= 5800 − 4640 = 1.160,00` →
  **R$ 1.160,00**.
- Distratores: total pago `5.800,00`; à vista `4.640,00`; esqueceu a entrada
  `1160 − 100 = 1.060,00`; juros ÷ parcelas `1160/10 = 116,00`.
- Gerador: `correta = E` = **R$ 1.160,00**. ✔

### 0212 — difícil
"Uma loja vende um sofá retrátil por R$ 3.390,00 à vista ou em 11 parcelas
iguais de R$ 370,00, sem entrada. Quem parcela paga quanto a mais do que quem
compra à vista?"

- total parcelado `= 11·370 = 4.070,00`; a mais `= 4070 − 3390 = 680,00` →
  **R$ 680,00**.
- Distratores: total parcelado `4.070,00`; à vista `3.390,00`; −1 parcela
  `10·370 − 3390 = 310,00`; juros ÷ parcelas `680/11 = 61,82`.
- Gerador: `correta = C` = **R$ 680,00**. ✔

---

### Observação

O helper `pct` do repositório formata decimais com ponto (`33.1%`, `72.8%`,
`12.9%`), não vírgula — comportamento pré-existente, mantido para consistência
com o resto do gerador. Todos os demais valores monetários usam `brl()` (vírgula
decimal, separador de milhar).
