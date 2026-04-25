# 🚀 飲食店営業カレンダー - クイックスタート

5分で開始できるセットアップガイドです。

## 📋 前提条件

- Node.js 18 以上
- npm または yarn
- Supabaseアカウント（無料）
- Vercelアカウント（無料、デプロイ用）

## ⚡ 1分で始める（ローカル開発）

### ステップ 1: リポジトリをクローン

```bash
git clone <your-repo-url>
cd cafe-calendar-app
```

### ステップ 2: 依存パッケージをインストール

```bash
npm install
```

### ステップ 3: Supabaseプロジェクトを作成

1. https://supabase.com にアクセス
2. 「新規プロジェクト」を作成
3. プロジェクトURLとAnon Keyをメモ

### ステップ 4: Supabaseにテーブルを作成

Supabaseダッシュボード → SQLエディタで以下を実行：

```sql
-- 営業時間パターン
CREATE TABLE schedule_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  color TEXT DEFAULT '#E8D5C4',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- イベント
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  link_url TEXT,
  popup_image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS設定
ALTER TABLE schedule_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all" ON schedule_patterns FOR SELECT USING (true);
CREATE POLICY "Enable read for all" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Enable all for authenticated" ON schedule_patterns FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated" ON events FOR ALL USING (true);

-- デフォルトパターン
INSERT INTO schedule_patterns (name, start_time, end_time, color, order_index) VALUES
  ('通常営業', '08:30:00', '16:30:00', '#E8D5C4', 0),
  ('土日祝日', '08:00:00', '15:30:00', '#F5E6D3', 1),
  ('短縮営業', '08:30:00', '15:30:00', '#D9C5B0', 2),
  ('月初特別', '09:30:00', '15:30:00', '#C9B5A0', 3),
  ('休日', '00:00:00', '00:00:00', '#CCCCCC', 4);
```

### ステップ 5: 環境変数を設定

`.env.local` ファイルを作成：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-secure-password
```

### ステップ 6: ローカルサーバーを起動

```bash
npm run dev
```

http://localhost:5173 でアクセス可能！

---

## 🌐 Vercelにデプロイ

### ステップ 1: GitHubにプッシュ

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### ステップ 2: Vercelに接続

1. https://vercel.com にアクセス
2. 「New Project」 → GitHubリポジトリを選択
3. 「Deploy」をクリック

### ステップ 3: 環境変数を追加

Vercelダッシュボード → Settings → Environment Variables：

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
VITE_ADMIN_PASSWORD = your-secure-password
```

### ステップ 4: 本番デプロイ

```bash
vercel --prod
```

デプロイ完了！🎉

---

## 🎨 ロゴを設定

1. `public/logo.png` に置き換え（または作成）
2. サーバーを再起動

推奨サイズ: 240 × 240px

---

## 🔑 最初のログイン

1. トップページの「管理画面」をクリック
2. `.env.local` の `VITE_ADMIN_PASSWORD` を入力

---

## 📸 スクリーンショット

### 公開ページ
- カレンダー表示
- 営業時間・イベント表示
- 祝日の自動表示

### 管理画面
- パターン管理
- イベント管理
- シンプルな操作画面

---

## 🆘 よくある問題

| 問題 | 解決方法 |
|------|--------|
| "Cannot connect to Supabase" | `.env.local` を確認、URL とキーを確認 |
| ロゴが表示されない | `public/logo.png` を配置 |
| パスワードエラー | `VITE_ADMIN_PASSWORD` を確認 |
| 祝日が表示されない | インターネット接続を確認 |

---

## 📚 次のステップ

- [詳細セットアップガイド](./SETUP_GUIDE.md)を読む
- [README.md](./README.md)でカスタマイズ方法を確認
- Supabaseダッシュボードでテーブルを確認

---

## 🔐 セキュリティ上の注意

⚠️ 簡易パスワード認証は本番環境では不十分です。
以下の導入を推奨：

- Supabase Auth
- Google Sign-In
- Auth0
- Firebase Authentication

---

## 💡 便利なコマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドをプレビュー
npm run preview
```

---

## 📞 サポート

問題が発生した場合：

1. コンソールエラーを確認
2. `.env.local` を確認
3. Supabaseコンソールでテーブルを確認
4. README.mdのトラブルシューティングを参照

---

**Happy Coding! 🍽️🎉**
