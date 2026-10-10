# レシピタ

## 公開URL

[https://kai1-ai2515.github.io/Create-meal/](https://kai1-ai2515.github.io/Create-meal/)

## アップデートのお知らせ

開発者はアプリ内の「お知らせ配信」から全ユーザーへメッセージを配信できます。配信機能を有効にするには次のSupabase設定が必要です。

1. `supabase-config.js` にSupabaseのProject URLと公開用anon keyを設定します。`service_role` keyはブラウザーに置かないでください。
2. SupabaseのSQL Editorで [`supabase/announcements.sql`](./supabase/announcements.sql) を実行します。
3. Supabase Authに開発者アカウントを作成し、SQL Editorで次のSQLを実行して開発者ロールを設定します。メールアドレスは作成したアカウントに置き換えてください。

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"developer"}'::jsonb
   where email = 'your-developer@example.com';
   ```

4. 開発者アカウントで再ログインしてから、開発者コンソールの「お知らせ配信」を開きます。

お知らせはSupabaseで公開され、ログイン中の全ユーザーが閲覧できます。読み取りは公開、投稿と削除はSupabase Authの開発者ロールとRow Level Securityで制限されます。設定前は配信フォームに設定エラーが表示されます。