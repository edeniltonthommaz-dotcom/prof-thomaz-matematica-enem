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
- `src/data/questions/real.json` — questões **reais** de provas passadas do ENEM, com `fonte.tipo: "enem"`, `fonte.ano` e `fonte.url` apontando para o PDF oficial do INEP (download.inep.gov.br) usado na transcrição. Atualmente: ENEM 2023, 2º dia, Caderno 11 (Laranja), questões 136–180 (exceto a 138, anulada).
- `src/lib/questions.ts` — agrega todos os arquivos acima em `todasQuestoes`

## Adicionar mais questões reais

1. Achar a prova (`..._NVDA.pdf`, versão para leitor de tela — já vem com descrição textual de figuras/gráficos) e o gabarito do mesmo caderno/cor em `download.inep.gov.br/enem/provas_e_gabaritos/`.
2. `curl -sL -k -o prova.pdf <url>` (o `-k` é necessário; o certificado do domínio costuma falhar na verificação padrão) e `pdftotext -layout -enc UTF-8 prova.pdf prova.txt` (o `-enc UTF-8` é essencial — sem ele os acentos saem como `�`).
3. Resolver cada questão manualmente para conferir contra o gabarito antes de transcrever (evita propagar erro de transcrição/OCR).
4. Adicionar ao array em `src/data/questions/real.json` seguindo o schema de `src/lib/types.ts`, depois rodar `node scripts/validate.mjs`.

## Progresso do aluno

Guardado no `localStorage` do navegador (`src/lib/progress.ts`), chave `enem-questoes-progresso-v1`. Sem backend/banco de dados — é um app 100% client-side, então o gabarito fica no bundle enviado ao navegador (não há como escondê-lo sem um servidor).
