# Verificação manual — 2 moldes novos de "Regra de Três"

Task 14 / Fase 9 do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/regra-de-tres.json` por `node scripts/generate.mjs`
(ids `regra-de-tres-ined-0001` … `-0010`). Para cada molde novo: enunciado como
ficou no arquivo, resolução independente e a alternativa que o gerador marcou
`correta`. Devem concordar.

`TEMPLATES["regra-de-tres"]` = `[regraTresSimples, regraTresComposta,
regraTresVelocidade, regraTresTorneiras]` (4 moldes). `need` = 50 − realLike 40 =
**10**. O preenchimento é sequencial com teto 3 por molde: `regraTresSimples` 3 +
`regraTresComposta` 3 + `regraTresVelocidade` 3 + `regraTresTorneiras` 1 = 10.
Portanto `regraTresVelocidade` emite as 3 dificuldades e `regraTresTorneiras`
emite só a **fácil**. `regra-de-tres` fecha em **total 50** (real 5 + banco 35 +
inéditas 10).
`_resumo.json`:
`{"categoriaId":"regra-de-tres","real":5,"banco":35,"realLike":40,"inedita":10,"total":50}`.

**Resultado: 4/4 questões novas gravadas conferidas — a resolução independente
bate com a alternativa `correta` do gerador em todas.**
`node scripts/validate-all.mjs` sai 0 (1146 questões, 1146 enunciados únicos, 0
erros). `node --test scripts/rng.test.mjs` → 5/5. `npm run build` compila.

## Moldes pré-existentes (contexto) — `regraTresSimples`, `regraTresComposta`

| id | Molde / dif | Cálculo | Gerador |
|----|-------------|---------|---------|
| 0001–0003 | `regraTresSimples` (farinha, direta) | `x = ingr₁ · pessoas₂ / pessoas₁` | inalterado |
| 0004–0006 | `regraTresComposta` (operários × peças × dias) | `dias = (peças₂ · op₁ · dias₁) / (peças₁ · op₂)` | inalterado |

Os ids/parâmetros de 0001–0006 não mudaram: `regraTresVelocidade` e
`regraTresTorneiras` foram acrescentados **depois** desses dois moldes no array,
então o fluxo do PRNG até o fim do bloco `regra-de-tres` só é consumido a mais
pelas questões 0007–0010. Categorias 1–3 (numeros, porcentagem, razao-proporcao)
não mudaram; categorias 5–20 regeneram (deslocamento do PRNG — esperado).

---

## 1 — `regraTresVelocidade` → "Regra de Três Simples"

Grandezas **inversamente proporcionais** (distância fixa): um veículo a `v₁` km/h
faz o percurso em `t₁` h; a `v₂` km/h faz em `t₂ = v₁ · t₁ / v₂`. Cenários
escolhidos por dificuldade de modo que `t₂` seja inteiro. Distratores calculados:
proporção **direta** `t₁ · v₂ / v₁`; tempo mantido `t₁`; ajuste para o lado errado
`2·t₁ − t₂`; tempo dobrado `2·t₁`.

### 0007 — fácil
"Um carro percorre um trajeto em 6 horas viajando a uma velocidade média de
120 km/h. Mantido o mesmo trajeto, em quanto tempo passará a fazer o percurso com
velocidade média de 80 km/h?"

- Inversa: `v₁·t₁ = v₂·t₂` ⇒ `t₂ = 120 · 6 / 80 = 720 / 80 = 9` → **9 h**.
- Distratores: direta `6 · 80 / 120 = 4 h`; mantido `6 h`; lado errado
  `2·6 − 9 = 3 h`; dobrado `2·6 = 12 h`.
- Gerador: `correta = A` = **9 h**. ✔

### 0008 — médio
"Um motorista costuma cumprir o percurso da rota de entrega em 12 h dirigindo a
80 km/h, em média. Sem alterar a distância, quanto tempo levará se a velocidade
média passar a ser de 60 km/h?"

- `t₂ = 80 · 12 / 60 = 960 / 60 = 16` → **16 h**.
- Distratores: direta `12 · 60 / 80 = 9 h`; mantido `12 h`; lado errado
  `2·12 − 16 = 8 h`; dobrado `24 h`.
- Gerador: `correta = A` = **16 h**. ✔

### 0009 — difícil
"O setor de logística estima que um veículo de carga leva 18 h para ligar o
centro de distribuição a uma filial, a uma velocidade média de 90 km/h. Por causa
de novas condições na rodovia, a velocidade média de todo o percurso passará a
60 km/h. Nessa nova situação, quanto tempo o trajeto exigirá?"

- `t₂ = 90 · 18 / 60 = 1620 / 60 = 27` → **27 h**.
- Distratores: direta `18 · 60 / 90 = 12 h`; mantido `18 h`; lado errado
  `2·18 − 27 = 9 h`; dobrado `36 h`.
- Gerador: `correta = A` = **27 h**. ✔

---

## 2 — `regraTresTorneiras` → "Regra de Três Simples"

Grandezas **inversamente proporcionais** (volume fixo): `n` torneiras iguais
enchem em `t` min; `m` torneiras iguais enchem em `x = n · t / m`. Cenários
escolhidos de modo que `x` seja inteiro. Distratores calculados: proporção
**direta** `t · m / n`; tempo mantido `t`; ajuste para o lado errado `2·t − x`;
subtração aditiva `x − (m − n)` (1 min por torneira a mais).

Só a dificuldade **fácil** é emitida (o teto de 10 questões da categoria é
atingido na 1ª questão deste molde).

### 0010 — fácil
"4 torneiras iguais, abertas ao mesmo tempo, enchem um reservatório em
30 minutos. Usando 6 dessas mesmas torneiras, em quanto tempo ele ficará cheio?"

- Inversa: `n·t = m·x` ⇒ `x = 4 · 30 / 6 = 120 / 6 = 20` → **20 min**.
- Distratores: direta `30 · 6 / 4 = 45 min`; mantido `30 min`; lado errado
  `2·30 − 20 = 40 min`; aditivo `20 − (6 − 4) = 18 min`.
- Gerador: `correta = C` = **20 min**. ✔

---

### Observação

`regraTresVelocidade` e `regraTresTorneiras` calculam a resposta em código
(`(v1 * t1) / v2` e `(n * t) / m`), sem `Math.random`/`Date`/`performance.now`;
os sorteios usam apenas `pick` sobre pools de cenários curados, e cada função tem
o mesmo backstop de recursão (`tentativa < 40` se as 5 alternativas colidirem)
usado por `trigRampa`/`finJurosSimples`. Nenhuma função pré-existente foi
alterada.
