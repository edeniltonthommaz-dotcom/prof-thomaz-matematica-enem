<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Prof. Thomaz — Matemática ENEM

Next.js (App Router, TypeScript, Tailwind) app: banco de questões de Matemática
do ENEM organizado por assunto (20 categorias) e dificuldade (fácil/médio/difícil),
com correção interativa (responder → feedback certo/errado → explicação → gabarito).

## Comandos

- `npm run dev` — dev server (usar `-- -p <porta>` para trocar a porta)
- `npm run build` / `npm start` — build e serve de produção
- `node scripts/generate.mjs` — regenera as questões inéditas (programáticas) em `src/data/questions/*.json`
- `node scripts/validate.mjs` — valida integridade do banco (5 alternativas únicas por questão, gabarito válido)

## Dados

- `src/data/categorias.ts` — as 20 categorias (id, subtópicos, peso na prova)
- `src/data/questions/*.json` — um arquivo por categoria com questões **inéditas** geradas por `scripts/templates.mjs`
  (motor determinístico: cada template calcula a resposta certa em código, não por IA, para garantir que a matemática esteja correta)
- `src/data/questions/real.json` — questões **reais** de provas passadas do ENEM (254 questões), com `fonte.tipo: "enem"`, `fonte.ano` e `fonte.url` apontando para o PDF oficial do INEP (download.inep.gov.br) usado na transcrição. Cobertura: 2009 a 2025 (2º dia, prova regular / 1ª aplicação), incluindo 2021 (recuperado via renderização de imagem, ver abaixo). Distribuição por categoria é desigual porque reflete a frequência real de cada assunto nas provas — categorias muito cobradas (Razão e Proporção: 51, Porcentagem: 45, Números: 30) têm bem mais questões reais que as raras (Matrizes: 0, Matemática Financeira: 2, Trigonometria: 3).
- **ENEM pré-2009** (1998-2008) tem formato completamente diferente: uma única prova interdisciplinar de 63 questões (todas as áreas misturadas, sem caderno dedicado de Matemática) + redação. Testado com a prova de 2008 completa (63/63 questões lidas): nenhuma se encaixou nos subtópicos de "Números". Decisão tomada com o usuário: não vale o custo de ler os ~10 anos restantes desse formato antigo — os blocos com poucas questões reais (Números, Regra de Três, Matrizes etc.) têm o restante preenchido por questões inéditas (ver abaixo).
- Questões com figura/gráfico que não dá pra reproduzir fielmente em texto usam os campos `figura` (no nível da questão) e `imagem` (por alternativa) do schema em `src/lib/types.ts`, apontando para um PNG recortado da prova original salvo em `public/figuras/`. Ver `enem-2016-158` (ábaco) e `enem-2011-137` (relógio de luz) como exemplos.
- `src/lib/questions.ts` — agrega todos os arquivos acima em `todasQuestoes`
- `scripts/generate.mjs` calcula, por categoria, `TARGET_PER_CATEGORIA = max(10, 50 − quantidade_de_reais_naquela_categoria)`, lendo `real.json` para saber quantas reais já existem em cada uma. Isso garante que toda categoria feche em pelo menos 50 questões no total (reais + inéditas), sem precisar mexer manualmente no número por categoria. Categorias com muitas reais (Razão e Proporção, Porcentagem, Números) recebem só o piso de 10 inéditas para manter alguma variedade; categorias raras (Matrizes, Matemática Financeira, Trigonometria, Geometria Analítica etc.) recebem 40+ inéditas para compensar. Rodar `node scripts/generate.mjs` de novo após adicionar mais questões reais para rebalancear automaticamente.

## Adicionar mais questões reais

1. Achar a URL da prova e do gabarito no site do INEP:
   - 2023–2025: existe versão `..._NVDA.pdf` (leitor de tela) em `download.inep.gov.br/enem/provas_e_gabaritos/`, com texto em coluna única e descrição textual de figuras/gráficos — a mais fácil e confiável de extrair. Use `pdftotext -layout -enc UTF-8`.
   - 2019, 2020, 2022: só existe a prova impressa regular (`..._PV_impresso_D2_CDx.pdf`) nesse mesmo diretório, sem descrição de figuras. Use `pdftotext -enc UTF-8` (**sem** `-layout` — o layout de duas colunas embaralha o texto entre questões).
   - 2019 usa outro caminho: `download.inep.gov.br/educacao_basica/enem/provas/2019/...` e `.../gabaritos/2019/...`.
   - Teste sempre o ano antes de investir tempo: baixe a prova e rode `pdftotext -enc UTF-8` numa amostra. Se aparecerem caracteres tipo `�` mesmo com `-enc UTF-8`, ou blocos de texto sem nexo (tipo cifra de César), a fonte embutida no PDF está com o ToUnicode/CMap quebrado para aquele subconjunto de caracteres — **não tente decodificar via texto** (o deslocamento tipo César só funciona para letras ASCII simples e falha de forma imprevisível em acentos). Em vez disso, renderize a página como imagem (passo 2) e leia visualmente — foi assim que o 2021 (antes marcado como "pulado" por esse motivo) acabou sendo recuperado com sucesso.
   - Anos com múltiplas aplicações no mesmo ano (ex.: 2015, por adiamento por Ebola) têm PV e GB separados por "1ª aplicação" / "2ª aplicação" — sempre confira se o cabeçalho do PV e do GB citam a mesma aplicação antes de usar o gabarito. Pareamento errado dá gabarito de uma prova diferente com as mesmas questões numeradas — só se percebe resolvendo a questão de forma independente e comparando (ver passo 3).
   - `curl -sL -k -o prova.pdf <url>` (o `-k` é necessário; o certificado do domínio costuma falhar na verificação padrão; o domínio é instável — normal precisar de 2 a 4 tentativas).
2. Questões com gráfico/figura sem descrição textual (ou com texto corrompido, ver acima): renderize a página como imagem e leia visualmente. `pdftoppm` não vem com o poppler que o Git for Windows instala (só tem `pdftotext`) — instale o poppler completo com `winget install --id oschwartz10612.Poppler` e chame os binários pelo caminho completo em `AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_*\poppler-*\Library\bin\`. Use `pdftoppm -f <página> -l <página> -r 300-600 -png prova.pdf saida` (aumente `-r` e use `-x/-y/-W/-H` para recortar quando precisar ler valores pequenos de um gráfico ou contar elementos discretos como argolas de um ábaco ou posição de ponteiros — errar a leitura de um desenho vetorial recortado pequeno demais é fácil, então ao contar elementos discretos prefira crops grandes/nítidos e recontar antes de transcrever).
   - Se a questão tem figura que dá pra descrever fielmente em texto (gráfico com eixos/valores claros, tabela), transcreva em texto normalmente. Se a figura é visual/posicional (desenho, mapa, foto, disposição espacial de objetos) e não dá pra descrever com fidelidade, salve o recorte como PNG em `public/figuras/` e referencie via `figura`/`imagem` no schema (ver seção "Dados" acima).
3. Resolver cada questão de forma independente (sem olhar as alternativas primeiro) e conferir se a resposta bate com a letra do gabarito oficial antes de transcrever — nunca copiar um valor sem verificar. Se o resultado não bater, desconfie de erro de leitura da figura/tabela ou pareamento errado de aplicação (ver acima) antes de desconfiar da própria conta.
4. Pular sem dó: questões cuja alternativa é só uma imagem (sem texto), gráficos ambíguos sem eixo/valores claros, tabelas com layout confuso na extração, ou figuras cuja leitura exigiria precisão sub-pixel não confirmável com confiança (ex.: posição exata de um ponteiro analógico entre duas marcas, quando o resultado numérico exige essa precisão). É preferível ter menos questões reais e todas corretas do que arriscar transcrever errado.
5. Adicionar ao array em `src/data/questions/real.json` seguindo o schema de `src/lib/types.ts`, depois validar com o script abaixo (o `validate.mjs` do repo só cobre os arquivos sintéticos por categoria, não `real.json` — para esse, rodar um script Node ad-hoc que carrega `real.json` e confere: 5 alternativas únicas de texto, gabarito presente entre as letras, letras em ordem A-E, e ids não duplicados).

## Progresso do aluno

Guardado no `localStorage` do navegador (`src/lib/progress.ts`), chave `enem-questoes-progresso-v1`. Sem backend/banco de dados — é um app 100% client-side, então o gabarito fica no bundle enviado ao navegador (não há como escondê-lo sem um servidor).
