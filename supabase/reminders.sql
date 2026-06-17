-- Reminder settings per treatment per user
create table if not exists reminder_settings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  stack_item_id   uuid references treatment_stack(id) on delete cascade not null,
  treatment_name  text not null,
  reminder_time   time not null,          -- e.g. '08:00'
  timezone        text not null default 'UTC',
  email_enabled   boolean not null default true,
  push_enabled    boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz default now(),
  unique(user_id, stack_item_id, reminder_time)
);

alter table reminder_settings enable row level security;
create policy "Users manage own reminders" on reminder_settings
  for all using (auth.uid() = user_id);

-- Push subscriptions (one per browser/device)
create table if not exists push_subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  subscription    jsonb not null,
  created_at      timestamptz default now(),
  unique(user_id, (subscription->>'endpoint'))
);

alter table push_subscriptions enable row level security;
create policy "Users manage own push subscriptions" on push_subscriptions
  for all using (auth.uid() = user_id);
