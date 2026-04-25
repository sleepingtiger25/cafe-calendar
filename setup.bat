@echo off
REM 飲食店営業カレンダー - Windows自動セットアップ
REM 使用方法: setup.bat をダブルクリック

setlocal enabledelayedexpansion

echo.
echo ================================================
echo 鸚 飲食店営業カレンダー セットアップ
echo ================================================
echo.

REM Node.js確認
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js がインストールされていません
    echo 👉 https://nodejs.org からインストールしてください
    pause
    exit /b 1
)

echo ✅ Node.js: 
node --version

echo ✅ npm: 
npm --version

echo.
echo 📦 依存パッケージをインストール中...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ インストールに失敗しました
    pause
    exit /b 1
)

echo ✅ インストール完了
echo.

REM .env.local ファイルの確認
if exist .env.local (
    echo ✅ .env.local は既に存在します
) else (
    echo ⚙️ 環境変数ファイルを作成します
    echo.
    echo 👉 以下の情報を入力してください:
    echo    Supabaseダッシュボード ^→ Settings ^→ API から取得できます
    echo.
    
    set /p SUPABASE_URL="Supabase URL (https://xxxxx.supabase.co): "
    set /p SUPABASE_KEY="Supabase Anon Key: "
    set /p ADMIN_PASSWORD="管理者パスワード (15文字以上推奨): "
    
    (
        echo VITE_SUPABASE_URL=%SUPABASE_URL%
        echo VITE_SUPABASE_ANON_KEY=%SUPABASE_KEY%
        echo VITE_ADMIN_PASSWORD=%ADMIN_PASSWORD%
    ) > .env.local
    
    echo.
    echo ✅ .env.local を作成しました
)

echo.
echo ================================================
echo ✨ セットアップ完了！
echo ================================================
echo.
echo 🚀 開発サーバーを起動:
echo    npm run dev
echo.
echo 📚 詳細は README.md を参照してください
echo.

pause
