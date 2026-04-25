# 🆘 トラブルシューティングガイド

このガイドは、開発中に発生する一般的な問題と解決方法をまとめています。

---

## セットアップ時のエラー

### ❌ "Node.js is not installed"

**症状**: `command not found: node`

**原因**: Node.js がインストールされていない

**解決**:
1. https://nodejs.org にアクセス
2. LTS版（16.x以上）をダウンロード
3. インストーラーを実行
4. ターミナルを再起動
5. `node --version` で確認

```bash
# インストール確認
node --version  # v18.x.x以上
npm --version   # 9.x以上
```

---

### ❌ "npm ERR! not a git repository"

**症状**: npm install 時のエラー

**原因**: git が初期化されていない

**解決**:
```bash
git init
git add .
git commit -m "Initial commit"
npm install
```

---

### ❌ "ENOENT: no such file or directory, open '.env.local'"

**症状**: `.env.local` が見つからないエラー

**原因**: 環境変数ファイルが作成されていない

**解決**:
1. `.env.example` をコピー
2. `.env.local` として保存
3. 実際の値を入力

```bash
cp .env.example .env.local
# テキストエディタで .env.local を編集
```

---

## Supabase接続エラー

### ❌ "Cannot connect to Supabase"

**症状**: ネットワーク接続エラー、カレンダーが空白

**原因**: 
- `.env.local` の URL またはキーが不正
- Supabase プロジェクトが削除されている

**解決**:
1. **Supabase ダッシュボール確認**:
   - 左メニュー「Settings」→「API」
   - 「Project URL」をコピー
   - 「Anon」キーをコピー

2. **`.env.local` を更新**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. **ブラウザ再起動**:
   - 開発サーバーを停止 (Ctrl+C)
   - `npm run dev` で再起動
   - キャッシュをクリア (Ctrl+Shift+Delete)

### ❌ "401 Unauthorized"

**症状**: Supabase からの 401 エラー

**原因**: Anon キーが無効

**解決**:
1. Supabase コンソール → Anon キーを確認
2. キーが有効期限内か確認
3. キーをローテーション（Settings → API → Rotate）
4. `.env.local` で新しいキーに更新

### ❌ "policy_violation"

**症状**: "policy_violation" エラーが console に出現

**原因**: Row Level Security (RLS) ポリシーが正しく設定されていない

**解決**:
1. Supabase → SQL Editor
2. 以下を実行して RLS を再作成:

```sql
-- 既存ポリシーを削除
DROP POLICY IF EXISTS "Enable read for all" ON schedule_patterns;
DROP POLICY IF EXISTS "Enable read for all" ON events;
DROP POLICY IF EXISTS "Enable all for authenticated" ON schedule_patterns;
DROP POLICY IF EXISTS "Enable all for authenticated" ON events;

-- 新しいポリシーを作成
CREATE POLICY "Enable read for all" ON schedule_patterns
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all" ON events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Enable all for authenticated" ON schedule_patterns
  FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated" ON events
  FOR ALL USING (true);
```

---

## ローカル開発エラー

### ❌ "Port 5173 is already in use"

**症状**: `EADDRINUSE: address already in use :::5173`

**原因**: 別のプロセスがポート 5173 を使用している

**解決**:

#### macOS/Linux
```bash
# ポートを使用しているプロセスを確認
lsof -i :5173

# プロセスをkill
kill -9 <PID>

# または別のポートで起動
npm run dev -- --port 3000
```

#### Windows
```cmd
# ポートを使用しているプロセスを確認
netstat -ano | findstr :5173

# プロセスをkill
taskkill /PID <PID> /F

# または別のポートで起動
npm run dev -- --port 3000
```

### ❌ "react is not defined"

**症状**: React コンポーネント内でエラー

**原因**: `import React from 'react'` が忘れられている

**解決**:
```jsx
import React, { useState, useEffect } from 'react'  // ← 追加

export default function MyComponent() {
  // ...
}
```

### ❌ "Module not found: 'lucide-react'"

**症状**: アイコンが読み込めない

**原因**: lucide-react がインストールされていない

**解決**:
```bash
npm install lucide-react
npm run dev
```

### ❌ "Cannot read property 'map' of undefined"

**症状**: カレンダーが表示されない、エラーがコンソールに出現

**原因**: 状態（patterns, events など）が undefined

**解決**:
1. **初期値を設定**:
```jsx
const [patterns, setPatterns] = useState([])  // ← 空配列で初期化
```

2. **null チェック追加**:
```jsx
{patterns && patterns.map(pattern => (
  <div key={pattern.id}>{pattern.name}</div>
))}
```

### ❌ "Warning: Each child in a list should have a unique key prop"

**症状**: コンソールに警告が出現

**原因**: map() で unique な key を指定していない

**解決**:
```jsx
// ❌ 間違い
{patterns.map((pattern, index) => (
  <div key={index}>{pattern.name}</div>  // index は避ける
))}

// ✅ 正解
{patterns.map(pattern => (
  <div key={pattern.id}>{pattern.name}</div>  // unique な id を使用
))}
```

---

## UI・表示エラー

### ❌ ロゴが表示されない

**症状**: ロゴエリアが空白

**原因**: 
- `public/logo.png` が存在しない
- ファイルパスが間違っている

**解決**:
1. `public/` ディレクトリを作成（なければ）
2. `logo.png` をそこに配置
3. ファイル拡張子を確認（大文字・小文字）
4. サーバー再起動
5. ブラウザキャッシュクリア (Ctrl+Shift+Delete)

### ❌ 色がおかしい（背景が紫など）

**症状**: CSS変数が正しく読み込まれていない

**原因**: `src/App.css` に CSS変数定義がない

**解決**:
`src/App.css` の先頭を確認:
```css
:root {
  --primary: #E8D5C4;
  --primary-light: #F5E6D3;
  --secondary: #D9C5B0;
  --accent: #C9B5A0;
  ...
}
```

### ❌ フォントがシステムフォント（ゴシック体など）

**症状**: Noto Sans JP が読み込まれていない

**原因**: Google Fonts へのアクセス制限

**解決**:
1. `src/index.css` の @import を確認
2. インターネット接続を確認
3. VPN をオフにして試す

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');
```

### ❌ モバイルで表示が崩れる

**症状**: スマートフォンでレイアウトが壊れている

**原因**: メディアクエリが正しく機能していない

**解決**:
1. `index.html` の viewport meta タグを確認:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

2. ブラウザの開発者ツール（F12）で確認:
   - モバイル表示でテスト（Ctrl+Shift+M）
   - メディアクエリをチェック

---

## 認証エラー

### ❌ ログインできない

**症状**: 「パスワードが正しくありません」と表示

**原因**: 
- パスワードの入力ミス
- `.env.local` のパスワードと異なる

**解決**:
1. `.env.local` を確認:
```env
VITE_ADMIN_PASSWORD=your-password
```

2. **パスワードをリセット**:
   - `.env.local` を編集
   - 新しいパスワードを設定
   - サーバー再起動

### ❌ "sessionStorage is not defined"

**症状**: Node.js 環境でエラー

**原因**: サーバー側レンダリング時に sessionStorage にアクセス

**解決**:
```javascript
// ブラウザ環境のみで実行
if (typeof window !== 'undefined') {
  sessionStorage.setItem('key', value)
}
```

---

## イベント・画像エラー

### ❌ イベント画像が表示されない

**症状**: 画像が「×」で表示される

**原因**:
1. URL が無効
2. CORS エラー
3. サーバーが画像を返していない

**解決**:
1. **URL を確認**:
   - ブラウザで直接アクセス可能か試す
   - `https://` から始まるか確認

2. **CORS エラーの場合**:
   ```javascript
   // img タグにエラーハンドラーを追加
   <img
     src={url}
     onError={(e) => {
       console.error('Image load error:', url)
       e.target.src = '/fallback-image.png'  // フォールバック
     }}
   />
   ```

3. **別のホスティングサービスを試す**:
   - Imgur: https://imgur.com
   - Cloudinary: https://cloudinary.com
   - Vercel Blob (本番環境)

### ❌ "Failed to fetch" エラー

**症状**: API リクエストが失敗

**原因**: 
- インターネット接続が切れている
- Supabase サーバーがダウンしている
- CORS ポリシーが拒否

**解決**:
1. インターネット接続を確認
2. Supabase Status Page を確認: https://status.supabase.com
3. ブラウザコンソールで詳細なエラーを確認 (F12 → Console)

---

## パフォーマンス問題

### ❌ アプリが遅い

**症状**: カレンダーのレンダリングが遅い、操作が重い

**原因**:
1. Supabase のレスポンスが遅い
2. 大量のイベントが登録されている
3. ブラウザのメモリが逼迫

**解決**:
1. **Supabase クエリ最適化**:
```javascript
// より効率的なクエリ
const { data } = await supabase
  .from('events')
  .select('id, title, event_date')  // 必要なカラムのみ
  .order('event_date', { ascending: true })
```

2. **メモリクリア**:
   - ブラウザキャッシュクリア (Ctrl+Shift+Delete)
   - localStorage をクリア

3. **祝日キャッシュをクリア**:
```javascript
// ブラウザコンソール (F12)
localStorage.removeItem('japan_holidays')
```

### ❌ ビルドが遅い

**症状**: `npm run build` に時間がかかる

**原因**: 大量のファイルを処理中

**解決**:
```bash
# ビルドの詳細を確認
npm run build -- --debug

# または別の方法
npm cache clean --force
npm install
npm run build
```

---

## デプロイエラー

### ❌ "Build failed on Vercel"

**症状**: Vercel デプロイが失敗

**原因**: 環境変数が設定されていない

**解決**:
1. Vercel ダッシュボール → Settings
2. Environment Variables セクション確認
3. 以下が設定されているか確認:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`

4. 変更後、再デプロイ:
```bash
vercel --prod
```

### ❌ "Cannot find module 'react'"

**症状**: Vercel で React が見つからないエラー

**原因**: `package.json` に React がリストされていない

**解決**:
1. ローカルで確認:
```bash
npm list react
npm list react-dom
```

2. 必要なら再インストール:
```bash
npm install react react-dom
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### ❌ 本番環境でロゴが表示されない

**症状**: Vercel では見えるが、本番 URL では見えない

**原因**: `public/logo.png` がビルドに含まれていない

**解決**:
1. `public/` ディレクトリに logo.png が存在するか確認
2. git に追加:
```bash
git add public/logo.png
git commit -m "Add logo"
git push
```

3. Vercel で再デプロイ

---

## ブラウザコンソールの確認方法

**エラーの詳細を確認する手順**:

1. **F12 キーを押す** （または Ctrl+Shift+I / Cmd+Option+I）
2. **Console タブ**を開く
3. 赤い エラーメッセージを確認
4. エラーメッセージをコピーして Google で検索

**よくあるコンソールメッセージ**:

| メッセージ | 意味 | 解決方法 |
|-----------|------|--------|
| `Cannot read property 'map' of undefined` | データが読み込まれていない | 初期値を設定 |
| `CORS policy: No 'Access-Control-Allow-Origin' header` | クロスオリジンエラー | 別の画像ホスト使用 |
| `Uncaught TypeError: X is not a function` | 関数がない | import を確認 |
| `Failed to fetch` | API リクエスト失敗 | ネット接続確認 |

---

## デバッグのコツ

### ブレークポイントで一時停止

```javascript
// コード内に記述
debugger;

// ブラウザ再起動後、その行で一時停止
```

### コンソールで状態を確認

```javascript
// ブラウザコンソール (F12)
// React DevTools がインストール済みの場合
$r.state  // コンポーネントの状態を確認
```

### ローカルストレージをクリア

```javascript
// ブラウザコンソール
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## よくあるすべての問題リスト

| 症状 | 最初に確認する | 次に確認する |
|------|-------------|-----------|
| 何も表示されない | インターネット接続 | ブラウザコンソール (F12) |
| エラーがある | エラーメッセージを読む | `.env.local` ファイル |
| ログインできない | パスワード入力 | `.env.local` |
| 画像が見えない | 画像 URL | CORS設定 |
| スマホで崩れる | メディアクエリ | viewport meta タグ |
| 遅い | Supabase connection | ブラウザキャッシュクリア |
| デプロイ失敗 | 環境変数設定 | ビルドログ |

---

## 💡 デバッグのベストプラクティス

1. **エラーメッセージを読む**
   - 日本語・英語関わらず注意深く読む
   - 行番号を確認

2. **コンソールで確認**
   - F12 で Developer Tools を開く
   - Network タブで API リクエストを確認

3. **単純化してテスト**
   - 1つの機能だけ有効にする
   - 他の機能を無効化してテスト

4. **git で差分を確認**
   ```bash
   git diff  # 最後のコミット以降の変更
   ```

5. **バージョンを確認**
   ```bash
   node --version
   npm --version
   npm list react
   ```

---

## 📞 さらにサポートが必要な場合

1. **QUICKSTART.md** を再度実行
2. **SETUP_GUIDE.md** の Supabase セクションを確認
3. **GitHub Issues** で報告
4. **Supabase ドキュメント**: https://supabase.com/docs
5. **React ドキュメント**: https://react.dev

---

**頑張ってください！デバッグは開発の大事なスキルです。🎯**
