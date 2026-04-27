import React, { useState } from 'react'
import {
  Settings,
  Calendar,
  LogOut,
  AlertCircle,
  Plus
} from 'lucide-react'
import ScheduleManager from './ScheduleManager'
import EventManager from './EventManager'
import { storageUtils } from '../lib/utils'
import { supabase } from '../lib/supabase'

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('schedule')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleLogout = () => {
    storageUtils.clearAuth()
    onLogout()
  }

  // 翌月のカレンダーエントリを生成
  const generateNextMonth = async () => {
    try {
      setIsGenerating(true)
      setErrorMessage('')
      setSuccessMessage('')

      // 当月の日付を計算
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1
      
      // 翌月を計算
      let nextYear = currentYear
      let nextMonth = currentMonth + 1
      if (nextMonth > 12) {
        nextMonth = 1
        nextYear += 1
      }

      // SQL を実行して翌月のデータを生成
      const { error } = await supabase.rpc('execute_sql', {
        sql: `
          INSERT INTO public.calendar_entries (entry_date, pattern_id, override_pattern_id, is_manual_override)
          SELECT 
            (entry_date + interval '1 month')::date as entry_date,
            pattern_id,
            override_pattern_id,
            is_manual_override
          FROM public.calendar_entries
          WHERE EXTRACT(YEAR FROM entry_date) = ${currentYear}
            AND EXTRACT(MONTH FROM entry_date) = ${currentMonth}
            AND NOT EXISTS (
              SELECT 1 FROM public.calendar_entries ce2
              WHERE EXTRACT(YEAR FROM ce2.entry_date) = ${nextYear}
                AND EXTRACT(MONTH FROM ce2.entry_date) = ${nextMonth}
                AND ce2.entry_date::text LIKE (entry_date + interval '1 month')::date::text || '%'
            )
        `
      })

      if (error) {
        // RPC が使えない場合は、代替方法で実行
        await generateNextMonthDirect(currentYear, currentMonth)
      } else {
        setSuccessMessage(`${nextYear}年${nextMonth}月のカレンダーを生成しました！`)
      }
    } catch (error) {
      console.error('カレンダー生成エラー:', error)
      // フォールバック: 直接 INSERT
      try {
        await generateNextMonthDirect(
          new Date().getFullYear(),
          new Date().getMonth() + 1
        )
      } catch (fallbackError) {
        setErrorMessage(`カレンダー生成に失敗しました: ${fallbackError.message}`)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // 直接 INSERT する方法
  const generateNextMonthDirect = async (currentYear, currentMonth) => {
    // 当月のデータを取得
    const { data: currentMonthEntries, error: fetchError } = await supabase
      .from('calendar_entries')
      .select('*')
      .gte('entry_date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
      .lt('entry_date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)

    if (fetchError) throw fetchError

    if (!currentMonthEntries || currentMonthEntries.length === 0) {
      setErrorMessage('当月のカレンダーデータがありません')
      return
    }

    // 翌月の日付を計算
    let nextYear = currentYear
    let nextMonth = currentMonth + 1
    if (nextMonth > 12) {
      nextMonth = 1
      nextYear += 1
    }

    // 翌月用に日付を変換
    const nextMonthData = currentMonthEntries.map(entry => {
      const currentDate = new Date(entry.entry_date)
      const nextDate = new Date(nextYear, nextMonth - 1, currentDate.getDate())
      return {
        entry_date: nextDate.toISOString().split('T')[0],
        pattern_id: entry.pattern_id,
        override_pattern_id: entry.override_pattern_id,
        is_manual_override: entry.is_manual_override
      }
    })

    // 既に存在するデータをチェック
    const { data: existingData } = await supabase
      .from('calendar_entries')
      .select('entry_date')
      .gte('entry_date', `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`)
      .lt('entry_date', `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-01`)

    // 既に存在するデータは除外
    const dataToInsert = nextMonthData.filter(
      newEntry => !existingData?.some(existing => existing.entry_date === newEntry.entry_date)
    )

    if (dataToInsert.length === 0) {
      setSuccessMessage(`${nextYear}年${nextMonth}月は既に生成済みです`)
      return
    }

    // INSERT
    const { error: insertError } = await supabase
      .from('calendar_entries')
      .insert(dataToInsert)

    if (insertError) throw insertError

    setSuccessMessage(`${nextYear}年${nextMonth}月のカレンダーを生成しました！（${dataToInsert.length}日分）`)
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

      {/* 成功メッセージ */}
      {successMessage && (
        <div className="success-banner">
          <span>✓ {successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="success-close">
            ×
          </button>
        </div>
      )}

      {/* コンテンツ */}
      <div className="admin-content">
        {activeTab === 'schedule' && (
          <>
            {/* カレンダー生成ボタン */}
            <div className="calendar-generation-section">
              <h3>カレンダー管理</h3>
              <button
                onClick={generateNextMonth}
                disabled={isGenerating}
                className="generate-button"
              >
                <Plus size={18} />
                {isGenerating ? '生成中...' : '翌月を生成'}
              </button>
              <p className="generate-description">
                当月のパターンをコピーして、翌月のカレンダーを自動生成します
              </p>
            </div>
            <ScheduleManager setError={setErrorMessage} />
          </>
        )}
        {activeTab === 'events' && (
          <EventManager setError={setErrorMessage} />
        )}
      </div>
    </div>
  )
}
