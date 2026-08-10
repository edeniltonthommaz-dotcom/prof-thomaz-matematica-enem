<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Banco ENEM — Questões de Matemática

Next.js (App Router, TypeScript, Tailwind) app: banco de questões de Matemática
do ENEM organizado por assunto (19 categorias) e dificuldade (fácil/médio/difícil),
com correção interativa (responder → feedback certo/errado → explicação → gabarito).

## Comandos

- `npm run dev` — dev server (usar `-- -p <porta>` para trocar a porta)
- `npm run build` / `npm start` — build e serve de produção
- `node scripts/generate.mjs` — regenera as questões inéditas (programáticas) em `src/data/questions/*.json`
- `node scripts/validate.mjs` — valida integridade do banco (5 alternativas únicas por questão, gabarito válido)

## Dados

- `src/data/categorias.ts` — as 19 categorias (id, subtópicos, peso na prova)
- `src/data/questions/*.json` — um arquivo por categoria com questões **inéditas** geradas por `scripts/templates.mjs`
  (motor determinístico: cada template calcula a resposta certa em código, não por IA, para garantir que a matemática esteja correta)
- `src/data/questions/real.json` — questões **reais** de provas passadas do ENEM (204 questões), com `fonte.tipo: "enem"`, `fonte.ano` e `fonte.url` apontando para o PDF oficial do INEP (download.inep.gov.br) usado na transcrição. Cobertura atual: 2019, 2020, 2022, 2023, 2024, 2025 (2º dia, prova regular). **2021 foi pulado**: o PDF regular desse ano tem uma fonte com encoding quebrado (deslocamento tipo César inconsistente) que corrompe boa parte do texto extraído — não incluído para evitar transcrever dados errados. Anos anteriores a 2019 (ENEM "antigo", pré-2009, formato interdisciplinar sem seção de Matemática dedicada) não foram pesquisados.
- `src/lib/questions.ts` — agrega todos os arquivos acima em `todasQuestoes`
- Por pedido do usuário, o banco foi ajustado para que as questões **reais sejam maioria** (204 reais vs 190 inéditas — `TARGET_PER_CATEGORIA=10` em `scripts/generate.mjs`). Para restaurar mais densidade de questões inéditas, é só subir esse número e rodar `node scripts/generate.mjs` de novo — não afeta `real.json`.

## Adicionar mais questões reais

1. Achar a URL da prova e do gabarito no site do INEP:
   - 2023–2025: existe versão `..._NVDA.pdf` (leitor de tela) em `download.inep.gov.br/enem/provas_e_gabaritos/`, com texto em coluna única e descrição textual de figuras/gráficos — a mais fácil e confiável de extrair. Use `pdftotext -layout -enc UTF-8`.
   - 2019, 2020, 2022: só existe a prova impressa regular (`..._PV_impresso_D2_CDx.pdf`) nesse mesmo diretório, sem descrição de figuras. Use `pdftotext -enc UTF-8` (**sem** `-layout` — o layout de duas colunas embaralha o texto entre questões).
   - 2019 usa outro caminho: `download.inep.gov.br/educacao_basica/enem/provas/2019/...` e `.../gabaritos/2019/...`.
   - Teste sempre o ano antes de investir tempo: baixe a prova e rode `pdftotext -enc UTF-8` numa amostra. Se aparecerem caracteres tipo `�` mesmo com `-enc UTF-8`, ou blocos de texto sem nexo (tipo cifra de César), o PDF tem fonte corrompida — não vale a pena tentar decodificar, pule o ano (foi o caso de 2021).
   - `curl -sL -k -o prova.pdf <url>` (o `-k` é necessário; o certificado do domínio costuma falhar na verificação padrão).
2. Questões com gráfico/figura sem descrição textual: renderize a página como imagem e leia visualmente. `pdftoppm` não vem com o poppler que o Git for Windows instala (só tem `pdftotext`) — instale o poppler completo com `winget install --id oschwartz10612.Poppler` e chame os binários pelo caminho completo em `AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_*\poppler-*\Library\bin\`. Use `pdftoppm -f <página> -l <página> -r 300-600 -png prova.pdf saida` (aumente `-r` e use `-x/-y/-W/-H` para recortar quando precisar ler valores pequenos de um gráfico).
3. Resolver cada questão de forma independente (sem olhar as alternativas primeiro) e conferir se a resposta bate com a letra do gabarito oficial antes de transcrever — nunca copiar um valor sem verificar. Se o resultado não bater, desconfie de erro de leitura da figura/tabela antes de desconfiar da própria conta.
4. Pular sem dó: questões cuja alternativa é só uma imagem (sem texto), gráficos ambíguos sem eixo/valores claros, ou tabelas com layout confuso na extração. É preferível ter menos questões reais e todas corretas do que arriscar transcrever errado.
5. Adicionar ao array em `src/data/questions/real.json` seguindo o schema de `src/lib/types.ts`, depois rodar `node scripts/validate.mjs`.

## Progresso do aluno

Guardado no `localStorage` do navegador (`src/lib/progress.ts`), chave `enem-questoes-progresso-v1`. Sem backend/banco de dados — é um app 100% client-side, então o gabarito fica no bundle enviado ao navegador (não há como escondê-lo sem um servidor).
