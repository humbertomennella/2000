-- WEB ZONE 2000 community schema
-- Public reads are limited to approved content. Writes go through the Edge Function.
create extension if not exists pgcrypto;

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  nickname varchar(20) not null check (char_length(btrim(nickname)) between 1 and 20),
  message varchar(180) not null check (char_length(btrim(message)) between 1 and 180),
  moderation_status text not null default 'approved' check (moderation_status in ('approved','pending','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists community_messages_public_created_idx on public.community_messages (created_at desc) where moderation_status = 'approved';

create table if not exists public.community_guestbook (
  id uuid primary key default gen_random_uuid(),
  name varchar(30) not null check (char_length(btrim(name)) between 1 and 30),
  homepage_url varchar(100),
  message varchar(300) not null check (char_length(btrim(message)) between 1 and 300),
  moderation_status text not null default 'approved' check (moderation_status in ('approved','pending','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists community_guestbook_public_created_idx on public.community_guestbook (created_at desc) where moderation_status = 'approved';

-- Store only a salted one-way hash of the network fingerprint, never the raw IP address.
create table if not exists public.community_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null,
  hits integer not null default 1 check (hits >= 0)
);

alter table public.community_messages enable row level security;
alter table public.community_guestbook enable row level security;
alter table public.community_rate_limits enable row level security;

drop policy if exists "Anyone can read approved community messages" on public.community_messages;
create policy "Anyone can read approved community messages" on public.community_messages for select to anon, authenticated using (moderation_status = 'approved');
drop policy if exists "Anyone can read approved guestbook entries" on public.community_guestbook;
create policy "Anyone can read approved guestbook entries" on public.community_guestbook for select to anon, authenticated using (moderation_status = 'approved');

revoke insert, update, delete, truncate, references, trigger on public.community_messages from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.community_guestbook from anon, authenticated;
revoke all on public.community_rate_limits from anon, authenticated;
grant select on public.community_messages, public.community_guestbook to anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='community_messages') then
    alter publication supabase_realtime add table public.community_messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='community_guestbook') then
    alter publication supabase_realtime add table public.community_guestbook;
  end if;
end $$;
