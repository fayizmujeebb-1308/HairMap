-- ============================================================
-- HairMap: treatment_stack table + treatment_logs columns
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- ============================================================
-- TABLE: treatment_stack
-- Each user's active/inactive treatment regimen items
-- ============================================================
create table if not exists treatment_stack (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  treatment_name  text not null,
  generic_name    text,
  treatment_type  text not null default 'oral',
  dose            text,
  frequency       text not null default 'once_daily',
  times_of_day    text[] default '{"once"}',
  started_at      date default current_date,
  is_active       boolean not null default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table treatment_stack enable row level security;

create policy "Users manage own treatment stack"
  on treatment_stack for all using (auth.uid() = user_id);

-- ============================================================
-- ADD MISSING COLUMNS to treatment_logs
-- (safe to run multiple times — uses IF NOT EXISTS pattern)
-- ============================================================

-- stack_item_id links a log entry back to its treatment_stack row
alter table treatment_logs
  add column if not exists stack_item_id uuid references treatment_stack(id) on delete set null;

-- side_effect tracking
alter table treatment_logs
  add column if not exists side_effect_severity integer;

alter table treatment_logs
  add column if not exists skipped boolean default false;

alter table treatment_logs
  add column if not exists skip_reason text;

-- ============================================================
-- INDEX for common queries
-- ============================================================
create index if not exists idx_treatment_stack_user_active
  on treatment_stack(user_id, is_active);

create index if not exists idx_treatment_logs_stack_item
  on treatment_logs(stack_item_id);

create index if not exists idx_treatment_logs_user_taken
  on treatment_logs(user_id, taken_at desc);
