# 🍽️ 飲食店営業カレンダー Webアプリ

飲食店・カフェ向けの営業日カレンダー管理システムです。PC/モバイル両対応で、公開ページと管理画面を備えています。

## ✨ 主な機能

### 📅 公開ページ
- **カレンダー表示**: 営業時間、イベント、祝日を色分けで表示
- **レスポンシブ対応**: スマートフォンでも見やすいデザイン
- **祝日自動取得**: 日本の祝日を自動で認識
- **イベント表示**: タイトル、画像、時間、詳細リンク機能

### 🔧 管理画面（オーナー用）
- **営業パターン管理**: 複数の営業時間パターンを作成・編集・削除
- **イベント管理**: イベントの追加・編集・削除
- **簡易認証**: パスワード入力でログイン
- **わかりやすいUI**: 初心者でも簡単に操作可能

## 🛠️ 技術スタック

| レイヤー | 技術 |
|---------|------|
| **Frontend** | React 18 + Vite |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Vercel |
| **認証** | 簡易パスワード認証 |
| **UI** | Lucide React Icons + Custom CSS |

## 📦 デフォルト営業パターン

1. **通常営業** - 08:30～16:30 (ベージュ)
2. **土日祝日** - 08:00～15:30 (ライトベージュ)
3. **短縮営業** - 08:30～15:30 (グレイベージュ)
4. **月初特別** - 09:30～15:30 (ダークベージュ)
5. **休日** - 定休日 (グレー)

## 🎨 デザイン特徴

- **Noto Sansフォント**: 日本語対応で見やすい
- **明るいベージュ色**: 清潔感のあるカフェの雰囲気
- **シンプルモダン**: 操作がしやすいUI
- **色分け表示**: 営業時間を視覚的に区別

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- npm または yarn
- Supabaseアカウント
- Vercelアカウント（デプロイ用）

### 1. リポジトリクローン

```bash
git clone <repository-url>
cd cafe-calendar-app
```

### 2. パッケージインストール

```bash
npm install
```

### 3. 環境変数設定

`.env.local` を作成して以下を設定：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-secure-password
```

### 4. ローカル開発

```bash
npm run dev
```

`http://localhost:5173` でアクセス可能

### 5. ビルド

```bash
npm run build
```

## 📝 Supabaseセットアップ

詳細は `SETUP_GUIDE.md` をご覧ください。

### 必要なテーブル

- **schedule_patterns**: 営業時間パターン
- **events**: イベント情報

## 🔐 セキュリティに関する注意

⚠️ 現在は簡易パスワード認証です。本番環境では以下の導入を推奨：

- Supabase Authentication
- Auth0
- Firebase Authentication
- または他のOAuth プロバイダー

## 📱 ファイル構成

```
src/
├── components/
│   ├── PublicView.jsx          # 公開ページ（カレンダー）
│   ├── AdminDashboard.jsx      # 管理画面
│   ├── ScheduleManager.jsx     # 営業パターン管理
│   ├── EventManager.jsx        # イベント管理
│   └── LoginPage.jsx           # ログインページ
├── lib/
│   ├── supabase.js             # Supabaseクライアント
│   ├── holidays.js             # 祝日取得API
│   └── utils.js                # ユーティリティ関数
├── App.jsx                     # メインアプリケーション
├── App.css                     # メインスタイル
├── main.jsx                    # エントリーポイント
└── index.css                   # グローバルスタイル

public/
└── logo.png                    # カフェロゴ（カスタマイズ必要）
```

## 🌐 デプロイ

### Vercelへのデプロイ

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

### 環境変数設定（Vercel）

Vercel ダッシュボード → Settings → Environment Variables で以下を追加：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD`

## 📖 使用方法

### 公開ページ

1. トップページはカレンダー表示
2. 各日付をクリックするとイベント詳細を表示
3. 左右の矢印で月を移動
4. 凡例で営業パターンを確認

### 管理画面

1. トップページの「管理画面」ボタンをクリック
2. パスワードを入力（`VITE_ADMIN_PASSWORD`）
3. 「営業時間パターン」タブで営業パターンを管理
4. 「イベント管理」タブでイベントを登録

## 🆘 トラブルシューティング

### Supabaseに接続できない
- 環境変数を確認
- Supabase コンソールで URL と キーを確認
- CORS設定を確認

### ロゴが表示されない
- `public/logo.png` に画像ファイルを配置

### 祝日が表示されない
- インターネット接続を確認
- ブラウザのコンソールでエラーを確認

## 🎯 カスタマイズ

### ロゴ変更

`public/logo.png` をカフェのロゴで置き換え

### 色スキーム変更

`src/App.css` の CSS変数を編集：

```css
:root {
  --primary: #E8D5C4;      /* メインカラー */
  --secondary: #F5E6D3;    /* サブカラー */
  --accent: #C9B5A0;       /* アクセントカラー */
}
```

### フォント変更

`src/index.css` の `@import` URLを変更

## 📞 サポート

問題や質問がある場合は、GitHub Issues で報告してください。

## 📄 ライセンス

MIT License - 自由に使用、修正、配布できます

## 🙏 謝辞

- React チーム
- Supabase チーム
- Vercel チーム
- Lucide Icons

---

**楽しいカフェ営業を！** 🎉
# Updated
