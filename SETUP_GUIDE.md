# 飲食店営業カレンダー Webアプリ - セットアップガイド

## 🚀 クイックスタート

### 前提条件
- Node.js 18+ 
- npm または yarn
- Supabaseアカウント
- Vercelアカウント

### 1. Supabase セットアップ

#### 1.1 プロジェクト作成
1. https://supabase.com にアクセス
2. 「New Project」で新規プロジェクト作成
3. プロジェクト情報を記録（Project URL、Anon Key）

#### 1.2 データベーステーブル作成

Supabase SQLエディタで以下を実行：

```sql
-- 営業時間パターンテーブル
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

-- イベントテーブル
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

-- 公開読み取り
CREATE POLICY "Enable read for all" ON schedule_patterns
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all" ON events
  FOR SELECT USING (is_published = true);

-- 管理画面アクセス（簡易パスワード認証後）
CREATE POLICY "Enable all for authenticated" ON schedule_patterns
  FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated" ON events
  FOR ALL USING (true);
```

#### 1.3 デフォルトパターン挿入

```sql
INSERT INTO schedule_patterns (name, start_time, end_time, color, order_index) VALUES
  ('通常営業', '08:30:00', '16:30:00', '#E8D5C4', 0),
  ('土日祝日', '08:00:00', '15:30:00', '#F5E6D3', 1),
  ('短縮営業', '08:30:00', '15:30:00', '#D9C5B0', 2),
  ('月初特別', '09:30:00', '15:30:00', '#C9B5A0', 3),
  ('休日', '00:00:00', '00:00:00', '#CCCCCC', 4);
```

### 2. ローカル開発環境セットアップ

```bash
# プロジェクトディレクトリ作成
mkdir cafe-calendar-app
cd cafe-calendar-app

# React + Vite プロジェクト初期化
npm create vite@latest . -- --template react

# 必要なパッケージインストール
npm install
npm install @supabase/supabase-js
npm install lucide-react
npm install date-fns
npm install clsx
npm install axios

# 環境変数設定
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-secure-password
EOF
```

### 3. ファイル配置

```
src/
  ├── components/
  │   ├── PublicView.jsx
  │   ├── AdminDashboard.jsx
  │   ├── ScheduleManager.jsx
  │   ├── EventManager.jsx
  │   └── HolidaySelector.jsx
  ├── lib/
  │   ├── supabase.js
  │   ├── holidays.js
  │   └── utils.js
  ├── App.jsx
  ├── App.css
  └── index.css

.env.local
vite.config.js
package.json
```

### 4. ローカルで実行

```bash
npm run dev
# http://localhost:5173 でアクセス
```

### 5. Vercelデプロイ

```bash
# Vercelプロジェクト初期化
npm install -g vercel
vercel

# 環境変数設定（Vercel Dashboard）
# Settings → Environment Variables で以下を追加：
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
# VITE_ADMIN_PASSWORD

# デプロイ
vercel --prod
```

## 📝 環境変数

`.env.local` に以下を設定：

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_ADMIN_PASSWORD=your-strong-password
```

## 🎨 カスタマイズ

### ロゴ変更
1. `public/logo.png` をカフェのロゴで置き換え
2. または `App.jsx` の `<img src="/logo.png">` を編集

### 色スキーム変更
`App.css` の CSS変数を編集：
```css
:root {
  --primary: #E8D5C4;    /* メインベージュ */
  --secondary: #F5E6D3;  /* ライト */
  --accent: #8B7D6B;     /* アクセント */
}
```

### 祝日の自動更新
- `lib/holidays.js` は日本の祝日を自動取得
- 毎年更新（APIベース）

## 🔐 セキュリティノート

- **本番環境**: 簡易パスワード認証では不十分です
  - Supabase Auth の導入を推奨
  - または別の認証サービス（Auth0など）を使用

## 📱 機能説明

### 公開ページ
- カレンダー表示（営業時間、イベント）
- 祝日自動表示
- レスポンシブ対応

### 管理画面
- オーナーパスワード認証
- 営業パターン CRUD
- イベント管理
- 祝日選択

## 🆘 トラブルシューティング

### Supabaseに接続できない
- URL と Anon Key を確認
- CORS設定を確認（Supabase Settings）

### ロゴが表示されない
- `public/` フォルダに `logo.png` を配置

### 祝日が表示されない
- インターネット接続を確認
- 祝日APIの仕様を確認（内閣府のAPI）

## 📞 サポート

質問やバグ報告は GitHubIssues へ
