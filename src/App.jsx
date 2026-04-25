import React, { useState, useEffect } from 'react'
import { Settings, LogOut } from 'lucide-react'
import PublicView from './components/PublicView'
import AdminDashboard from './components/AdminDashboard'
import LoginPage from './components/LoginPage'
import { storageUtils } from './lib/utils'
import './App.css'

function App() {
  const [view, setView] = useState('public')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 前回のセッションを確認
    const auth = storageUtils.getAuth()
    if (auth) {
      setIsAuthenticated(true)
      setView('admin')
    }
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    setView('admin')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setView('public')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="app-wrapper">
      {/* ナビゲーションバー */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h1 className="app-title">営業カレンダー</h1>
          </div>

          <div className="navbar-actions">
            {isAuthenticated && view === 'admin' ? (
              <button
                onClick={() => setView('public')}
                className="nav-button"
                title="公開ページを表示"
              >
                ← 公開ページに戻る
              </button>
            ) : (
              <button
                onClick={() => setView('login')}
                className="nav-button admin-button"
                title="管理画面ログイン"
              >
                <Settings size={18} />
                <span>管理画面</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="main-content">
        {view === 'public' && <PublicView />}
        {view === 'login' && !isAuthenticated && <LoginPage onLogin={handleLogin} />}
        {view === 'admin' && isAuthenticated && (
          <AdminDashboard onLogout={handleLogout} />
        )}
      </main>

      {/* フッター */}
      <footer className="app-footer">
        <p>© 2024 営業カレンダー | Powered by React + Supabase</p>
      </footer>
    </div>
  )
}

export default App
