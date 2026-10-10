# レシピタ

## 公開URL

[https://kai1-ai2515.github.io/Create-meal/](https://kai1-ai2515.github.io/Create-meal/)

## アップデートのお知らせ

開発者ログインにメールアドレスは不要です。Supabase Edge Functionで確認する専用パスワードを設定します。

### 初回設定・更新

1. [`supabase-config.js`](./supabase-config.js) にProject URLとPublishable（旧anon）キーを設定します。`service_role` / Secret keyはこのファイルに絶対に入れないでください。
2. Supabaseの **SQL Editor** で [`supabase/announcements.sql`](./supabase/announcements.sql) 全体を実行します。初めてならテーブルを作り、以前の方式で作成済みなら権限を新方式に更新します。
3. Supabaseの **Edge Functions → Secrets** で `DEVELOPER_PASSWORD` を登録します。16文字以上の推測されにくいパスワードにしてください。チャットやソースコードには書かず、アプリのログイン時に使います。
4. Supabase CLIをインストールし、プロジェクトのルートで次を実行してログイン・プロジェクト連携・関数配信を行います。Project refはProject URLの `https://` と `.supabase.co` の間の文字列です。

   ```sh
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase functions deploy developer-announcements
   ```

   Edge Functionが使う`SUPABASE_SERVICE_ROLE_KEY`はサーバー環境でのみ使用します。Publishable keyやアプリのブラウザー側に置かないでください。

5. アプリを公開した後、「開発者ログイン」を選び、登録した専用パスワードでログインします。開発者コンソールの「お知らせ配信」から全ユーザーへ投稿できます。

SupabaseのEdge Functionがパスワードを検証してから投稿・削除するため、画面上で開発者表示を偽装しても操作できません。一般ユーザーはお知らせを読むことだけができます。開発者パスワードは現在のブラウザータブの間だけ保持され、ログアウトすると消去されます。