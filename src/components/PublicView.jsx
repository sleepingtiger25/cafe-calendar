import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react'
import { scheduleApi, eventApi } from '../lib/supabase'
import { getJapanHolidays, getMonthHolidays } from '../lib/holidays'
import { dateUtils, timeUtils } from '../lib/utils'

export default function PublicView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [patterns, setPatterns] = useState([])
  const [events, setEvents] = useState([])
  const [holidays, setHolidays] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [currentDate])

  const loadData = async () => {
    try {
      setLoading(true)
      const [patternsData, eventsData, holidaysData] = await Promise.all([
        scheduleApi.getAll(),
        eventApi.getAll(),
        getMonthHolidays(currentDate.getFullYear(), currentDate.getMonth() + 1)
      ])
      
      setPatterns(patternsData)
      setEvents(eventsData)
      setHolidays(holidaysData)
    } catch (error) {
      console.error('データ読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getScheduleForDate = (dateString) => {
    // イベントがあればイベント優先
    const dayEvents = events.filter(e => e.event_date === dateString)
    if (dayEvents.length > 0) return null

    const dayOfWeek = new Date(dateString).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isHoliday = holidays.includes(dateString)

    // 祝日または日曜日は「土日祝日」パターンを使用
    if (isHoliday || (dayOfWeek === 0)) {
      return patterns.find(p => p.name.includes('土日祝'))
    }

    // 土曜日も「土日祝日」パターン
    if (isWeekend) {
      return patterns.find(p => p.name.includes('土日祝'))
    }

    // 通常営業
    return patterns.find(p => p.name === '通常営業')
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // 前月の余白
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="empty-day"></div>
      )
    }

    // 当月の日付
    for (let date = 1; date <= daysInMonth; date++) {
      const dateString = dateUtils.toDateString(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
      )
      const schedule = getScheduleForDate(dateString)
      const dayEvents = events.filter(e => e.event_date === dateString)
      const isHolidayDate = holidays.includes(dateString)
      const dayOfWeek = new Date(dateString).getDay()

      days.push(
        <div
          key={date}
          className={`calendar-day ${isHolidayDate ? 'holiday' : ''} ${
            dayOfWeek === 0 ? 'sunday' : ''
          } ${dayOfWeek === 6 ? 'saturday' : ''}`}
          style={schedule ? { backgroundColor: schedule.color } : {}}
        >
          <div className="day-number">{date}</div>
          
          {dayEvents.length > 0 && (
            <div className="event-indicator">
              {dayEvents.map((evt, idx) => (
                <button
                  key={idx}
                  className="event-badge"
                  onClick={() => setSelectedEvent(evt)}
                  title={evt.title}
                >
                  🎉
                </button>
              ))}
            </div>
          )}

          {schedule && !dayEvents.length && (
            <div className="schedule-time">
              {schedule.name === '休日' ? (
                <span className="closed">定休日</span>
              ) : (
                <span className="open">
                  {timeUtils.toTimeString(schedule.start_time)}
                </span>
              )}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthYearString = currentDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long'
  })

  return (
    <div className="public-view">
      {/* ロゴエリア */}
      <div className="logo-section">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="logo"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>

      {/* タイトル */}
      <h1 className="page-title">営業カレンダー</h1>

      {/* 凡例 */}
      <div className="legend">
        {patterns.filter(p => p.name !== '休日').map(pattern => (
          <div key={pattern.id} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: pattern.color }}
            ></div>
            <span className="legend-label">{pattern.name}</span>
          </div>
        ))}
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFE4B5' }}></div>
          <span className="legend-label">祝日</span>
        </div>
      </div>

      {/* カレンダーコントロール */}
      <div className="calendar-header">
        <button onClick={previousMonth} className="nav-button">
          <ChevronLeft size={20} />
        </button>
        <h2 className="month-year">{monthYearString}</h2>
        <button onClick={nextMonth} className="nav-button">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="weekday-header">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="weekday-label">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      {loading ? (
        <div className="loading">
          <AlertCircle size={32} />
          <p>データを読み込み中...</p>
        </div>
      ) : (
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>
      )}

      {/* イベント詳細モーダル */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedEvent(null)}
            >
              <X size={24} />
            </button>

            {selectedEvent.image_url && (
              <img
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                className="modal-image"
              />
            )}

            <h3 className="modal-title">{selectedEvent.title}</h3>

            <div className="modal-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>{dateUtils.formatDisplay(selectedEvent.event_date)}</span>
              </div>

              {selectedEvent.start_time && (
                <div className="meta-item">
                  <Clock size={16} />
                  <span>
                    {timeUtils.toTimeString(selectedEvent.start_time)}
                    {selectedEvent.end_time &&
                      ` ～ ${timeUtils.toTimeString(selectedEvent.end_time)}`}
                  </span>
                </div>
              )}
            </div>

            {selectedEvent.description && (
              <p className="modal-description">{selectedEvent.description}</p>
            )}

            {selectedEvent.popup_image_url && (
              <img
                src={selectedEvent.popup_image_url}
                alt="Event details"
                className="modal-detail-image"
              />
            )}

            {selectedEvent.link_url && (
              <a
                href={selectedEvent.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-link"
              >
                <span>詳細を見る</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
