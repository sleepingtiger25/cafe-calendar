# 📖 飲食店営業カレンダー - 完全ガイド

## 📑 目次

1. [セットアップ](#セットアップ)
2. [ローカル開発](#ローカル開発)
3. [デプロイ](#デプロイ)
4. [管理画面の使い方](#管理画面の使い方)
5. [トラブルシューティング](#トラブルシューティング)
6. [カスタマイズ](#カスタマイズ)

---

## セットアップ

### 必要なもの

- **Node.js 18以上**: https://nodejs.org
- **git**: https://git-scm.com
- **Supabaseアカウント（無料）**: https://supabase.com
- **Vercelアカウント（無料）**: https://vercel.com

### Step 1: プロジェクトダウンロード

```bash
# このファイル群をダウンロード後、プロジェクトフォルダを作成
cd /path/to/your/workspace
mkdir cafe-calendar
cd cafe-calendar

# ダウンロードしたファイルをここにコピー
# または git clone の場合
git clone <repository-url>
cd cafe-calendar
```

### Step 2: パッケージをインストール

```bash
npm install
```

これにより以下がインストールされます：
- React 18
- Supabase クライアント
- Vite（ビルドツール）
- その他の依存パッケージ

### Step 3: Supabaseを設定

#### 3.1 プロジェクト作成

1. https://supabase.com にアクセス
2. 「New Project」をクリック
3. 以下を入力：
   - **Project name**: `cafe-calendar` (任意)
   - **Database Password**: 強力なパスワード（メモ）
   - **Region**: `Tokyo` (または最寄りの地域)
4. 「Create new project」をクリック

#### 3.2 テーブル作成

1. Supabaseダッシュボードにログイン
2. 左メニュー「SQL Editor」をクリック
3. 「New query」をクリック
4. 以下の SQL を貼り付け実行：

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

-- セキュリティ設定
ALTER TABLE schedule_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all" ON schedule_patterns
  FOR SELECT USING (true);

CREATE POLICY "Enable read for all" ON events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Enable all for authenticated" ON schedule_patterns
  FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated" ON events
  FOR ALL USING (true);

-- デフォルトパターン挿入
INSERT INTO schedule_patterns (name, start_time, end_time, color, order_index) VALUES
  ('通常営業', '08:30:00', '16:30:00', '#E8D5C4', 0),
  ('土日祝日', '08:00:00', '15:30:00', '#F5E6D3', 1),
  ('短縮営業', '08:30:00', '15:30:00', '#D9C5B0', 2),
  ('月初特別', '09:30:00', '15:30:00', '#C9B5A0', 3),
  ('休日', '00:00:00', '00:00:00', '#CCCCCC', 4);
```

#### 3.3 APIキーを取得

1. Supabaseダッシュボード左メニュー「Settings」→「API」
2. 「Project URL」をコピー
3. 「Anon」キーをコピー（公開用）

### Step 4: 環境変数を設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_PASSWORD=your-strong-password-here
```

⚠️ **セキュリティ注意:**
- `.env.local` は git に追加しない（`.gitignore` に含まれています）
- パスワードは十分に強力に（15文字以上推奨）

---

## ローカル開発

### サーバー起動

```bash
npm run dev
```

ターミナルに表示される URL（通常は `http://localhost:5173`）でアクセス

### ファイル保存時の自動更新

Vite は ファイル保存時に自動でホットリロードします。
ブラウザをリロードすることなく変更が反映されます。

### 開発時の動作確認項目

- [ ] ロゴが表示されるか
- [ ] カレンダーが表示されるか
- [ ] 「管理画面」ボタンがあるか
- [ ] パスワードでログインできるか
- [ ] 営業パターンが表示されるか
- [ ] イベントを追加できるか

---

## デプロイ

### Option 1: Vercel へのデプロイ（推奨）

#### 1. GitHub にプッシュ

```bash
# 初回の場合
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/cafe-calendar.git
git push -u origin main
```

#### 2. Vercel に接続

1. https://vercel.com にログイン
2. 「New Project」をクリック
3. GitHub リポジトリを検索・選択
4. 「Import」をクリック

#### 3. 環境変数を設定

1. Vercel ダッシュボード → Settings → Environment Variables
2. 以下を追加：

```
Name: VITE_SUPABASE_URL
Value: https://xxxxxxxxxxxx.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```
Name: VITE_ADMIN_PASSWORD
Value: your-strong-password
```

#### 4. デプロイ

1. 「Deploy」をクリック
2. デプロイ完了まで待機（通常1-2分）
3. 表示される URL でアクセス可能

### Option 2: 他のホスティング

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

---

## 管理画面の使い方

### ログイン

1. トップページの「管理画面」ボタンをクリック
2. パスワードを入力（`.env.local` の `VITE_ADMIN_PASSWORD`）
3. 「ログイン」をクリック

### 営業時間パターン管理

#### パターンの追加

1. 「営業時間パターン」タブを選択
2. 以下を入力：
   - **パターン名**: 例「通常営業」
   - **開始時間**: 例「08:30」
   - **終了時間**: 例「16:30」
   - **色**: カラーピッカーで選択
3. 「追加」をクリック

#### パターンの編集

1. 既存パターンの「編集」アイコンをクリック
2. 情報を変更
3. 「更新」をクリック

#### パターンの削除

1. パターンの「削除」アイコンをクリック
2. 確認ダイアログで「OK」をクリック

#### デフォルトパターン

| 名前 | 時間 | 用途 |
|------|------|------|
| 通常営業 | 08:30～16:30 | 平日の営業時間 |
| 土日祝日 | 08:00～15:30 | 土日祝日の営業時間 |
| 短縮営業 | 08:30～15:30 | 営業時間を短縮する日 |
| 月初特別 | 09:30～15:30 | 月初の特別営業時間 |
| 休日 | 定休日 | 店舗が休む日 |

**カスタマイズ例:**
- お盆営業: 09:00～17:00
- 深夜営業: 20:00～05:00
- 臨時営業: 11:00～19:00

### イベント管理

#### イベントの追加

1. 「イベント管理」タブを選択
2. 以下を入力：
   - **イベントタイトル**: 例「新メニュー発表会」
   - **開催日**: カレンダーから選択
   - **開始時間**: オプション（終日イベントの場合は空）
   - **説明**: イベント内容（改行対応）
   - **カバー画像URL**: 例「https://example.com/image.jpg」
   - **詳細ページURL**: 外部サイトのリンク（オプション）
   - **ポップアップ画像URL**: モーダルに表示する画像（オプション）
   - **公開する**: チェック状態で公開
3. 「追加」をクリック

#### 画像の設定方法

**方法1: インターネットから取得**
- 既存の画像 URL を使用
- クラウドストレージ（Google Drive, Dropbox等）から共有 URL を取得

**方法2: 独自にホスティング**
- 無料サービス: Imgur, Cloudinary, Vercel のブレット機能
- 有料サービス: AWS S3, Azure Blob Storage

**推奨イメージサイズ:**
- カバー画像: 800×600px
- ポップアップ画像: 600×400px

#### イベントの編集

1. イベント詳細の「編集」ボタンをクリック
2. 情報を変更
3. 「更新」をクリック

#### イベントの削除

1. イベント詳細の「削除」ボタンをクリック
2. 確認ダイアログで「OK」をクリック

#### 公開/下書き管理

- **公開**: チェック入れ → 公開ページで表示される
- **下書き**: チェック外す → 管理画面でのみ表示

---

## トラブルシューティング

### Q1: "Cannot connect to Supabase" エラー

**原因**: Supabase の URL またはキーが正しくない

**解決**:
1. `.env.local` を確認
2. Supabase ダッシュボード → Settings → API で確認
3. 完全一致しているか確認（空白やタイプ注意）

### Q2: ロゴが表示されない

**原因**: `public/logo.png` が存在しない

**解決**:
1. `public/` フォルダを作成（なければ）
2. `logo.png` をそこに配置
3. サーバー再起動

### Q3: パスワードログインできない

**原因**: `.env.local` のパスワードと入力値が異なる

**解決**:
1. `.env.local` を確認
2. `VITE_ADMIN_PASSWORD=` の値を確認
3. ブラウザの開発者ツール（F12）で確認

### Q4: 祝日が表示されない

**原因**: インターネット接続 または 祝日API エラー

**解決**:
1. インターネット接続を確認
2. ブラウザキャッシュをクリア（Ctrl+Shift+Delete）
3. localStorage をクリア（開発者ツール → Application → localStorage）

### Q5: イベント画像が表示されない

**原因**: URL が無効 または CORS エラー

**解決**:
1. URL が `https://` から始まるか確認
2. URL にアクセスしてブラウザで画像が表示されるか確認
3. 別のホスティングサービスを試す

### Q6: デプロイ後に変更が反映されない

**原因**: キャッシュ または 古いビルド

**解決**:
1. `npm run build` で再ビルド
2. `vercel --prod` で本番デプロイ
3. ブラウザキャッシュクリア（Ctrl+Shift+Delete）

---

## カスタマイズ

### ロゴを変更

1. 飲食店のロゴを `public/logo.png` に配置
2. サーバー再起動

**サイズ目安**: 240×240px、PNG推奨

### 色スキーム を変更

`src/App.css` を編集：

```css
:root {
  --primary: #E8D5C4;        /* メインカラー（ベージュ） */
  --primary-light: #F5E6D3;  /* ライト */
  --secondary: #D9C5B0;      /* セカンダリ */
  --accent: #C9B5A0;         /* アクセント */
}
```

**色選択のコツ:**
- 飲食店の雰囲気に合わせる
- 高級感: グレー・ネイビー・ゴールド
- 明るさ: ベージュ・クリーム・パステル
- モダン: ブラック・ホワイト・グレー

### フォントを変更

`src/index.css` の `@import` を編集：

```css
/* 現在 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

/* 他のオプション */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
```

### パスワードを変更

`.env.local` を編集：

```env
VITE_ADMIN_PASSWORD=new-secure-password
```

**本番環境の場合**: Vercel → Settings → Environment Variables で更新

### メニューテキストを日本語化

コンポーネントのラベルは既に日本語化済みです。
英語化したい場合は各 `.jsx` ファイルで置換してください。

---

## 📱 モバイル対応

このアプリは以下のデバイスで動作確認済みです：

- ✅ iPhone/iPad (iOS 12+)
- ✅ Android スマートフォン (Android 8+)
- ✅ Windows/Mac (Chrome, Safari, Firefox)

**モバイル時の最適化:**
- カレンダーは自動的にスケール
- タッチ操作対応
- 画面サイズに応じて自動調整

---

## 🔐 セキュリティチェックリスト

本番デプロイ前に確認：

- [ ] `.env.local` を `.gitignore` に含める
- [ ] 管理者パスワードを十分に強力に設定
- [ ] HTTPS を使用（Vercel は自動）
- [ ] Supabase の RLS ポリシーを確認
- [ ] API キーをシークレットに管理
- [ ] 定期的にパスワードを変更
- [ ] 不要な画像ファイルを削除

**本番環境では:**
- より強固な認証（Supabase Auth等）の導入を推奨
- API キーのローテーション体制を構築
- アクセスログの監視を検討

---

## 📞 サポート・よくある質問

### Q: 複数の営業店舗に対応したい

**A**: 現バージョンは単一店舗向けです。
複数店舗対応には、データベーススキーマの変更が必要です。
(ARCHITECTURE.md の「拡張ポイント」を参照)

### Q: SNS に自動投稿したい

**A**: `EventManager.jsx` を拡張して、イベント作成時に
Zapier や IFTTT を使用した自動投稿を実装できます。

### Q: メール通知を送りたい

**A**: Supabase の Functions または SendGrid/Mailgun の
API を使用して実装できます。

### Q: スマートフォンアプリ化したい

**A**: React Native または Flutter で再実装することで対応可能です。

---

## 📚 参考リンク

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [date-fns Documentation](https://date-fns.org)

---

## 📄 ライセンス

MIT License - 自由に使用・修正・配布できます

---

**ご質問・バグ報告は GitHub Issues でお願いします。**

**Happy Coding! 🎉🍽️**
