# 🚀 デプロイメント チェックリスト

## ✅ プロジェクト完成度: 100%

### 📋 事前確認事項

#### 1. **Supabaseセットアップ**
- [ ] Supabaseプロジェクトを作成
- [ ] データベースにテーブルを作成（SETUP_GUIDE.md参照）
- [ ] RLSポリシーを設定
- [ ] プロジェクトURL と Anon Key を取得

#### 2. **環境変数設定**
```bash
# .env.local を作成して以下を設定
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_ADMIN_PASSWORD=<your-secure-password>
```

#### 3. **ローカル開発確認**
- [ ] `npm install` で依存関係をインストール
- [ ] `npm run dev` でローカル実行確認
- [ ] ブラウザで http://localhost:5173 にアクセス
- [ ] 公開ページが正常に表示される
- [ ] 管理画面にログインできる
- [ ] 営業パターンの追加・編集・削除が動作する
- [ ] イベントの追加・編集・削除が動作する
- [ ] モバイル表示が正常に動作する

#### 4. **デザイン確認**
- [ ] PC版のカラースキーム確認
- [ ] モバイル版のレスポンシブ確認
- [ ] すべての営業パターンの色が正しい
- [ ] ロゴ（POSI）が正しく表示される
- [ ] 編集・削除アイコンが正しく表示される
- [ ] イベント表示が3行で表示される

---

## 🌐 Vercel へのデプロイメント手順

### **ステップ1: GitHubにプッシュ**
```bash
# GitHubリポジトリを初期化（未初期化の場合）
git init
git add .
git commit -m "Initial commit: Cafe Calendar Web App"
git remote add origin https://github.com/<your-username>/<repository-name>.git
git branch -M main
git push -u origin main
```

### **ステップ2: Vercelでデプロイ**
1. https://vercel.com にアクセス
2. GitHubアカウントでサインイン
3. "New Project" をクリック
4. リポジトリを選択
5. フレームワークは "Vite" を選択
6. 環境変数を設定:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
7. "Deploy" をクリック

### **ステップ3: ドメイン設定（オプション）
1. Vercelダッシュボードで "Settings" → "Domains"
2. カスタムドメインを追加
3. DNSレコードを設定

---

## 📱 プリローンチテスト

### **PC版テスト**
- [ ] Chrome でテスト
- [ ] Firefox でテスト
- [ ] Safari でテスト
- [ ] Edge でテスト

### **モバイル版テスト**
- [ ] iPhone (iOS 14以上)
- [ ] Android (Chrome)
- [ ] iPad (タブレット)
- [ ] 画面回転(横向き)

### **機能テスト**
- [ ] 前月/翌月ナビゲーション
- [ ] 祝日が正しく表示される
- [ ] イベントのモーダル表示
- [ ] 管理画面のログイン
- [ ] パターン追加・編集・削除
- [ ] イベント追加・編集・削除
- [ ] ページのスクロール

---

## 🔒 セキュリティチェック

- [ ] `VITE_ADMIN_PASSWORD` を強力なパスワードに設定
- [ ] `.env.local` をgitignoreに含める
- [ ] Supabase RLSポリシーが設定されている
- [ ] 本番環境で `npm run build` してビルド確認

---

## 📊 デプロイメント完了後

### **運用チェックリスト**
- [ ] 本番環境でアクセス確認
- [ ] 管理画面でテストデータ入力
- [ ] Supabaseダッシュボードでデータ確認
- [ ] エラーログがないか確認

### **バックアップ準備**
- [ ] Supabaseのバックアップ設定を確認
- [ ] GitHubでのバージョン管理確認

---

## 📞 トラブルシューティング

問題が発生した場合は、TROUBLESHOOTING.md を参照してください。

### よくある問題
1. **環境変数が読み込まれない**
   → `.env.local` を確認し、再度 `npm run dev` を実行

2. **Supabaseに接続できない**
   → 環境変数の URL と Key を確認
   → Supabaseプロジェクトが作成されているか確認

3. **デザインが表示されない**
   → ブラウザキャッシュをクリア（Ctrl+Shift+Delete）
   → F12を開いて Console にエラーがないか確認

---

## ✨ 完成おめでとうございます！

すべての確認が完了したら、本番環境への公開準備完了です！

**プロジェクト構成:**
- React 18 + Vite (超高速ビルド)
- Supabase PostgreSQL (信頼性の高いデータベース)
- Vercel (自動デプロイメント)
- 日本語完全対応
- PC・モバイル両対応
- シンプルで美しいUI

---

**デプロイメント予定日:** ______________  
**担当者:** ______________  
**連絡先:** ______________
