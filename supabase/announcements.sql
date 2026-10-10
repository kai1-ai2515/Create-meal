create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 100),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  published_at timestamptz not null default now()
);

create index if not exists announcements_published_at_idx
  on public.announcements (published_at desc);

alter table public.announcements enable row level security;

drop policy if exists "Developers can publish announcements" on public.announcements;
drop policy if exists "Developers can delete announcements" on public.announcements;

alter table public.announcements drop column if exists created_by;

revoke insert, update, delete, truncate, references, trigger on public.announcements from anon, authenticated;
grant select on public.announcements to anon, authenticated;
grant select, insert, delete on public.announcements to service_role;

drop policy if exists "Anyone can read published announcements" on public.announcements;
create policy "Anyone can read published announcements"
  on public.announcements
  for select
  to anon, authenticated
  using (published_at <= now());
