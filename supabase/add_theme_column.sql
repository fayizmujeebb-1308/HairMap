-- Migration: add theme preference column to profiles
-- Run this in the Supabase SQL editor or via CLI

alter table profiles
  add column if not exists theme text default 'blossom';

-- Only allow valid theme values
alter table profiles
  add constraint profiles_theme_check
  check (theme in (
    'blossom', 'clinical', 'mint', 'calm-blue',
    'lavender', 'sand', 'dark', 'midnight',
    'high-contrast', 'system'
  ));
