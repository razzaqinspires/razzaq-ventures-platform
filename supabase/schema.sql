-- Run once in Supabase SQL Editor. Never expose SUPABASE_SERVICE_ROLE_KEY in a browser.
create table if not exists public.rv_records (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('content','sale','expense','product','team','audit')),
  key text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists rv_records_kind_created_idx on public.rv_records (kind, created_at desc);
create index if not exists rv_records_key_idx on public.rv_records (key);
alter table public.rv_records enable row level security;
-- No anon/authenticated policies are intentionally created. Server-only service role access is required.

-- Idempotency guard: one integration event ID can only be stored once.
create unique index if not exists rv_records_event_id_unique_idx on public.rv_records ((payload->>'eventId')) where payload ? 'eventId';
