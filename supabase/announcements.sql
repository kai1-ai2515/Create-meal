create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 100),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_by uuid not null references auth.users(id) on delete restrict,
  published_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

grant select on public.announcements to anon, authenticated;
grant insert, delete on public.announcements to authenticated;

drop policy if exists "Anyone can read published announcements" on public.announcements;
create policy "Anyone can read published announcements"
  on public.announcements
  for select
  to anon, authenticated
  using (published_at <= now());

drop policy if exists "Developers can publish announcements" on public.announcements;
create policy "Developers can publish announcements"
  on public.announcements
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'developer'
  );

drop policy if exists "Developers can delete announcements" on public.announcements;
create policy "Developers can delete announcements"
  on public.announcements
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'developer');

-- Assign the developer role to trusted accounts in Supabase Auth app_metadata.
-- Example SQL Editor command (replace the email with a trusted account):
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"developer"}'::jsonb
-- where email = 'trusted-admin@example.com';
-- Sign out and back in after changing app_metadata so the JWT receives the updated role.
