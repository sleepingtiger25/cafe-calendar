# 🍽️ 飲食店営業カレンダー Webアプリ - 完全ガイド

**最初にこのページを読んでください。** 📖

---

## 📚 ドキュメント一覧

このプロジェクトには複数のドキュメントが含まれています。
目的に応じて読むドキュメントを選択してください。

### 🚀 まず最初に読むべきドキュメント

#### 1️⃣ **README.md**
> プロジェクト全体の概要・機能説明

**誰が読むべき**: 全員
**所要時間**: 5分
**内容**: 
- プロジェクトの目的
- 主な機能一覧
- 技術スタック
- ファイル構成概要

👉 [README.md を読む](./README.md)

---

#### 2️⃣ **QUICKSTART.md**
> 5分で開始できる最小限のセットアップガイド

**誰が読むべき**: 開発者（すぐに始めたい人）
**所要時間**: 5分
**内容**:
- Node.js のインストール確認
- Supabase プロジェクト作成
- 環境変数設定
- ローカルサーバー起動

👉 [QUICKSTART.md を読む](./QUICKSTART.md)

---

### 📖 詳細なセットアップ・使い方ガイド

#### 3️⃣ **SETUP_GUIDE.md**
> Supabase セットアップの詳細手順

**誰が読むべき**: 開発者（細かく知りたい人）
**所要時間**: 15分
**内容**:
- Supabase プロジェクト作成の詳細
- SQLテーブル作成
- API キー取得方法
- デフォルトデータ挿入

👉 [SETUP_GUIDE.md を読む](./SETUP_GUIDE.md)

---

#### 4️⃣ **USER_GUIDE.md**
> オーナー向けの完全操作マニュアル

**誰が読むべき**: カフェオーナー・管理者
**所要時間**: 20分
**内容**:
- ログイン方法
- 営業パターンの追加・編集・削除
- イベントの追加・編集・削除
- トラブルシューティング
- カスタマイズ方法

👉 [USER_GUIDE.md を読む](./USER_GUIDE.md)

---

### 🏗️ 技術ドキュメント

#### 5️⃣ **ARCHITECTURE.md**
> システム設計・アーキテクチャ解説

**誰が読むべき**: 開発者・保守者
**所要時間**: 30分
**内容**:
- システム全体図
- データベーススキーマ詳細
- コンポーネント設計
- データフロー
- セキュリティ設計
- パフォーマンス最適化
- 拡張ポイント

👉 [ARCHITECTURE.md を読む](./ARCHITECTURE.md)

---

#### 6️⃣ **FILE_STRUCTURE.md**
> ファイル構成・各ファイルの説明

**誰が読むべき**: 開発者・保守者
**所要時間**: 20分
**内容**:
- プロジェクトディレクトリ全体図
- 各ファイルの責務
- ファイル依存関係
- 編集ガイドライン
- バックアップ推奨ファイル

👉 [FILE_STRUCTURE.md を読む](./FILE_STRUCTURE.md)

---

#### 7️⃣ **TROUBLESHOOTING.md**
> トラブルシューティング完全ガイド

**誰が読むべき**: 全員（問題が発生した時）
**所要時間**: 必要な部分だけ読む
**内容**:
- セットアップ時のエラー解決
- Supabase 接続エラー
- ローカル開発エラー
- UI 表示エラー
- 認証エラー
- デプロイエラー
- デバッグのコツ

👉 [TROUBLESHOOTING.md を読む](./TROUBLESHOOTING.md)

---

## 🎯 用途別ガイド

### 👨‍💻 開発者向け

```
1. README.md で概要把握
   ↓
2. QUICKSTART.md でセットアップ
   ↓
3. SETUP_GUIDE.md で詳細を確認
   ↓
4. FILE_STRUCTURE.md でコード構成を理解
   ↓
5. ARCHITECTURE.md で設計を学ぶ
   ↓
6. 開発スタート！
   ↓
7. エラーが出たら TROUBLESHOOTING.md を参照
```

### 👔 カフェオーナー向け

```
1. USER_GUIDE.md を読む
   ↓
2. 管理画面にログイン
   ↓
3. 営業パターンを設定
   ↓
4. イベントを登録
   ↓
5. 公開ページで確認
```

### 🚀 デプロイする人向け

```
1. QUICKSTART.md の「Vercelにデプロイ」セクション
   ↓
2. GitHub にプッシュ
   ↓
3. Vercel に接続
   ↓
4. 環境変数設定
   ↓
5. デプロイ完了！
```

---

## 📋 チェックリスト

### セットアップ前のチェック

- [ ] Node.js 18 以上がインストール済み
- [ ] git がインストール済み
- [ ] Supabase アカウント作成済み
- [ ] テキストエディタ用意済み（VS Code等）

### セットアップ時のチェック

- [ ] `npm install` 完了
- [ ] `.env.local` ファイル作成済み
- [ ] Supabase テーブル作成済み
- [ ] API キーが `.env.local` に正しく設定
- [ ] `npm run dev` で起動確認

### 公開前のチェック

- [ ] ロゴを `public/logo.png` に配置
- [ ] カフェ情報が正確か確認
- [ ] 営業パターンを登録
- [ ] テストイベントを登録
- [ ] モバイルで表示確認
- [ ] 祝日が正しく表示されているか確認

### デプロイ前のチェック

- [ ] GitHub にプッシュ済み
- [ ] Vercel 環境変数設定済み
- [ ] テスト環境ですべて動作確認
- [ ] ドメイン設定完了（あれば）

---

## 🔑 重要なファイル

| ファイル | 説明 | 編集頻度 |
|---------|------|--------|
| `.env.local` | 環境変数（API キー等） | セットアップ時のみ |
| `public/logo.png` | カフェロゴ | カスタマイズ時 |
| `src/App.css` | 色・フォント設定 | カスタマイズ時 |
| `package.json` | npm 依存パッケージ | パッケージ追加時 |
| `src/components/PublicView.jsx` | 公開ページ | カスタマイズ時 |
| `src/lib/supabase.js` | Supabase API | 機能追加時 |

---

## 🚀 クイックコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド（本番用）
npm run build

# ビルドをプレビュー
npm run preview

# 依存パッケージ更新
npm update

# サンプルデータ投入
node seed-data.js

# Vercel デプロイ
vercel --prod
```

---

## 📊 プロジェクト統計

| 項目 | 値 |
|------|-----|
| **総ファイル数** | 20+ |
| **React コンポーネント** | 5個 |
| **ライブラリ関数** | 30+個 |
| **CSS 行数** | 1,500+行 |
| **ドキュメント** | 8つ |
| **デフォルト営業パターン** | 5個 |
| **対応デバイス** | PC・タブレット・スマートフォン |

---

## 💾 ディレクトリ構成（簡略版）

```
cafe-calendar-app/
├── 📚 ドキュメント/
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── SETUP_GUIDE.md
│   ├── USER_GUIDE.md
│   ├── ARCHITECTURE.md
│   ├── FILE_STRUCTURE.md
│   └── TROUBLESHOOTING.md
│
├── 🔧 セットアップ/
│   ├── setup.sh (macOS/Linux)
│   ├── setup.bat (Windows)
│   └── seed-data.js (サンプルデータ)
│
├── ⚙️ 設定/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env.example
│   ├── .env.local (作成が必要)
│   ├── .gitignore
│   └── index.html
│
├── 💻 ソースコード (src/)
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/ (5つのコンポーネント)
│   └── lib/ (3つのライブラリ)
│
├── 🎨 ロゴ (public/)
│   └── logo.png
│
└── 📦 ビルド出力 (dist/)
    └── （npm run build で自動生成）
```

---

## 🎓 学習ロードマップ

**完全初心者向け**:
1. README.md で全体像を把握
2. QUICKSTART.md に従ってセットアップ
3. USER_GUIDE.md で操作を学ぶ
4. 本番環境へデプロイ

**開発経験者向け**:
1. README.md で概要確認
2. QUICKSTART.md でセットアップ
3. ARCHITECTURE.md でコード設計を確認
4. FILE_STRUCTURE.md でファイル構成を理解
5. コードカスタマイズ開始

**高度なカスタマイズ向け**:
1. ARCHITECTURE.md で拡張ポイントを確認
2. FILE_STRUCTURE.md でファイル依存関係を理解
3. データベーススキーマ拡張
4. コンポーネント追加・修正

---

## 🔗 外部リンク

### 公式ドキュメント

- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [date-fns Documentation](https://date-fns.org)

### 参考資料

- [JavaScript 基本文法](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [CSS リファレンス](https://developer.mozilla.org/ja/docs/Web/CSS)
- [REST API 基本](https://restfulapi.net)

---

## 🆘 ヘルプが必要な場合

### よくある問題

| 問題 | ドキュメント |
|------|----------|
| セットアップがわからない | QUICKSTART.md |
| エラーが出た | TROUBLESHOOTING.md |
| 操作方法がわからない | USER_GUIDE.md |
| コードをカスタマイズしたい | ARCHITECTURE.md |
| ファイルの意味がわからない | FILE_STRUCTURE.md |

### サポート手順

1. **エラーメッセージをググる**
   - 詳細なエラーメッセージをコピー
   - Google で検索

2. **このガイドを確認**
   - TROUBLESHOOTING.md をチェック
   - 当てはまる項目を参照

3. **GitHub Issues で報告**
   - エラー内容を詳しく記入
   - スクリーンショットも追加

---

## ✨ プロジェクトハイライト

### 🎯 このプロジェクトの特徴

✅ **シンプル**: 不要な複雑性を排除  
✅ **使いやすい**: オーナー向けUI最適化  
✅ **保守性が高い**: 拡張がしやすい設計  
✅ **レスポンシブ**: 全デバイス対応  
✅ **セキュア**: Supabase の RLS を活用  
✅ **本番環境対応**: Vercel で簡単デプロイ  

### 🚀 できること

- 📅 営業時間を複数パターン管理
- 🎉 イベント情報の掲載
- 🗓️ 祝日の自動表示
- 📱 スマートフォン対応
- 🔐 オーナー認証
- 🎨 カスタマイズ可能なデザイン

---

## 📞 問い合わせ・フィードバック

このプロジェクトについて、ご質問や改善提案がある場合：

1. **ドキュメントを確認**
   - このガイドに答えがあるか確認

2. **GitHub Issues**
   - 詳細な情報と共に報告

3. **メール**
   - プロジェクト管理者に連絡

---

## 📄 ライセンス

MIT License - 自由に使用・修正・配布できます

---

## 🎉 ようこそ！

このプロジェクトをお選びいただき、ありがとうございます。

**次のステップ:**
1. 上記の用途別ガイドから、自分に合ったドキュメントを選択
2. その指示に従ってセットアップ
3. わからないことがあれば TROUBLESHOOTING.md を参照

**Happy Coding! 🍽️💻✨**

---

**最終更新**: 2024年4月23日  
**バージョン**: 1.0.0  
**対応環境**: Node.js 18+, Chrome/Safari/Firefox 最新版
