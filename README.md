# レシピタ

## 公開URL

[https://kai1-ai2515.github.io/Create-meal/](https://kai1-ai2515.github.io/Create-meal/)

## アップデートのお知らせ

開発者ログインにメールアドレスは不要です。開発者専用パスワードを登録します。登録者一覧の初回設定後は、GitHub Actionsからワンクリックで配信できます。

### 初回設定・更新

1. [`supabase-config.js`](./supabase-config.js) にProject URLとPublishable（旧anon）キーを設定します。`service_role` / Secret keyはこのファイルに絶対に入れないでください。
2. Supabaseの **SQL Editor** で [`supabase/announcements.sql`](./supabase/announcements.sql) 全体を実行します。初めてならテーブルを作り、以前の方式で作成済みなら権限を新方式に更新します。
3. Supabaseの **Edge Functions → Secrets** で `DEVELOPER_PASSWORD` を登録します。16文字以上の推測されにくいパスワードにしてください。チャットやソースコードには書かず、アプリのログイン時に使います。
4. GitHubリポジトリの **Settings → Secrets and variables → Actions** で、次のRepository secretsを一度だけ追加します。

   - `SUPABASE_ACCESS_TOKEN`: Supabase Dashboardのアカウント設定で発行するAccess Token
   - `SUPABASE_PROJECT_REF`: Project URL `https://<project-ref>.supabase.co` の `<project-ref>` 部分

5. GitHubリポジトリの **Actions → 登録者一覧の準備 → Run workflow** を実行します。以後、登録者一覧のサーバー機能を更新するときも同じ操作で配信できます。CLIのインストールは不要です。

   `SUPABASE_ACCESS_TOKEN`はGitHub ActionsのSecretとしてのみ使用されます。`SUPABASE_SERVICE_ROLE_KEY`をソースコードやブラウザーに置く必要はありません。

公開ページで「開発者ログイン」後、開発者コンソールの「登録者一覧」を開きます。一覧はSupabase Authのメール、登録日時、最終ログイン、登録メタデータなどを表示し、CSVに出力できます。パスワードや認証トークンは取得・表示しません。サーバー側機能の配信に失敗した場合は、画面に再実行方法を表示します。開発者パスワードは現在のブラウザータブの間だけ保持され、ログアウトすると消去されます。

### ログイン情報の保護

一般ユーザーの登録・ログインはSupabase Authを使用します。Supabaseを利用できない場合にブラウザー内だけでログインする代替経路はなく、認証状態はSupabaseのセッションで確認します。以前のバージョンがブラウザーに保存したローカルアカウントのパスワードは、アプリ起動時に削除されます。Supabase Authへ移行済みのアカウントはログイン画面の「パスワードを再設定」からメールで修復できます。旧ローカル登録だけで、Supabase Authには未登録のアカウントは、同じメールアドレスで「アカウント登録」し直してください。以前のパスワードは復元できませんが、ブラウザーに残っている献立データは同じメールアドレスで利用できます。マイページでメールアドレスやパスワードを変更する際は、現在のパスワードを再確認します。安全なサーバー側処理がまだないため、アカウント削除は画面から実行できません。

### 一般ユーザーの登録設定

登録時の確認メールを不要にするには、[SupabaseのEmail設定](https://supabase.com/dashboard/project/yrgatpjebzjfnwynxowy/auth/providers)で **Confirm email** をオフにします。登録時のメールは送られませんが、パスワードを忘れた場合の本人確認にはメールが必要です。本人確認を省いてパスワードを変更する方法は、アカウント乗っ取りを防ぐため提供しません。

パスワード再設定メールを届けるため、Supabaseの **Authentication → URL Configuration → Redirect URLs** に公開ページURL `https://kai1-ai2515.github.io/Create-meal/` を許可リストへ追加してください。ユーザーはログイン画面の「ログインできない場合はこちら」から再設定できます。

### メール送信数について

無料・無制限のメール配信は保証できません。Supabase標準メールには送信制限があり、外部SMTPサービスも無料枠には上限があります。登録確認をオフにすれば通常登録でのメール消費を抑えられますが、パスワード再設定メールは必要です。利用者が増えた場合は、独自ドメインでSMTPサービスを設定し、到達率と送信上限に応じて有料プランを選んでください。

すでにメール未確認で作成されたアカウントは、設定を変更しただけではログインできない場合があります。その場合はSupabase Dashboardの **Authentication → Users** から該当ユーザーの確認状態を更新してください。