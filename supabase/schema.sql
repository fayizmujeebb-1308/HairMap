-- ============================================================
-- HairMap Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE 1: profiles
-- ============================================================
create table if not exists profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  hairmap_id text unique,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  join_date timestamptz default now(),
  hair_health_score integer,
  hair_age integer,
  treatment_status text,
  norwood_stage integer,
  age integer,
  gender text,
  country text,
  ethnicity text,
  onboarding_completed boolean default false,
  email_verified boolean default false,
  notification_medication boolean default true,
  notification_photo boolean default true,
  notification_reports boolean default true,
  paddle_customer_id text,
  paddle_subscription_id text,
  subscription_status text default 'free',
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE 2: progress_photos
-- ============================================================
create table if not exists progress_photos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  angle text check (angle in ('front','left','right','top','crown','hairline','donor')) not null,
  storage_path text not null,
  thumb_path text,
  notes text,
  taken_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE 3: treatment_logs
-- ============================================================
create table if not exists treatment_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  treatment_name text not null,
  treatment_type text,
  dose text,
  frequency text,
  taken_at timestamptz default now(),
  notes text,
  side_effects text,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE 4: hair_analyses
-- ============================================================
create table if not exists hair_analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  photo_id uuid references progress_photos(id) on delete set null,
  hair_age integer,
  health_score integer,
  hairline_score integer,
  crown_score integer,
  donor_score integer,
  norwood_detected integer,
  risk_flags text[],
  forecast_1yr text,
  forecast_5yr text,
  forecast_10yr text,
  ai_recommendations text,
  model_used text,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Enables rules so each user can only see their own data
-- ============================================================
alter table profiles enable row level security;
alter table progress_photos enable row level security;
alter table treatment_logs enable row level security;
alter table hair_analyses enable row level security;

-- Profiles: users can read and update their own row only
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    -- SECURITY: users cannot set is_admin on themselves
    and is_admin = (select is_admin from profiles where user_id = auth.uid())
  );

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = user_id);

-- Progress photos
create policy "Users can manage own photos"
  on progress_photos for all using (auth.uid() = user_id);

-- Treatment logs
create policy "Users can manage own treatments"
  on treatment_logs for all using (auth.uid() = user_id);

-- Hair analyses
create policy "Users can manage own analyses"
  on hair_analyses for all using (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- Runs automatically when a new user signs up
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
declare
  new_hairmap_id text;
  user_count integer;
begin
  select count(*) into user_count from profiles;
  new_hairmap_id := 'HM-' || lpad((user_count + 1)::text, 6, '0');

  insert into profiles (user_id, email, first_name, last_name, hairmap_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new_hairmap_id
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- STORAGE BUCKETS
-- Run these separately in Supabase Storage settings
-- ============================================================
-- Bucket 1: avatars (public)
-- Bucket 2: progress-photos (private, signed URLs only)
