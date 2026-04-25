# 📂 ファイル構成ガイド

## プロジェクトディレクトリ全体図

```
cafe-calendar-app/
│
├── 📋 ドキュメント
│   ├── README.md                  # プロジェクト概要（最初に読むファイル）
│   ├── QUICKSTART.md             # 5分で始める！
│   ├── SETUP_GUIDE.md            # 詳細なセットアップ手順
│   ├── USER_GUIDE.md             # オーナー向け操作マニュアル
│   ├── ARCHITECTURE.md           # システム設計・アーキテクチャ
│   └── FILE_STRUCTURE.md         # このファイル
│
├── 🚀 セットアップスクリプト
│   ├── setup.sh                  # macOS/Linux用自動セットアップ
│   ├── setup.bat                 # Windows用自動セットアップ
│   └── seed-data.js              # サンプルデータ投入スクリプト
│
├── ⚙️  設定ファイル
│   ├── package.json              # npm依存パッケージ（必須編集）
│   ├── vite.config.js            # Viteビルド設定
│   ├── .env.example              # 環境変数テンプレート
│   ├── .env.local                # 環境変数実ファイル（作成が必要）
│   ├── .gitignore                # Git除外設定
│   └── vercel.json               # Vercelデプロイ設定
│
├── 📄 HTMLテンプレート
│   └── index.html                # React マウントポイント
│
├── 💻 Reactアプリケーション
│   └── src/
│       │
│       ├── 🎨 スタイル
│       │   ├── App.css            # メインスタイル（1500行以上）
│       │   └── index.css          # グローバルスタイル
│       │
│       ├── 📦 ページ・コンポーネント
│       │   └── components/
│       │       ├── PublicView.jsx             # 公開ページ（カレンダー）
│       │       ├── AdminDashboard.jsx        # 管理画面コンテナ
│       │       ├── ScheduleManager.jsx       # 営業パターン管理
│       │       ├── EventManager.jsx          # イベント管理
│       │       └── LoginPage.jsx             # ログイン画面
│       │
│       ├── 🔧 ユーティリティ・API
│       │   └── lib/
│       │       ├── supabase.js                # Supabaseクライアント
│       │       ├── holidays.js                # 祝日取得API
│       │       └── utils.js                   # ユーティリティ関数
│       │
│       ├── 🏠 ルートコンポーネント
│       │   ├── App.jsx             # アプリケーションルート
│       │   └── main.jsx            # React DOMマウント
│       │
│       └── ローカルストレージ
│           └── sessionStorage      # 認証情報（一時的）
│
├── 📦 静的ファイル
│   └── public/
│       └── logo.png                # カフェロゴ（カスタマイズ必須）
│
└── 📊 出力・ビルド
    └── dist/                       # ビルド後のファイル（.gitignore対象）
        ├── index.html
        ├── *.js
        └── *.css
```

---

## 🔑 主要ファイル説明

### 📋 ドキュメント

| ファイル | 目的 | 対象者 |
|---------|------|--------|
| `README.md` | プロジェクト全体の概要 | 全員（最初に読む） |
| `QUICKSTART.md` | 5分で始めるガイド | 開発者 |
| `SETUP_GUIDE.md` | 詳細なセットアップ | 開発者 |
| `USER_GUIDE.md` | 操作マニュアル | オーナー（管理者） |
| `ARCHITECTURE.md` | システム設計・拡張情報 | 開発者・保守者 |

### ⚙️ 設定ファイル

#### `package.json`
```json
{
  "name": "cafe-calendar-app",
  "dependencies": {
    "react": "^18.3.1",
    "@supabase/supabase-js": "^2.39.8",
    ...
  }
}
```
**用途**: npm依存パッケージ管理  
**編集**: パッケージ追加時のみ

#### `.env.local` （自分で作成）
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_PASSWORD=your-password
```
**用途**: 環境変数（本番環境では機密情報）  
**編集**: セットアップ時に必須  
**注意**: `.gitignore` に含まれているため git には追加されません

#### `.env.example`
環境変数のテンプレート。`.env.local` を作成する際の参考

#### `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
```
**用途**: Viteビルドツール設定  
**編集**: ポート番号変更時など

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```
**用途**: Vercelデプロイ設定  
**編集**: Vercel固有の設定変更時

#### `.gitignore`
```
node_modules/
dist/
.env.local
```
**用途**: Git から除外するファイル指定

### 💻 ソースコード

#### `src/App.jsx` （ルートコンポーネント）
```jsx
function App() {
  const [view, setView] = useState('public')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  return (
    <div className="app-wrapper">
      <nav>...</nav>
      {view === 'public' && <PublicView />}
      {view === 'admin' && <AdminDashboard />}
      ...
    </div>
  )
}
```
**責務**: 
- ビューの切り替え
- 認証状態の管理
- グローバルナビゲーション

#### `src/components/PublicView.jsx` （公開ページ）
```jsx
export default function PublicView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [patterns, setPatterns] = useState([])
  const [events, setEvents] = useState([])
  const [holidays, setHolidays] = useState([])
  
  return (
    <div className="public-view">
      <h1>営業カレンダー</h1>
      <div className="calendar-grid">
        {/* カレンダー表示 */}
      </div>
    </div>
  )
}
```
**責務**:
- カレンダーの描画
- イベント・祝日の表示
- ユーザーインタラクション

**構成**:
- カレンダーヘッダー（月選択）
- 凡例（営業パターン説明）
- カレンダーグリッド（7列 ✕ 日数行）
- イベントモーダル

#### `src/components/AdminDashboard.jsx` （管理画面）
```jsx
export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('schedule')
  
  return (
    <div className="admin-dashboard">
      <header>...</header>
      <nav>
        <button onClick={() => setActiveTab('schedule')}>営業パターン</button>
        <button onClick={() => setActiveTab('events')}>イベント</button>
      </nav>
      <div>
        {activeTab === 'schedule' && <ScheduleManager />}
        {activeTab === 'events' && <EventManager />}
      </div>
    </div>
  )
}
```
**責務**:
- タブナビゲーション
- ログアウト処理

#### `src/components/ScheduleManager.jsx` （営業パターン管理）
```jsx
export default function ScheduleManager({ setError }) {
  const [patterns, setPatterns] = useState([])
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({...})
  
  return (
    <div className="manager-container">
      <form>{/* パターン追加フォーム */}</form>
      <table>{/* パターン一覧 */}</table>
    </div>
  )
}
```
**機能**:
- CRUD（作成・読取・更新・削除）
- フォームバリデーション
- リアルタイム表示

#### `src/components/EventManager.jsx` （イベント管理）
```jsx
export default function EventManager({ setError }) {
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({...})
  
  return (
    <div className="manager-container">
      <form>{/* イベント追加フォーム */}</form>
      <div className="events-cards">{/* イベント一覧カード */}</div>
    </div>
  )
}
```
**機能**:
- イベントCRUD
- 画像プレビュー
- 公開/下書き切り替え

#### `src/components/LoginPage.jsx` （ログイン）
```jsx
export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e) => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      storageUtils.setAuth(password)
      onLogin()
    }
  }
  
  return <div className="login-page">...</div>
}
```
**機能**:
- シンプルなパスワード認証
- エラーメッセージ表示

### 🔧 ライブラリ（lib/）

#### `src/lib/supabase.js` （Supabaseクライアント）
```javascript
export const supabase = createClient(url, key)

export const scheduleApi = {
  async getAll() { ... },
  async create(data) { ... },
  async update(id, data) { ... },
  async delete(id) { ... }
}

export const eventApi = {
  async getAll() { ... },
  async create(data) { ... },
  async update(id, data) { ... },
  async delete(id) { ... }
}
```
**責務**:
- Supabase初期化
- API呼び出しの抽象化

#### `src/lib/holidays.js` （祝日管理）
```javascript
export async function getJapanHolidays(year) { ... }
export async function isHoliday(dateString) { ... }
export async function getMonthHolidays(year, month) { ... }
```
**機能**:
- 祝日取得（内閣府API）
- キャッシング（24時間）
- フォールバック（手動定義）

#### `src/lib/utils.js` （ユーティリティ）
```javascript
export const dateUtils = {
  toDateString(date),
  parseDate(dateString),
  formatDisplay(dateString),
  isToday(dateString),
  ...
}

export const timeUtils = {
  toTimeString(timeString),
  toFullTimeString(timeString),
  formatDisplay(timeString),
  formatRange(startTime, endTime)
}

export const colorUtils = {
  isValidColor(color),
  getContrastColor(hexColor)
}

export const storageUtils = {
  setAuth(password),
  getAuth(),
  isAuthenticated(password)
}
```
**責務**:
- 日付フォーマット
- 時間操作
- 色操作
- ストレージ管理

### 🎨 スタイル

#### `src/App.css` （メインスタイル）
- CSS変数定義（色・間隔・フォント）
- コンポーネント別スタイル
- アニメーション定義
- レスポンシブメディアクエリ

**セクション**:
```css
/* CSS変数とテーマ */
:root { --primary: #E8D5C4; ... }

/* グローバルレイアウト */
.app-wrapper { ... }

/* ナビゲーション */
.navbar { ... }

/* ログインページ */
.login-page { ... }

/* 公開ページ */
.public-view { ... }
.calendar-grid { ... }

/* 管理画面 */
.admin-dashboard { ... }
.admin-tabs { ... }

/* フォーム */
.pattern-form { ... }

/* テーブル */
.patterns-table { ... }

/* レスポンシブ */
@media (max-width: 768px) { ... }
```

#### `src/index.css` （グローバルスタイル）
- フォント読み込み
- リセットCSS
- スクロールバースタイル
- セレクションスタイル

### 📦 静的ファイル

#### `public/logo.png`
- カフェのロゴ
- 推奨サイズ: 240×240px
- PNG推奨（背景透過対応）

---

## 🔄 ファイル間の依存関係

```
App.jsx
├─ PublicView.jsx
│  ├─ supabase.js (scheduleApi, eventApi)
│  ├─ holidays.js (getMonthHolidays)
│  └─ utils.js (dateUtils, timeUtils)
│
├─ AdminDashboard.jsx
│  ├─ ScheduleManager.jsx
│  │  ├─ supabase.js (scheduleApi)
│  │  └─ utils.js (timeUtils)
│  │
│  ├─ EventManager.jsx
│  │  ├─ supabase.js (eventApi)
│  │  └─ utils.js (dateUtils, timeUtils)
│  │
│  └─ LoginPage.jsx
│     └─ utils.js (storageUtils)
│
└─ App.css + index.css
```

---

## 📝 ファイル編集ガイド

### よく編集するファイル

| ファイル | 編集理由 | 難易度 |
|---------|--------|--------|
| `public/logo.png` | ロゴ変更 | ⭐ 簡単 |
| `src/App.css` | 色・フォント変更 | ⭐ 簡単 |
| `.env.local` | API設定変更 | ⭐ 簡単 |
| `src/lib/utils.js` | 日付フォーマット変更 | ⭐⭐ 中程度 |
| `src/components/PublicView.jsx` | カレンダー表示カスタマイズ | ⭐⭐ 中程度 |
| `src/components/ScheduleManager.jsx` | パターン管理UI変更 | ⭐⭐ 中程度 |
| `src/App.jsx` | ナビゲーション追加 | ⭐⭐⭐ 難しい |

### 編集してはいけないファイル

```
❌ node_modules/ → npm install で自動生成
❌ dist/ → npm run build で自動生成
❌ vite.config.js → Viteビルド設定（変更はよく考える）
```

---

## 🚀 デプロイ時に重要なファイル

| ファイル | 用途 |
|---------|------|
| `package.json` | 依存パッケージリスト |
| `vite.config.js` | ビルド設定 |
| `vercel.json` | Vercelデプロイ設定 |
| `.env.local` | 環境変数（Vercelで設定） |
| `src/` | ソースコード |
| `public/` | 静的ファイル |

---

## 💾 バックアップ推奨ファイル

開発中は以下をバックアップしておくと安心：

```bash
# 重要な設定
.env.local
public/logo.png

# カスタマイズ済みコード
src/App.css
src/components/*.jsx
src/lib/*.js
```

---

## 🎓 次のステップ

1. **セットアップ**: `QUICKSTART.md` を実行
2. **開発**: `npm run dev` でローカルサーバー起動
3. **カスタマイズ**: ロゴや色を変更
4. **デプロイ**: `USER_GUIDE.md` でVervelへデプロイ
5. **運用**: `ARCHITECTURE.md` で拡張方法を学ぶ

---

**Happy Coding! 🎉**
