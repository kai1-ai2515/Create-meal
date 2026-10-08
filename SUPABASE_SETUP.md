# Supabase setup

The app keeps its existing GitHub Pages URL. Supabase provides shared authentication and VOC storage; the browser must only use the project URL and public anon key. Never put a `service_role` key in this repository.

## 1. Create the tables and policies

In the Supabase SQL Editor, run the contents of `supabase-schema.sql`. Row-level security limits regular users to their own VOC records and allows moderation only for users with a developer role.

## 2. Configure the public client

Edit `supabase-config.js` and set the Project URL and public anon key from Supabase Project Settings > API:

```js
window.MEAL_SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_REF.supabase.co',
  anonKey: 'YOUR_PUBLIC_ANON_KEY'
};
```

The anon key is intended for browser use and is not a secret. RLS is the security boundary. Do not use the service-role key.

## 3. Configure authentication URLs

In Authentication > URL Configuration, set the Site URL to:

`https://kai1-ai2515.github.io/Create-meal/`

Add the same URL to the allowed redirect URLs. Email confirmation may remain enabled; new users will follow the confirmation link before signing in.

## 4. Grant developer access

First sign up once on the app using the developer's intended email and verify it if confirmation is enabled. Then run this query in the SQL Editor, replacing the email:

```sql
insert into public.user_roles (user_id, role)
select id, 'developer'
from auth.users
where lower(email) = lower('developer@example.com')
on conflict (user_id) do update set role = excluded.role;
```

The developer then uses the app's “開発者ログイン” button with that email and its Supabase password. Never share the password or store it in this repository.

## Account migration

Existing accounts were stored only in each browser and cannot be securely transferred to Supabase. Users must register again. Existing meal-planner data remains in that browser's local storage unless its browser data is cleared.

## Publish to the existing URL

Once the SQL and public client config are set, commit and push the changes to `main`. The existing Pages workflow updates the same URL; no new public URL is created.