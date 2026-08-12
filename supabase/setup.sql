-- Rodar no SQL Editor do Supabase (uma vez, no projeto criado para esta plataforma).

create table if not exists progresso_questoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  questao_id text not null,
  correta boolean not null,
  alternativa_escolhida text not null,
  respondida boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, questao_id)
);

-- mantém updated_at correto a cada upsert que resulta em UPDATE
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_progresso_questoes_updated_at on progresso_questoes;
create trigger trg_progresso_questoes_updated_at
  before update on progresso_questoes
  for each row execute function set_updated_at();

alter table progresso_questoes enable row level security;

drop policy if exists "select own progress" on progresso_questoes;
create policy "select own progress" on progresso_questoes
  for select using (auth.uid() = user_id);

drop policy if exists "insert own progress" on progresso_questoes;
create policy "insert own progress" on progresso_questoes
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own progress" on progresso_questoes;
create policy "update own progress" on progresso_questoes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own progress" on progresso_questoes;
create policy "delete own progress" on progresso_questoes
  for delete using (auth.uid() = user_id);
