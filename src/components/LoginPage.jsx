import React, { useState } from 'react'
import { Lock, AlertCircle } from 'lucide-react'
import { storageUtils } from '../lib/utils'

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

      if (!adminPassword) {
        setError('⚠️ 管理者パスワードが設定されていません。セットアップガイドを参照してください。')
        return
      }

      if (password === adminPassword) {
        storageUtils.setAuth(password)
        onLogin()
      } else {
        setError('パスワードが正しくありません')
        setPassword('')
      }
    } catch (err) {
      setError('ログインエラーが発生しました: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* ロゴ */}
        <div className="login-logo">
          <img 
            src="/logo.png" 
            alt="Logo"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>

        <h1>管理画面ログイン</h1>
        <p className="login-subtitle">オーナー用の管理パネルへようこそ</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <div className="password-input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-login"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="login-footer">
          <p className="security-note">
            🔒 このログイン画面は簡易認証です。本番環境では、より強固な認証方式（OAuth、Supabase Auth等）の導入を推奨します。
          </p>
        </div>
      </div>

      {/* デコレーション */}
      <div className="login-decoration"></div>
    </div>
  )
}
