import React, { useState } from 'react'
import {
  Settings,
  Calendar,
  LogOut,
  AlertCircle
} from 'lucide-react'
import ScheduleManager from './ScheduleManager'
import EventManager from './EventManager'
import { storageUtils } from '../lib/utils'

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('schedule')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogout = () => {
    storageUtils.clearAuth()
    onLogout()
  }

  return (
    <div className="admin-dashboard">
      {/* ヘッダー */}
      <div className="admin-header">
        <h1>管理画面</h1>
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          ログアウト
        </button>
      </div>

      {/* タブナビゲーション */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Settings size={18} />
          営業時間パターン
        </button>
        <button
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={18} />
          イベント管理
        </button>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="error-close">
            ×
          </button>
        </div>
      )}

      {/* コンテンツ */}
      <div className="admin-content">
        {activeTab === 'schedule' && (
          <ScheduleManager setError={setErrorMessage} />
        )}
        {activeTab === 'events' && (
          <EventManager setError={setErrorMessage} />
        )}
      </div>
    </div>
  )
}
