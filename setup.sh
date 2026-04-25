#!/bin/bash

# 飲食店営業カレンダー - 自動セットアップスクリプト
# 使用方法: bash setup.sh

set -e

echo "================================================"
echo "🍽️ 飲食店営業カレンダー セットアップ"
echo "================================================"
echo ""

# Node.js確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.js がインストールされていません"
    echo "👉 https://nodejs.org からインストールしてください"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# 依存パッケージのインストール
echo "📦 依存パッケージをインストール中..."
npm install
echo "✅ インストール完了"
echo ""

# .env.local ファイルの作成
if [ ! -f .env.local ]; then
    echo "⚙️ 環境変数ファイルを作成します"
    echo ""
    echo "👉 以下の情報を入力してください:"
    echo "   Supabaseダッシュボード → Settings → API から取得できます"
    echo ""
    
    read -p "Supabase URL (https://xxxxx.supabase.co): " SUPABASE_URL
    read -p "Supabase Anon Key: " SUPABASE_KEY
    read -sp "管理者パスワード (15文字以上推奨): " ADMIN_PASSWORD
    echo ""
    echo ""
    
    cat > .env.local << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY
VITE_ADMIN_PASSWORD=$ADMIN_PASSWORD
EOF
    
    echo "✅ .env.local を作成しました"
else
    echo "✅ .env.local は既に存在します"
fi

echo ""
echo "================================================"
echo "✨ セットアップ完了！"
echo "================================================"
echo ""
echo "🚀 開発サーバーを起動:"
echo "   npm run dev"
echo ""
echo "📚 詳細は README.md を参照してください"
echo ""
