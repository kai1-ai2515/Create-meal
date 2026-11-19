create table if not exists public.short_videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  caption text not null default '' check (char_length(btrim(caption)) <= 300),
  created_at timestamptz not null default now(),
  constraint short_videos_storage_path_owner
    check (storage_path like (user_id::text || '/%'))
);

create index if not exists short_videos_created_at_idx
  on public.short_videos (created_at desc);

alter table public.short_videos enable row level security;

revoke all on public.short_videos from anon, authenticated;
grant select on public.short_videos to anon, authenticated;
grant insert, delete on public.short_videos to authenticated;

drop policy if exists "Anyone can view short videos" on public.short_videos;
create policy "Anyone can view short videos"
  on public.short_videos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can publish their own short videos" on public.short_videos;
create policy "Users can publish their own short videos"
  on public.short_videos
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and storage_path like (auth.uid()::text || '/%')
  );

drop policy if exists "Users can delete their own short videos" on public.short_videos;
create policy "Users can delete their own short videos"
  on public.short_videos
  for delete
  to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cooking-videos',
  'cooking-videos',
  true,
  52428800,
  array['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/webm', 'video/3gpp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view cooking videos" on storage.objects;
create policy "Anyone can view cooking videos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'cooking-videos');

drop policy if exists "Users can upload their own cooking videos" on storage.objects;
create policy "Users can upload their own cooking videos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'cooking-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own cooking videos" on storage.objects;
create policy "Users can delete their own cooking videos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'cooking-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create table if not exists public.short_video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.short_videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(btrim(content)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists short_video_comments_video_created_at_idx
  on public.short_video_comments (video_id, created_at desc);

alter table public.short_video_comments enable row level security;

revoke all on public.short_video_comments from anon, authenticated;
grant select on public.short_video_comments to anon, authenticated;
grant insert, delete on public.short_video_comments to authenticated;

drop policy if exists "Anyone can view short video comments" on public.short_video_comments;
create policy "Anyone can view short video comments"
  on public.short_video_comments
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can add their own short video comments" on public.short_video_comments;
create policy "Users can add their own short video comments"
  on public.short_video_comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own short video comments" on public.short_video_comments;
create policy "Users can delete their own short video comments"
  on public.short_video_comments
  for delete
  to authenticated
  using (auth.uid() = user_id);
