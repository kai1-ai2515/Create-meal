# レシピタ

## アップデートのお知らせ機能

お知らせはSupabaseに保存し、全ユーザーのお知らせページへ配信します。

1. `supabase-config.js` の `url` と `anonKey` にSupabaseプロジェクトのURLと公開用anon keyを設定します。`service_role` keyはブラウザーに設定しないでください。
2. SupabaseのSQL Editorで [`supabase/announcements.sql`](./supabase/announcements.sql) を実行します。
3. Supabase Authで開発者アカウントを作成し、信頼できるアカウントの `app_metadata` に `{"role":"developer"}` を設定します。SQL Editorで設定する場合の例はSQLファイル末尾にあります。
4. 開発者ログイン画面からそのアカウントでログインし、VOC管理の「お知らせ管理」から送信します。送信したお知らせは全ユーザーに即時公開されます。

投稿権限はブラウザー内の表示状態ではなく、Supabase Authの開発者ロールとテーブルのRLSポリシーで制限されます。ユーザーはアプリ内の📢ボタンからお知らせを確認できます。