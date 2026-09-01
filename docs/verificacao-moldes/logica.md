# Verificação manual — 7 moldes novos de "Lógica e Raciocínio"

Task 11a / Fase 6 (parte 1) do plano `2026-08-28-dedupe-e-variedade-questoes`.

Método: as linhas abaixo são as **questões efetivamente gravadas** em
`src/data/questions/logica.json` pelo pipeline `node scripts/generate.mjs`
(ids `logica-ined-0176` … `-0202`). Para cada uma: enunciado como ficou no
arquivo, resolução independente, e a letra + texto que o gerador marcou `correta`.
Devem concordar.

`TEMPLATES.logica` = `[logSequencia, logRaciocinioIdade, logSequenciaSegundaOrdem,
logNumeroPensado, logTorneio, logCalendario, logNegacao, logCondicional,
logComparacaoTransitiva]` → 9 moldes × teto 3 = 27 inéditas; realLike 23 → total **50**.

Os ids `0176`–`0181` são dos 2 moldes pré-existentes (`logSequencia`,
`logRaciocinioIdade`), incluídos aqui só para contexto. Os 7 moldes novos são
`0182`–`0202`.

**Resultado: 27/27 questões gravadas conferidas — a resolução independente bate
com a alternativa `correta` do gerador em todas.** `node scripts/validate-all.mjs`
sai 0 (1060 questões, 1060 enunciados únicos, 0 erros); nenhuma estrutura repete
mais de 3× (`logica.json` tem no máximo 3 por skeleton); 5 alternativas distintas
por questão, sem placeholder.

## Moldes pré-existentes (contexto)

| id | Molde / dif | Enunciado (resumo) | Resolução | Gerador |
|----|-------------|--------------------|-----------|---------|
| 0176 | `logSequencia` facil | 7, 21, 63, 189, 567, … (razão 3) | 567·3 = **1701** | E) 1701 ✓ |
| 0177 | `logSequencia` medio | 5, 15, 45, 135, 405, … (razão 3) | 405·3 = **1215** | D) 1215 ✓ |
| 0178 | `logSequencia` dificil | 7, 15, 23, 31, 39, … (+8) | 39+8 = **47** | D) 47 ✓ |
| 0179 | `logRaciocinioIdade` facil | pai 34, filho 9, +2 anos | 36 e 11 | E) 36 e 11 anos ✓ |
| 0180 | `logRaciocinioIdade` medio | pai 40, filho 15, +7 anos | 47 e 22 | C) 47 e 22 anos ✓ |
| 0181 | `logRaciocinioIdade` dificil | pai 36, filho 9, +10 anos | 46 e 19 | E) 46 e 19 anos ✓ |

## 1 — `logSequenciaSegundaOrdem` → "Sequências e Padrões"

Diferenças em PA (fácil/médio) ou regra de Fibonacci (difícil); pedir o próximo termo.

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0182 | facil | Sequência 1, 4, 10, 19, 31; diferenças 3, 6, 9, 12 (aumentam de 3 em 3); próximo termo | Próxima diferença = 12+3 = 15; 31 + 15 = **46** | D) 46 ✓ |
| 0183 | medio | Sequência 5, 9, 17, 29, 45; a diferença cresce sempre 4; próximo termo | Diferenças 4, 8, 12, 16 → próxima 20; 45 + 20 = **65** | A) 65 ✓ |
| 0184 | dificil | Cada termo é a soma dos dois anteriores; primeiros: 4, 7, 11, 18, 29; sexto termo | 18 + 29 = **47** | E) 47 ✓ |

Distratores conferidos distintos da resposta: 0182 {43, 34, 49, 62}; 0183 {61, 49, 69, 90}; 0184 {40, 58, 36, 69}.

## 2 — `logNumeroPensado` → "Problemas de Raciocínio"

Desfazer operações na ordem inversa; parâmetros escolhidos para manter todo passo inteiro.

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0185 | facil | ×4, depois +22, obtendo 58 | (58 − 22) ÷ 4 = 36 ÷ 4 = **9** | E) 9 ✓ |
| 0186 | medio | ×2, depois −12, chegando a 2 | (2 + 12) ÷ 2 = 14 ÷ 2 = **7** | D) 7 ✓ |
| 0187 | dificil | +8, depois ×3, depois −13, chegando a 62 | (62 + 13) ÷ 3 − 8 = 75 ÷ 3 − 8 = 25 − 8 = **17** | B) 17 ✓ |

Distratores conferidos distintos da resposta: 0185 {36, 144, 31, 58}; 0186 {14, 28, 2, −10}; 0187 {25, 67, 75, 33}.

## 3 — `logTorneio` → "Problemas de Raciocínio"

Todos contra todos: 1 turno ⇒ C(n,2) = n(n−1)/2; turno e returno ⇒ n(n−1).

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0188 | facil | 5 equipes, turno único | C(5,2) = 5·4/2 = **10** | E) 10 ✓ |
| 0189 | medio | 8 equipes, turno único | C(8,2) = 8·7/2 = **28** | E) 28 ✓ |
| 0190 | dificil | 9 equipes, turno e returno | 9·8 = **72** (= 2 × C(9,2) = 2 × 36) | E) 72 ✓ |

Distratores conferidos distintos da resposta: 0188 {20, 15, 4, 25}; 0189 {7, 36, 56, 64}; 0190 {36, 90, 16, 81}.

## 4 — `logCalendario` → "Problemas de Raciocínio"

Hoje é `<dia>`; daqui a N dias ⇒ `dias[(hoje + N) mod 7]`.

| id | dif | Enunciado (como gravado) | Resolução independente | Gerador |
|----|-----|--------------------------|------------------------|---------|
| 0191 | facil | quinta-feira, faltam 12 dias | 12 mod 7 = 5; quinta +5 = sex, sáb, dom, seg, **terça-feira** | B) terça-feira ✓ |
| 0192 | medio | quinta-feira, faltam 68 dias | 68 mod 7 = 5; quinta +5 = **terça-feira** | E) terça-feira ✓ |
| 0193 | dificil | quinta-feira, faltam 330 dias | 330 mod 7 = 1; quinta +1 = **sexta-feira** | A) sexta-feira ✓ |

Distratores conferidos distintos da resposta (off-by-one no mod, ignorar offset, contar para trás): 0191 {quarta, segunda, sexta, sábado}; 0192 {quarta, segunda, sexta, sábado}; 0193 {sábado, quinta, segunda, quarta}.

## 5 — `logNegacao` → "Proposições Lógicas" (alternativas textuais)

| id | dif | Proposição (como gravado) | Negação correta (independente) | Gerador |
|----|-----|---------------------------|--------------------------------|---------|
| 0194 | facil | "Todos os candidatos inscritos enviaram os documentos." | ∃ um que não enviou: **"Pelo menos um candidato inscrito não enviou os documentos."** | E ✓ |
| 0195 | medio | "Algum morador do bairro usa transporte público." | ¬∃: **"Nenhum morador do bairro usa transporte público."** | D ✓ |
| 0196 | dificil | "João foi aprovado no vestibular e ganhou a bolsa de estudos." | De Morgan: **"João não foi aprovado no vestibular ou não ganhou a bolsa de estudos."** | C ✓ |

Distratores = confusões clássicas, todas presentes e distintas:
- 0194: "Nenhum … enviou" (super-negação), "Todos … não enviaram" (negação universal), "Pelo menos um … enviou" (predicado não negado), "Nenhum … não enviou" (dupla negação = repete a original).
- 0195: "Algum … não usa" (nega só o predicado), "Todos … usam", "Nem todos … usam" (= algum não), "Existe exatamente um …".
- 0196: "¬p e ¬q" (mantém o "e"), "p ou q" (só troca conectivo), "¬p ou q" e "p ou ¬q" (nega só um termo).

## 6 — `logCondicional` → "Proposições Lógicas" (alternativas textuais)

Dada `p → q`, identificar a contrapositiva `¬q → ¬p`.

| id | dif | Condicional (como gravado) | Contrapositiva correta (independente) | Gerador |
|----|-----|----------------------------|---------------------------------------|---------|
| 0197 | facil | "Se a lâmpada está acesa, então há energia elétrica na casa." | **"Se não há energia elétrica na casa, então a lâmpada não está acesa."** | C ✓ |
| 0198 | medio | "Se chove, então a rua fica molhada." | **"Se a rua não fica molhada, então não chove."** | A ✓ |
| 0199 | dificil | "Se hoje é feriado, então o banco não abre." | ¬q = "o banco abre", ¬p = "hoje não é feriado" → **"Se o banco abre, então hoje não é feriado."** | A ✓ |

Distratores = recíproca (`q → p`), inversa (`¬p → ¬q`), a própria condicional (`p → q`), e "p e ¬q" — todos presentes e distintos em cada questão.

## 7 — `logComparacaoTransitiva` → "Problemas de Raciocínio"

Encadear comparações; pedir a ordenação completa ou quem ocupa a k-ésima posição.

| id | dif | Pistas (como gravado) | Cadeia / resposta independente | Gerador |
|----|-----|-----------------------|--------------------------------|---------|
| 0200 | facil | Hugo > Carla; Diego > Bruno; Bruno > Hugo (altura) | Diego > Bruno > Hugo > Carla → **"Diego, Bruno, Hugo, Carla"** | E ✓ |
| 0201 | medio | Carla > Ana; Elisa > Carla; Diego > Gabi; Ana > Diego (altura); 3ª posição | Elisa > Carla > Ana > Diego > Gabi → 3ª = **Ana** | D ✓ |
| 0202 | dificil | Elisa > Fábio; Gabi > Hugo; Hugo > Carla; Carla > Elisa (idade) | Gabi > Hugo > Carla > Elisa > Fábio → **"Gabi, Hugo, Carla, Elisa, Fábio"** | A ✓ |

Distratores para a ordenação completa (0200, 0202): inversa, troca dos 2 primeiros, troca dos 2 últimos, rotação — todos permutações distintas da correta. Para 0201: o 1º, o último, o 2º e o 4º colocados — distintos do 3º.
