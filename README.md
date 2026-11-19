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

一般ユーザーの登録・ログインはSupabase Authを使用します。Supabaseを利用できない場合にブラウザー内だけでログインする代替経路はなく、認証状態はSupabaseのセッションで確認します。以前のバージョンがブラウザーに保存したローカルアカウントのパスワードは、アプリ起動時に削除されます。旧ローカル登録だけで、Supabase Authには未登録のアカウントは、同じメールアドレスで「新規登録」し直してください。以前のパスワードは復元できませんが、ブラウザーに残っている献立データは同じメールアドレスで利用できます。登録メールアドレスはアカウントの識別・ログインIDとしてのみ利用し、確認やパスワード再設定のメール送信には利用しません。パスワードを忘れた場合は利用者自身で再設定できないため、管理者へリセットを依頼してください。ログイン中はマイページから現在のパスワードを確認したうえで変更できます。安全なサーバー側処理がまだないため、アカウント削除は画面から実行できません。

### 一般ユーザーの登録設定

新規登録をメール送信サービスなしで利用するには、GitHubリポジトリの **Actions → Enable email-free signup → Run workflow** を実行します。この設定はSupabase Authのメール確認を自動完了にし、登録確認メールなしで新規登録とログインを可能にします。メールアドレスの所有確認は省略されます。アプリではメールアドレスをアカウントの識別・ログインIDとしてのみ使います。メールによるパスワード再設定やメールアドレス変更は提供しません。パスワードを忘れた利用者のリセットは管理者が対応してください。

この設定は既存ユーザーのパスワードや登録情報を変更しません。設定前に作成され、メール未確認のままのアカウントは自動で確認済みにならないため、Supabase Dashboard の **Authentication → Users** から管理者が確認状態を更新してください。

すでにメール未確認で作成されたアカウントは、設定を変更しただけではログインできない場合があります。その場合はSupabase Dashboardの **Authentication → Users** から該当ユーザーの確認状態を更新してください。