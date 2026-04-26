-- The Revision Hub — initial schema
-- Run this in the Supabase SQL editor, or via the Supabase CLI:
--   supabase db push

create table subjects (
  id     serial primary key,
  name   text not null,
  slug   text unique not null,
  colour text  -- hex colour used for UI theming, e.g. '#3b82f6'
);

create table topics (
  id            serial primary key,
  subject_id    int references subjects(id) on delete cascade,
  name          text not null,
  paper         text,
  display_order int default 0
);

create table cards (
  id            serial primary key,
  topic_id      int references topics(id) on delete cascade,
  block_number  int not null,  -- which group of 10 this card belongs to
  keyword       text not null,
  definition    text not null,
  display_order int default 0
);

-- Phase 2: session tracking (not used in Phase 1)
create table sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users,
  topic_id     int references topics(id),
  block_number int,
  completed_at timestamptz default now(),
  score        int,
  total        int,
  percentage   numeric
);

create table card_attempts (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references sessions(id),
  card_id      int references cards(id),
  got_it       boolean,
  attempted_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table subjects      enable row level security;
alter table topics        enable row level security;
alter table cards         enable row level security;
alter table sessions      enable row level security;
alter table card_attempts enable row level security;

-- Anyone (including unauthenticated users) can read content
create policy "Public read subjects"
  on subjects for select using (true);

create policy "Public read topics"
  on topics for select using (true);

create policy "Public read cards"
  on cards for select using (true);

-- Authenticated users can manage their own sessions
create policy "Users insert own sessions"
  on sessions for insert
  with check (auth.uid() = user_id);

create policy "Users read own sessions"
  on sessions for select
  using (auth.uid() = user_id);

-- Authenticated users can manage attempts on their own sessions
create policy "Users insert own attempts"
  on card_attempts for insert
  with check (
    exists (
      select 1 from sessions
      where sessions.id = card_attempts.session_id
        and sessions.user_id = auth.uid()
    )
  );

create policy "Users read own attempts"
  on card_attempts for select
  using (
    exists (
      select 1 from sessions
      where sessions.id = card_attempts.session_id
        and sessions.user_id = auth.uid()
    )
  );
