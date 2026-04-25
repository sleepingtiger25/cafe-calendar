# 🏗️ 飲食店営業カレンダー - アーキテクチャ・設計書

## システム全体図

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (ホスティング)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            React 18 (Frontend)                       │  │
│  │  ┌─────────────┐  ┌────────────────────────────┐   │  │
│  │  │ PublicView  │  │   AdminDashboard           │   │  │
│  │  │ (Calendar)  │  │   ├─ LoginPage             │   │  │
│  │  └─────────────┘  │   ├─ ScheduleManager       │   │  │
│  │                    │   └─ EventManager          │   │  │
│  │  Lucide Icons + Custom CSS                       │   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Utility Libraries                         │  │
│  │  ├─ supabase.js (Supabaseクライアント)              │  │
│  │  ├─ holidays.js (祝日取得・キャッシュ)              │  │
│  │  └─ utils.js (日付・時間・色ユーティリティ)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
└──────────────────────────────────────────────────────────────┘
                          ↓
         ┌─────────────────────────────────────┐
         │     Supabase (Backend + DB)         │
         ├─────────────────────────────────────┤
         │ PostgreSQL                           │
         │ ├─ schedule_patterns (営業パターン)  │
         │ └─ events (イベント)                 │
         │                                     │
         │ Row Level Security (RLS)            │
         │ Auto-generated API                  │
         └─────────────────────────────────────┘
                          ↓
         ┌─────────────────────────────────────┐
         │  External APIs                      │
         │  ├─ 内閣府祝日API (CSV)             │
         │  └─ localStorage (キャッシュ)       │
         └─────────────────────────────────────┘
```

## 📊 データベーススキーマ

### `schedule_patterns` テーブル

営業時間のパターンを管理

```sql
CREATE TABLE schedule_patterns (
  id UUID PRIMARY KEY,              -- 一意識別子
  name TEXT NOT NULL,               -- 例：通常営業、土日祝日
  start_time TIME NOT NULL,         -- 開始時間 (08:30:00)
  end_time TIME NOT NULL,           -- 終了時間 (16:30:00)
  color TEXT DEFAULT '#E8D5C4',     -- カレンダー表示色
  order_index INT DEFAULT 0,        -- 管理画面の並び順
  created_at TIMESTAMP,             -- 作成日時
  updated_at TIMESTAMP              -- 更新日時
);
```

**特徴:**
- 複数のパターンをサポート
- 色を自由に設定可能
- ソート順序をカスタマイズ可能

---

### `events` テーブル

イベント情報を管理

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,              -- 一意識別子
  title TEXT NOT NULL,              -- イベントタイトル
  description TEXT,                 -- 詳細説明
  image_url TEXT,                   -- カバー画像
  event_date DATE NOT NULL,         -- 開催日
  start_time TIME,                  -- 開始時間 (オプション)
  end_time TIME,                    -- 終了時間 (オプション)
  link_url TEXT,                    -- 外部詳細ページリンク
  popup_image_url TEXT,             -- ポップアップ画像
  is_published BOOLEAN DEFAULT true,-- 公開状態
  created_at TIMESTAMP,             -- 作成日時
  updated_at TIMESTAMP              -- 更新日時
);
```

**特徴:**
- 複数の画像をサポート（カバー + ポップアップ）
- 外部リンク対応
- 下書き機能付き
- 時間オプショナル（終日イベント対応）

---

## 🔄 データフロー

### 1. カレンダー表示フロー

```
ユーザー（公開ページ）
    ↓
PublicView.jsx
    ↓
useEffect で月切り替え時に loadData() 実行
    ↓
┌─────────────────────────────────────┐
│ scheduleApi.getAll()                │  → Supabase
│ eventApi.getAll()                   │  → Supabase
│ getMonthHolidays(year, month)       │  → API キャッシュ
└─────────────────────────────────────┘
    ↓
状態更新 (patterns, events, holidays)
    ↓
renderCalendarDays() でカレンダー生成
    ↓
日付ごとに営業パターンと祝日を確認
    ↓
色分けされたカレンダー表示
```

### 2. イベント詳細表示フロー

```
ユーザーがイベントをクリック
    ↓
selectedEvent 状態更新
    ↓
モーダルレンダリング
  ├─ 画像表示
  ├─ メタ情報（日付・時間）
  ├─ 説明テキスト
  ├─ ポップアップ画像
  └─ 外部リンク
```

### 3. 管理画面フロー

#### 認証フロー
```
ログインページ
    ↓
パスワード入力
    ↓
storageUtils.setAuth(password)
    → sessionStorage に btoa(password) を保存
    ↓
AdminDashboard へ遷移
```

#### パターン編集フロー
```
ScheduleManager
    ↓
フォーム入力
    ↓
handleSubmit()
    ↓
scheduleApi.create() または .update()
    ↓
Supabase に保存
    ↓
状態更新 → UI再描画
```

---

## 🎯 コンポーネント設計

### App.jsx（ルート）

アプリケーション全体を管理

```javascript
App
├─ navbar                     // グローバルナビゲーション
├─ main-content
│  ├─ view === 'public'
│  │  └─ PublicView           // 公開ページ
│  ├─ view === 'login'
│  │  └─ LoginPage            // ログイン画面
│  └─ view === 'admin'
│     └─ AdminDashboard       // 管理画面
└─ footer
```

### PublicView.jsx

カレンダー表示コンポーネント

**責務:**
- カレンダーの描画
- 月の移動
- イベント表示
- 祝日の確認

**状態:**
```javascript
[currentDate] - 現在表示中の月
[patterns] - 営業パターン
[events] - イベント一覧
[holidays] - 祝日リスト
[selectedEvent] - 選択中のイベント
```

### AdminDashboard.jsx

管理画面の親コンポーネント

**責務:**
- タブ切り替え
- ログアウト処理
- エラー表示

**子コンポーネント:**
- ScheduleManager
- EventManager

### ScheduleManager.jsx

営業パターン管理

**機能:**
- パターンCRUD
- 色ピッカー
- リアルタイムバリデーション

### EventManager.jsx

イベント管理

**機能:**
- イベントCRUD
- 画像プレビュー
- 公開/下書き切り替え

### LoginPage.jsx

認証画面

**機能:**
- パスワード入力
- エラーメッセージ表示
- シンプルなUI

---

## 📚 ユーティリティライブラリ

### supabase.js

Supabaseの初期化とAPI

```javascript
// クライアント初期化
export const supabase = createClient(url, key)

// API インターフェース
export const scheduleApi = {
  getAll(),
  create(data),
  update(id, data),
  delete(id)
}

export const eventApi = {
  getAll(),
  getByDate(date),
  create(data),
  update(id, data),
  delete(id)
}
```

### holidays.js

祝日取得とキャッシング

```javascript
// 祝日を取得（キャッシュ付き）
export async function getJapanHolidays(year)

// 指定日が祝日かチェック
export async function isHoliday(dateString)

// 月の祝日一覧
export async function getMonthHolidays(year, month)
```

**キャッシュ戦略:**
- localStorage に24時間キャッシュ
- APIエラー時はフォールバック（手動定義）
- 2024-2026年の祝日をサポート

### utils.js

日付・時間・色・ストレージユーティリティ

```javascript
// 日付ユーティリティ
dateUtils.toDateString()       // YYYY-MM-DD
dateUtils.formatDisplay()      // "2024年1月15日(月)"
dateUtils.formatShort()        // "1月15日(月)"
dateUtils.isToday()            // 今日判定

// 時間ユーティリティ
timeUtils.toTimeString()       // HH:MM
timeUtils.toFullTimeString()   // HH:MM:SS
timeUtils.formatDisplay()      // "午前8時30分"
timeUtils.formatRange()        // "08:30～16:30"

// 色ユーティリティ
colorUtils.isValidColor()      // #RRGGBB チェック
colorUtils.getContrastColor()  // 白または黒を返す

// ストレージユーティリティ
storageUtils.setAuth(password) // 認証状態保存
storageUtils.getAuth()         // 認証状態取得
storageUtils.isAuthenticated() // 認証確認
```

---

## 🎨 スタイリング戦略

### CSS変数（テーマ）

```css
:root {
  --primary: #E8D5C4;           /* メインカラー */
  --primary-light: #F5E6D3;     /* ライト */
  --primary-dark: #8B7D6B;      /* ダーク */
  --secondary: #D9C5B0;         /* セカンダリ */
  --accent: #C9B5A0;            /* アクセント */
  --danger: #E74C3C;            /* エラー */
  --success: #27AE60;           /* 成功 */
  --text-primary: #2C2C2C;      /* 主要テキスト */
  --text-secondary: #666666;    /* サブテキスト */
  --border: #DDD7D1;            /* ボーダー */
  --bg-light: #FDFBF9;          /* 背景ライト */
  --bg-gray: #F5F3F0;           /* 背景グレー */
}
```

### レスポンシブデザイン

```css
/* デスクトップ */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

/* タブレット (768px以下) */
@media (max-width: 768px) {
  .navbar { flex-wrap: wrap; }
  .calendar-day { padding: 0.5rem; }
}

/* モバイル (480px以下) */
@media (max-width: 480px) {
  .calendar-day { padding: 0.25rem; }
  .weekday-label { font-size: 0.65rem; }
}
```

---

## 🔐 セキュリティ設計

### Row Level Security (RLS)

**読み取り:**
```sql
-- 営業パターン：誰でも読み取り可
CREATE POLICY "Enable read for all" ON schedule_patterns
  FOR SELECT USING (true);

-- イベント：公開済みのみ表示
CREATE POLICY "Enable read for all" ON events
  FOR SELECT USING (is_published = true);
```

**書き込み:**
```sql
-- 本番環境ではクライアント側の認証チェックが必要
-- 現在は簡易的なセッションストレージ認証
```

### 認証フロー

```javascript
// ログイン時
sessionStorage.setItem('_auth', btoa(password))

// 操作時（アプリ側でチェック）
const isAuth = storageUtils.isAuthenticated(password)
```

⚠️ **本番環境ではこれではなく:**
- Supabase Auth
- OAuth (Google, GitHub等)
- API キー認証

---

## 📈 パフォーマンス最適化

### キャッシング戦略

1. **祝日キャッシュ** (24時間)
   - localStorage に保存
   - API エラー時はフォールバック

2. **コンポーネント最適化**
   - useEffect で不要な再レンダリングを防止
   - 日付フォーマットはメモ化

3. **Supabase クエリ最適化**
   - select('*') で必要なカラムのみ取得
   - order_by で効率的なソート

### バンドルサイズ

```
packages:
- react: 43KB
- date-fns: 13KB
- lucide-react: 40KB
- @supabase/supabase-js: 75KB

Total: ~170KB (圧縮前)
```

---

## 🚀 デプロイメント

### ビルドプロセス

```bash
npm run build
# ↓
vite build
# ↓
dist/ ディレクトリ生成
# ↓
Vercel にデプロイ
```

### 環境変数管理

```
開発環境 (.env.local)
├─ VITE_SUPABASE_URL
├─ VITE_SUPABASE_ANON_KEY
└─ VITE_ADMIN_PASSWORD

本番環境 (Vercel)
├─ VITE_SUPABASE_URL (同じ)
├─ VITE_SUPABASE_ANON_KEY (同じ)
└─ VITE_ADMIN_PASSWORD (強力なパスワード)
```

---

## 📋 ファイル構成と責務

```
src/
├── components/
│   ├── PublicView.jsx              # カレンダー表示
│   ├── AdminDashboard.jsx          # 管理画面コンテナ
│   ├── ScheduleManager.jsx         # パターン管理
│   ├── EventManager.jsx            # イベント管理
│   └── LoginPage.jsx               # ログイン画面
│
├── lib/
│   ├── supabase.js                 # Supabase クライアント
│   ├── holidays.js                 # 祝日取得
│   └── utils.js                    # ユーティリティ
│
├── App.jsx                         # ルートコンポーネント
├── App.css                         # メインスタイル
├── main.jsx                        # エントリーポイント
└── index.css                       # グローバルスタイル

public/
└── logo.png                        # ロゴ（カスタマイズ必要）
```

---

## 🔄 更新フロー

### 営業パターン更新時

```
1. ScheduleManager で「更新」ボタンをクリック
2. handleSubmit() で scheduleApi.update() 呼び出し
3. Supabase に PUT リクエスト送信
4. ローカル状態 (patterns) 更新
5. PublicView が patterns の変更を検知し再レンダリング
6. カレンダーが新しい色で表示更新
```

### イベント追加時

```
1. EventManager でフォーム入力
2. handleSubmit() で eventApi.create() 呼び出し
3. Supabase に POST リクエスト送信
4. ローカル状態 (events) に追加
5. 必要に応じて PublicView が再描画
6. イベント対象日付のカレンダーに 🎉 が表示
```

---

## 🐛 エラーハンドリング

### API エラー処理

```javascript
try {
  const data = await scheduleApi.getAll()
  setPatterns(data)
} catch (error) {
  setError('読み込みエラー: ' + error.message)
  // ユーザーにエラーバナーを表示
}
```

### 祝日 API エラー時

```javascript
// 内閣府 API が失敗した場合
// → フォールバック（手動定義の祝日リスト）を使用
// → ユーザーには影響なし
```

---

## 🎓 拡張ポイント

### 今後の機能追加の候補

1. **複数営業店舗対応**
   - users テーブル追加
   - 店舗ごとの patterns/events

2. **より強固な認証**
   - Supabase Auth 導入
   - OAuth (Google, GitHub)

3. **メール通知**
   - イベント開催前にメール送信
   - 営業時間変更の案内

4. **多言語対応**
   - date-fns で多言語対応済み
   - UI 翻訳ファイル追加

5. **統計・分析**
   - イベント参加者数の追跡
   - 営業パターンの分析

6. **SNS連携**
   - X/Instagram への自動投稿
   - イベント告知の自動化

---

## 📞 サポート・メンテナンス

### 定期的に確認すること

1. **祝日リスト** (毎年)
   - `holidays.js` の フォールバックを更新

2. **依存パッケージ** (月1回)
   ```bash
   npm outdated
   npm update
   ```

3. **Supabase セキュリティ** (毎月)
   - RLS ポリシー確認
   - API キー定期ローテーション

---

**このアーキテクチャにより、保守性と拡張性の高いシステムを実現しています。**
