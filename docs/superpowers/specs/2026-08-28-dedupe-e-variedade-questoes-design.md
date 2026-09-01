# Deduplicação e variedade estrutural do banco de questões

**Data:** 2026-08-28
**Status:** aprovado para planejamento

## 1. Problema

Análise questão a questão do banco atual (1.618 questões) revelou dois tipos de repetição:

### 1.1 Duplicatas exatas em `banco.json`

30 grupos de questões com **enunciado literalmente idêntico** (89 questões no total). Na maioria dos grupos a única diferença é a ordem das alternativas — mesma pergunta, mesmos números, mesma resposta. Exemplos:

- `banco-264, banco-265, banco-266, banco-292, banco-293, banco-294, banco-295, banco-296` — 8 cópias de "lucro mensal L(x) = −x² + 60x − 500…"
- `banco-129/130/131/132`, `banco-148/149/151/152` (Progressões) — grupos de 4
- `banco-310..313` (Geom. Espacial), `banco-570..573` (Trigonometria), `banco-455/457/461/462` (Porcentagem) — grupos de 4
- 1 grupo cruza arquivos: `banco-100` é cópia de `enem-2010-176`

Remover, mantendo 1 representante por grupo: **−59 questões** (`banco.json`: 603 → 544; no grupo cross-file mantém-se a questão do ENEM e remove-se `banco-100`).

### 1.2 Repetição estrutural nas questões inéditas

As 746 questões inéditas são geradas por `scripts/generate.mjs`, que percorre em ciclo os moldes de `scripts/templates.mjs` até atingir um alvo por categoria. Só existem **40 moldes** para as 20 categorias. Cada molde tem frase-enunciado fixa e só varia os números (e, em alguns, um substantivo de contexto sorteado de uma lista curta). Resultado: famílias enormes de questões clonadas.

| Exemplo | Nº de questões da mesma estrutura |
|---|--:|
| `matDeterminante` (Matrizes) | 50 de 50 |
| `finJurosCompostos` (Mat. Financeira) | 48 de 48 |
| `trigTrianguloRetangulo` (Trigonometria) | 46 de 46 |
| `expCrescimento` (Exp./Log.) | 28 |
| `combMultiplicativo` (Combinatória) | 27 |
| `regraTresComposta` (Regra de Três) | 26 |

As questões do ENEM oficial (`real.json`, 269) são todas estruturalmente únicas e não entram nesta limpeza.

## 2. Decisões tomadas (com o usuário)

1. **Duplicatas exatas:** remover (manter 1 por grupo). Não vale a pena "alterar" para criar questões novas — é mais limpo deletar.
2. **Inéditas:** reescrever/expandir os moldes para que **nenhuma estrutura apareça mais que 3 vezes**.
3. **Contagem-alvo:** cada categoria deve fechar em **~50 questões no total**, contando ENEM + banco + inéditas. Onde ENEM+banco já passa de 50, a categoria recebe **zero** inéditas.
4. Onde o assunto não comporta ~17 estruturas distintas com qualidade (Matrizes, Conjuntos, Geometria Analítica), aceita-se fechar abaixo de 50 — melhor ter menos questões e todas boas.

## 3. Não-objetivos

- Não mexer em `real.json` (ENEM oficial) além de manter a questão `enem-2010-176` no lugar da cópia `banco-100`.
- Não reescrever as questões de `banco.json` que não são duplicata exata (mesmo as que têm estrutura parecida entre si — são questões reais de bancas, com dados e alternativas próprios).
- Não mudar o schema de `src/lib/types.ts` nem o formato dos JSONs.
- Não adicionar backend nem persistência.

## 4. Arquitetura da solução

Quatro frentes, implementadas em fases (§7):

### 4.1 `banco.json` — remoção de duplicatas exatas

Script único e descartável (`scripts/dedupe-banco.mjs`, ou trecho ad-hoc) que:

1. Carrega `banco.json` e `real.json`.
2. Normaliza enunciado (colapsa espaços, `lower`, remove acentos, unifica `2º`/`2°`) e agrupa.
3. Para cada grupo com > 1 questão em `banco.json`, mantém a de menor `id` e descarta as demais.
4. Remove de `banco.json` qualquer questão cujo enunciado normalizado também exista em `real.json` (caso `banco-100`).
5. Reescreve `banco.json` (mesma formatação, `JSON.stringify(..., 2)`).

Resultado esperado: 603 → 544 questões. Conferir o número e a lista de ids removidos no diff antes de commitar.

### 4.2 `scripts/helpers.mjs` — PRNG com semente

Hoje a geração usa `Math.random()`: cada `node scripts/generate.mjs` embaralha todas as inéditas (novos números, novos ids, novas respostas). Como a Fase 2 roda o gerador muitas vezes, isso polui o histórico e quebra qualquer progresso salvo por id.

Adicionar um PRNG determinístico (mulberry32 ou xorshift) semeado por uma constante (`SEED = 20260828`). `randInt`, `randFloat`, `pick`, `shuffle` passam a consumir esse gerador. `nextId` continua sequencial. Assim, regenerar produz o mesmo banco byte a byte até que um molde mude.

### 4.3 `scripts/generate.mjs` — novo algoritmo de geração

```
META_TOTAL       = 50
MAX_POR_TEMPLATE = 3
DIFICULDADES     = ["facil", "medio", "dificil"]

realLike[cat] = (nº de questões de real.json com categoriaId == cat)
              + (nº de questões de banco.json JÁ DEDUPLICADO com categoriaId == cat)

para cada categoria:
    need = max(0, META_TOTAL - realLike[cat])
    se need == 0:
        grava arquivo com []           # mantém o arquivo para o import de questions.ts
        continua
    saida = []
    para cada template t de TEMPLATES[cat]:
        geradasDoTemplate = 0
        difIdx = 0
        tentativas = 0
        enquanto geradasDoTemplate < MAX_POR_TEMPLATE
                 e saida.length < need
                 e tentativas < 40:
            q = t(DIFICULDADES[difIdx % 3])
            se enunciado de q não colide (dedupeByEnunciado global):
                saida.push(q); geradasDoTemplate++; difIdx++
            tentativas++
    grava saida
    se saida.length < need:
        warn(`${cat}: fechou em ${realLike[cat] + saida.length} (< ${META_TOTAL})`)
```

Notas:
- O teto é **3 questões por molde por categoria** (não 3 por dificuldade). Com 3 dificuldades e teto 3, tende a sair uma fácil, uma média, uma difícil.
- `dedupeByEnunciado` (por categoria, como hoje) continua sendo a rede de segurança contra dois sorteios idênticos do mesmo molde; colisões entre categorias são cobertas pelo `validate-all`.
- `_resumo.json` continua sendo gravado (só o gerador o consome; a UI usa `todasQuestoes.length`).

### 4.4 `scripts/templates.mjs` — expansão de 40 → ~130 moldes

Catálogo em §6. Cada molde novo segue o padrão dos existentes:

- Função `(dificuldade) => makeQuestao({...})`.
- A resposta certa é **calculada em código**; os distratores são erros clássicos calculados (não aleatórios).
- Enunciado em português, contexto estilo ENEM, com pool de 3–5 cenários/substantivos quando fizer sentido.
- `subtopico` **exatamente** igual a um item de `Categoria.subtopicos` em `src/data/categorias.ts`.
- Registrado no objeto `TEMPLATES` no fim do arquivo.
- **Cada molde novo é resolvido à mão** e conferido contra a saída antes de considerar pronto (o `validate.mjs` não checa se a conta está certa).

Categorias que já fecham ≥ 50 com ENEM+banco (**Números, Porcentagem, Razão e Proporção, Equações e Sistemas, Exponenciais e Logaritmos, Geometria Plana**) **não recebem moldes novos** e passam a gerar 0 inéditas. Os moldes atuais dessas categorias permanecem no arquivo (não custam nada e servem de referência), apenas não são exercitados.

### 4.5 Validação — `scripts/validate.mjs` estendido + checagem de `real.json`/`banco.json`

Estender `validate.mjs` (ou criar `scripts/validate-all.mjs`) para cobrir **todos** os arquivos de `src/data/questions/` (não só os sintéticos) e checar:

1. 5 alternativas de texto único por questão (4 são válidas para questões de banca; manter a regra atual só para inéditas, e "4 ou 5" para `banco.json`).
2. `correta` presente entre as letras; letras em ordem `A..E` (ou `A..D`).
3. **IDs únicos em todo o banco.**
4. **Nenhum enunciado normalizado repetido em todo o banco** (inéditas + ENEM + banco).
5. Para inéditas: nº de questões por (categoria) ÷ nº de moldes distintos usados ⇒ nenhuma estrutura > 3 (garantido por construção, mas verificado).
6. `subtopico` de cada inédita pertence a `categorias[cat].subtopicos`.

CI local: `node scripts/generate.mjs && node scripts/validate-all.mjs` deve sair 0.

### 4.6 Ajustes na aplicação

- `src/components/Sidebar.tsx:60` — hoje diz `1500+ questões` (já era aspiracional; o banco tem 1.618 e cairá para ~900 após a Fase 1). Trocar por um número honesto ou, melhor, tornar dinâmico a partir de `todasQuestoes.length` (arredondado para baixo à centena, sufixo `+`).
- `src/app/assuntos/page.tsx` e `src/app/aleatoria/page.tsx` já usam `todasQuestoes.length` — atualizam sozinhos.
- Rodar `npm run build` ao final de cada fase para garantir que os imports de `questions.ts` seguem resolvendo (arquivos com `[]` são válidos).

## 5. Estado-alvo por categoria

`realLike` = ENEM + banco após dedupe. `need` = questões inéditas a gerar. `moldes-alvo` = quantos moldes a categoria precisa ter para cobrir `need` com teto 3.

| Categoria | ENEM | banco | realLike | need p/ 50 | moldes hoje | moldes-alvo | moldes novos | total real |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| Números | 33 | 98 | 131 | 0 | 2 | — | 0 | 131 |
| Porcentagem | 46 | 25 | 71 | 0 | 2 | — | 0 | 71 |
| Razão e Proporção | 49 | 8 | 57 | 0 | 2 | — | 0 | 57 |
| Equações e Sistemas | 8 | 68 | 76 | 0 | 2 | — | 0 | 76 |
| Exponenciais e Logaritmos | 8 | 42 | 50 | 0 | 2 | — | 0 | 50 |
| Geometria Plana | 15 | 47 | 62 | 0 | 2 | — | 0 | 62 |
| Regra de Três | 5 | 35 | 40 | 10 | 2 | 4 | +2 | 50 |
| Progressões | 7 | 37 | 44 | 6 | 2 | 2 | 0 | 50 |
| Estatística | 23 | 21 | 44 | 6 | 5 | 5 | 0 | 50 |
| Geometria Espacial | 23 | 17 | 40 | 10 | 6 | 6 | 0 | 50 |
| Trigonometria | 4 | 30 | 34 | 16 | 1 | 6 | +5 | 50 |
| Matemática Financeira | 2 | 30 | 32 | 18 | 1 | 6 | +5 | 50 |
| Função Afim | 11 | 15 | 26 | 24 | 2 | 8 | +6 | 50 |
| Lógica e Raciocínio | 6 | 17 | 23 | 27 | 2 | 9 | +7 | 50 |
| Probabilidade | 11 | 16 | 27 | 23 | 2 | 8 | +6 | 50 |
| Análise Combinatória | 9 | 16 | 25 | 25 | 2 | 9 | +7 | 50 |
| Função Quadrática | 4 | 12 | 16 | 34 | 2 | 12 | +10 | 50 |
| Geometria Analítica | 4 | 3 | 7 | 43 | 2 | 15 | +13 | 50 |
| Conjuntos | 1 | 3 | 4 | 46 | 2 | 16 | +14 | 49 |
| Matrizes e Determinantes | 0 | 4 | 4 | 46 | 1 | 17 | +16 | 50 |
| **Total** | | | | | **40** | **~132** | **~92** | **1146** |

Resultado real: Matrizes e Geometria Analítica fecharam em **50**. Conjuntos fechou em **49** (uma questão a menos) porque o catálogo de estruturas distintas se esgotou antes — dentro da tolerância de 35–45 prevista para essas categorias. Os números reais atingidos por categoria estão na coluna `total real` acima e no `_resumo.json`.

## 6. Catálogo de moldes novos

Padrão de cada item: **`nomeDoMolde`** — estrutura / conta. Moldes marcados *(existe)* já estão no arquivo.

### Regra de Três (+2)
- **`regraTresVelocidade`** — grandezas inversamente proporcionais: veículo a `v₁` km/h leva `t₁` h; a `v₂` km/h leva `t = v₁·t₁/v₂`.
- **`regraTresTorneiras`** — `n` torneiras enchem um tanque em `t` min; `m` torneiras enchem em `t·n/m` (inversa).

### Trigonometria (+5) — usa a tabela `ANGULOS` já existente
- `trigTrianguloRetangulo` *(existe)* — altura de torre pela tangente.
- **`trigRampa`** — comprimento `c` da rampa e ângulo `θ`: altura `= c·sen θ`.
- **`trigSombra`** — poste de altura `h`, sol a `θ` de elevação: sombra `= h/tan θ`.
- **`trigEscada`** — escada de `L` m encostada, ângulo `θ` com o chão: altura alcançada `= L·sen θ` (ou distância da base `= L·cos θ`).
- **`trigLeiSenos`** — triângulo com ângulos `Â`, `B̂` e lado `a`: `b = a·sen B̂ / sen Â` (usar pares da tabela que dão contas limpas).
- **`trigLeiCossenos`** — lados `b`, `c` e ângulo `Â` entre eles: `a = √(b² + c² − 2bc·cos Â)` (escolher `b`, `c`, `Â` que fecham em raiz exata).

### Matemática Financeira (+5)
- `finJurosCompostos` *(existe)*.
- **`finJurosSimples`** — financiamento: `J = C·i·t`, montante `C + J` (contexto de crédito, distinto do de Porcentagem).
- **`finValorPresente`** — quanto aplicar hoje a `i%` compostos para ter `M` em `t` períodos: `C = M/(1+i)^t` (escolher M múltiplo de `(1+i)^t`).
- **`finTaxaEquivalente`** — taxa `i` ao mês ⇒ ao bimestre/trimestre: `(1+i)^k − 1` (k pequeno, i "redondo").
- **`finDescontoAVista`** — preço `P` parcelado vs. `P·(1−d)` à vista: economia em R$ ou o valor à vista.
- **`finParcelamento`** — entrada `E` + `n` parcelas de `p`: total pago `E + n·p` e "juros" `= total − preço à vista`.

### Função Afim (+6)
- `afimTarifa` *(existe)*, `afimCoeficiente` *(existe)*.
- **`afimRaiz`** — `f(x) = ax + b`: valor de `x` com `f(x) = 0` ⇒ `−b/a` (escolher `a | b`).
- **`afimDepreciacao`** — máquina vale `V₀`, perde `d` por ano: `V(t) = V₀ − d·t`; pede `V(t)` ou o `t` em que `V = k`.
- **`afimConversaoTemperatura`** — `F = 9C/5 + 32`; converte C→F ou F→C (C múltiplo de 5).
- **`afimComissao`** — salário `fixo + p%·vendas`; dado o total, achar as vendas, ou vice-versa.
- **`afimPontoEquilibrio`** — planos `A: f + a·x` e `B: g + b·x`; `x` em que se igualam ⇒ `(f−g)/(b−a)`.
- **`afimValorPrevisto`** — dados dois pontos `(x₁,y₁)`, `(x₂,y₂)` de uma reta, achar `y` para um `x₃` (monta `a` e `b` e substitui).

### Lógica e Raciocínio (+7)
- `logSequencia` *(existe)*, `logRaciocinioIdade` *(existe)*.
- **`logSequenciaSegundaOrdem`** — diferenças em PA (ex.: `1, 3, 6, 10, 15, …`) ou Fibonacci; próximo termo.
- **`logNumeroPensado`** — "pensei num número, `×a`, `+b`, `÷c` … deu `R`"; desfazer operações.
- **`logTorneio`** — `n` times, todos contra todos, 1 turno ⇒ `C(n,2)` jogos (2 turnos ⇒ `n(n−1)`).
- **`logCalendario`** — hoje é `<dia>`; daqui a `N` dias é `(offset + N) mod 7`.
- **`logNegacao`** — negação de "todo A é B" / "existe A que é B" / "p e q" (De Morgan) — pool de proposições, alternativas textuais fixas.
- **`logCondicional`** — dada `p → q`, identificar a contrapositiva `¬q → ¬p` entre as alternativas.
- **`logComparacaoTransitiva`** — "A é mais velho que B, B que C, C que D…"; ordenar / quem é o k-ésimo.

### Probabilidade (+6)
- `probSimples` *(existe)*, `probSucessiva` *(existe, sem reposição)*.
- **`probComReposicao`** — 2 retiradas COM reposição: `(a/n)²` (eventos independentes).
- **`probComplementar`** — `P(pelo menos um) = 1 − P(nenhum)` em `k` tentativas.
- **`probUniaoExclusiva`** — dado/carta: `P(A ∪ B) = P(A) + P(B)` para eventos mutuamente exclusivos.
- **`probDoisDados`** — soma dos dois dados igual a `s` / soma par / máximo `> k` (espaço amostral 36).
- **`probBaralho`** — 1 carta de 52: naipe, figura, "carta de copas ou um rei" (`13/52 + 4/52 − 1/52`).
- **`probTabelaContingencia`** — tabela 2×2 (ex.: gênero × preferência); `P(A)`, `P(A ∩ B)` ou `P(A | B)`.

### Análise Combinatória (+7)
- `combMultiplicativo` *(existe)*, `combComissao` *(existe, combinação)*.
- **`combPermutacaoSimples`** — `n` pessoas em fila ⇒ `n!`.
- **`combPermutacaoCircular`** — `n` pessoas numa mesa redonda ⇒ `(n−1)!`.
- **`combArranjo`** — pódio / senha de `k` dígitos distintos entre `n` ⇒ `A(n,k) = n!/(n−k)!`.
- **`combComRepeticao`** — placas/senhas de `k` posições, `m` símbolos, repetição livre ⇒ `mᵏ`.
- **`combAnagramas`** — anagramas de palavra sem letras repetidas ⇒ `n!` (com uma letra dupla ⇒ `n!/2!`).
- **`combComissaoRestricao`** — comissão de `k` com `x` de um grupo de `a` e `y` de outro de `b` ⇒ `C(a,x)·C(b,y)`.
- **`combSubconjuntos`** — nº de subconjuntos de conjunto com `n` elementos ⇒ `2ⁿ`.

### Função Quadrática (+10)
- `quadVertice` *(existe)*, `quadTrajetoria` *(existe)*.
- **`quadLucroMaximo`** — `L(x) = −ax² + bx − c`; valor do lucro máximo = `L` no vértice (`y_v = −Δ/4a`).
- **`quadRaizesContexto`** — quando o lucro/altura é zero: raízes de `ax² + bx + c` (usar coeficientes com Δ quadrado perfeito).
- **`quadSomaProdutoRaizes`** — Girard: `S = −b/a`, `P = c/a`.
- **`quadAreaCercado`** — `P` m de tela, retângulo com um lado numa parede: área máx `= P²/8`.
- **`quadDoisNumeros`** — soma `S` fixa, produto máximo ⇒ ambos `S/2`, produto `S²/4`.
- **`quadAlcanceProjetil`** — `h(t) = −at² + bt`; alcance/tempo de voo = raiz positiva `b/a`.
- **`quadAlturaNoInstante`** — `h(t)` dada, calcular `h(t₀)` para `t₀` específico.
- **`quadVerticeCoordenadas`** — `y = ax² + bx + c`; coordenadas `(x_v, y_v)` do vértice.
- **`quadArcoParabolico`** — arco/ponte modelado por parábola; altura a `d` metros do centro.
- **`quadCustoMinimo`** — `C(x) = ax² − bx + c`; `x` que minimiza (`b/2a`) ou custo mínimo.

### Geometria Analítica (+13)
- `geoDistanciaPontos` *(existe)*, `geoEquacaoReta` *(existe)*.
- **`gaPontoMedio`** — ponto médio de `AB` = `((x₁+x₂)/2, (y₁+y₂)/2)`.
- **`gaDistanciaOrigem`** — `|OP| = √(x² + y²)` (usar ternos pitagóricos).
- **`gaCoefAngularDoisPontos`** — `m = (y₂−y₁)/(x₂−x₁)`.
- **`gaEquacaoRetaPorDoisPontos`** — achar `n` (linear) de `y = mx + n` dados dois pontos.
- **`gaParalelaPerpendicular`** — coef. angular de reta paralela (`m`) ou perpendicular (`−1/m`) a uma dada.
- **`gaInterseccaoRetas`** — ponto comum a `y = m₁x + n₁` e `y = m₂x + n₂` (sistema 2×2).
- **`gaCircunferenciaCentroRaio`** — de `(x−a)² + (y−b)² = r²` extrair centro/raio, ou montar a equação.
- **`gaCircunferenciaGeralParaReduzida`** — `x² + y² + Dx + Ey + F = 0` ⇒ centro `(−D/2, −E/2)`, `r = √(D²/4 + E²/4 − F)` (escolher D, E, F que fecham).
- **`gaPontoNaCircunferencia`** — dado centro, raio e ponto: dentro / sobre / fora (comparar distância² com r²).
- **`gaAreaTrianguloVertices`** — área `= |det|/2` com os 3 vértices.
- **`gaAlinhamento`** — achar `k` que alinha três pontos (`det = 0`).
- **`gaSimetrico`** — simétrico de `P` em relação à origem / eixo x / eixo y.
- **`gaBaricentro`** — baricentro do triângulo = média dos três vértices.
- **`gaDistanciaPontoReta`** — `|ax₀ + by₀ + c| / √(a² + b²)` (coeficientes e ponto escolhidos p/ raiz limpa).

### Conjuntos (+14)
- `conjDoisConjuntos` *(existe, 3 modos)*, `conjDiferenca` *(existe)*.
- **`conjUniaoDeInterseccao`** — dados `|A|`, `|B|`, `|A ∩ B|` ⇒ `|A ∪ B| = |A| + |B| − |A ∩ B|` (e a recíproca).
- **`conjComplementar`** — `|U|`, `|A|` ⇒ `|Aᶜ| = |U| − |A|`.
- **`conjTresConjuntos`** — Venn de 3, inclusão-exclusão; modos: achar "só A", achar o centro `|A∩B∩C|`, achar o total.
- **`conjTresConjuntosEsporte`** — mesmo esqueleto de 3 conjuntos, contexto "praticam futebol/vôlei/basquete".
- **`conjOperacoesExplicitas`** — `A = {…}`, `B = {…}` listados; achar `A ∩ B` / `A ∪ B` / `A − B` (contar elementos).
- **`conjDiferencaSimetrica`** — `A △ B = (A − B) ∪ (B − A)`; contar.
- **`conjProdutoCartesiano`** — `|A × B| = |A|·|B|`.
- **`conjSubconjuntos`** — `2ⁿ` subconjuntos; `2ⁿ − 1` próprios; `2ⁿ − 2` não triviais.
- **`conjIntervalosReais`** — `[a, b] ∩ [c, d]` e `[a, b] ∪ [c, d]`; descrever o resultado.
- **`conjMultiplos`** — múltiplos de `p` OU de `q` até `N`: `⌊N/p⌋ + ⌊N/q⌋ − ⌊N/mmc(p,q)⌋`.
- **`conjTresLinguas`** — clássico inglês/espanhol/francês com "ambos", "os três", "nenhuma".
- **`conjPesquisaProduto`** — "compraram o produto X, Y, Z"; 3 conjuntos, achar quem comprou exatamente um.
- **`conjDivisores`** — conjunto dos divisores de `n`: quantos, quantos são pares, interseção com divisores de `m` (= divisores do `mdc`).

### Matrizes e Determinantes (+16)
- `matDeterminante` *(existe, 2×2)*.
- **`matDeterminante3x3`** — regra de Sarrus (entradas pequenas).
- **`matSoma`** — `A + B`; pede um elemento `cᵢⱼ`.
- **`matSubtracao`** — `A − B`; pede um elemento.
- **`matEscalar`** — `k·A`; pede um elemento.
- **`matProduto`** — `A·B` (2×2); pede `cᵢⱼ = Σ aᵢₖ bₖⱼ`.
- **`matTransposta`** — `Aᵀ`; pede `aᵀᵢⱼ = aⱼᵢ`.
- **`matTraco`** — soma da diagonal principal.
- **`matIgualdade`** — `A = B` elemento a elemento ⇒ resolver `x`, `y`.
- **`matLeiDeFormacao`** — `aᵢⱼ = f(i, j)` (ex.: `2i − j`); construir/achar elemento.
- **`matSimetrica`** — condição `aᵢⱼ = aⱼᵢ` ⇒ achar `x`.
- **`matPotencia`** — `A²` (2×2); pede um elemento.
- **`matInversa`** — `A⁻¹ = (1/det)·[[d, −b], [−c, a]]` com `det` simples (±1, ±2); pede um elemento.
- **`matDeterminanteComIncognita`** — `det(A) = 0` ⇒ achar `x`.
- **`matCramer`** — sistema 2×2 resolvido por determinantes: `x = Dₓ/D`.
- **`matFaturamento`** — matriz de quantidades × vetor de preços = faturamento (produto matricial contextualizado).
- **`matIdentidadePropriedade`** — `A·I = A`, `I` de ordem `n`; identificar/produzir.

## 7. Fases de implementação

Cada fase termina com `node scripts/generate.mjs && node scripts/validate-all.mjs && npm run build` verdes, e um commit.

**Fase 1 — limpeza e infraestrutura (sem moldes novos)**
1. `scripts/dedupe-banco.mjs` + rodar → `banco.json` 603→544. Conferir ids removidos.
2. PRNG com semente em `helpers.mjs`.
3. Novo algoritmo em `generate.mjs` (conta banco, teto 3, categorias cheias → `[]`).
4. `validate-all.mjs` (todos os arquivos, ids únicos, enunciado único global).
5. Regenerar. Resultado: ~85 inéditas, banco total ~900. Nenhuma estrutura > 3.
6. Ajustar contagem no `Sidebar.tsx`.
7. Commit: "Remove duplicatas de banco.json e limita inéditas a 3 por estrutura".

**Fases 2+ — expansão de moldes, uma categoria (ou par) por commit**, na ordem de maior carência:
- 2: Matrizes (+16)
- 3: Conjuntos (+14)
- 4: Geometria Analítica (+13)
- 5: Função Quadrática (+10)
- 6: Lógica (+7), Combinatória (+7)
- 7: Função Afim (+6), Probabilidade (+6)
- 8: Trigonometria (+5), Matemática Financeira (+5)
- 9: Regra de Três (+2)

Cada uma: escrever os moldes, resolver à mão 1 exemplo de cada, `generate` + `validate-all` + `build`, commit "Adiciona N moldes de <categoria>".

## 8. Riscos

| Risco | Mitigação |
|---|---|
| Conta errada num molde novo (o validador não pega) | Resolver à mão um exemplo de cada molde e comparar com a saída antes do commit da fase. |
| Matrizes/Conjuntos/Geo. Analítica não chegam a 50 | Aceito por decisão §2.4; registrar o número real. |
| Distratores colidindo com a resposta (cai no fallback genérico de `helpers`) | `validate-all` sinaliza "Nenhuma das alternativas anteriores" em excesso; ajustar distratores do molde. |
| Regeneração muda ids e quebra progresso salvo por id no `localStorage` | PRNG semeado estabiliza a saída; a Fase 1 é a última grande mudança de ids. |
| `banco.json` tem grupo "quase idêntico" que o normalizador não pega | Revisão manual do diff da Fase 1; o critério é enunciado **idêntico**, não parecido. |

## 9. Definição de pronto

- `banco.json` sem dois enunciados idênticos; sem enunciado que também exista em `real.json`.
- `node scripts/validate-all.mjs` sai 0: ids únicos, nenhum enunciado repetido em todo o banco, alternativas válidas.
- Nenhuma estrutura de questão inédita aparece mais de 3 vezes.
- Toda categoria com `realLike < 50` tende a ~50 (ou ao máximo que o catálogo de estruturas permite, documentado).
- `npm run build` verde; contagem exibida na UI condiz com `todasQuestoes.length`.
