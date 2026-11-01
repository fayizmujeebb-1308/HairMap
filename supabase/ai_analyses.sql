create table if not exists ai_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  analysis text not null,
  adherence integer,
  streak integer,
  photo_count integer,
  treatments text,
  created_at timestamptz default now()
);

alter table ai_analyses enable row level security;

create policy "Users can read own analyses" on ai_analyses
  for select using (auth.uid() = user_id);

create policy "Users can insert own analyses" on ai_analyses
  for insert with check (auth.uid() = user_id);
