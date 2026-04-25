import React, { useState, useEffect } from 'react'
import { Plus, Save, X, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { eventApi } from '../lib/supabase'
import { dateUtils, timeUtils } from '../lib/utils'

// SVGアイコンコンポーネント
function EditIcon({ width = 18, height = 18 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 22" style={{ display: 'inline' }}>
      <path d="M2.4,14.9c0,0-.2.3-.3.5l-1.1,4.3c0,.4,0,.7.3.9.2.2.5.3.7.3h.3l4.3-1.1c.2,0,.4,0,.5-.3l10.1-10.1-4.7-4.7L2.4,14.9ZM18.6,1.6c-.8-.8-2.1-.8-2.9,0l-1.7,1.7,4.7,4.7,1.7-1.7c.8-.8.8-2.1,0-2.9,0,0-1.7-1.7-1.7-1.7Z" fill="#757575" />
    </svg>
  )
}

function DeleteIcon({ width = 18, height = 18 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 27 27" style={{ display: 'inline' }}>
      <path d="M20.9,26.6H6c-1.3,0-2.6-1.2-2.6-2.6V3.2c0-.6.4-1.1,1.1-1.1s1.1.4,1.1,1.1v20.8c0,.1.2.4.4.4h14.8c.1,0,.4-.2.4-.4V3.2c0-.6.4-1.1,1.1-1.1s1.1.4,1.1,1.1v20.8c0,1.3-1.2,2.6-2.6,2.6h.1Z" fill="#757575" />
      <path d="M25.4,4.3H1.6c-.6,0-1.1-.4-1.1-1.1s.4-1.1,1.1-1.1h23.8c.6,0,1.1.4,1.1,1.1s-.4,1.1-1.1,1.1Z" fill="#757575" />
      <path d="M16.5,20.6c-.6,0-1.1-.4-1.1-1.1v-10.4c0-.6.4-1.1,1.1-1.1s1.1.4,1.1,1.1v10.4c0,.6-.4,1.1-1.1,1.1ZM10.6,20.6c-.6,0-1.1-.4-1.1-1.1v-10.4c0-.6.4-1.1,1.1-1.1s1.1.4,1.1,1.1v10.4c0,.6-.4,1.1-1.1,1.1ZM16.5,2.8h-5.9c-.6,0-1.1-.4-1.1-1.1s.4-1.1,1.1-1.1h5.9c.6,0,1.1.4,1.1,1.1s-.4,1.1-1.1,1.1Z" fill="#757575" />
    </svg>
  )
}

export default function EventManager({ setError }) {
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    event_date: dateUtils.toDateString(new Date()),
    start_time: '10:00',
    end_time: '12:00',
    link_url: '',
    popup_image_url: '',
    is_published: true
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await eventApi.getAll()
      setEvents(data)
    } catch (error) {
      setError('イベント読み込みエラー: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      event_date: dateUtils.toDateString(new Date()),
      start_time: '10:00',
      end_time: '12:00',
      link_url: '',
      popup_image_url: '',
      is_published: true
    })
    setEditing(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('イベントタイトルを入力してください')
      return
    }

    if (!formData.event_date) {
      setError('開催日を選択してください')
      return
    }

    try {
      setSaving(true)
      
      const dataToSave = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        event_date: formData.event_date,
        start_time: formData.start_time ? timeUtils.toFullTimeString(formData.start_time) : null,
        end_time: formData.end_time ? timeUtils.toFullTimeString(formData.end_time) : null,
        link_url: formData.link_url.trim() || null,
        popup_image_url: formData.popup_image_url.trim() || null,
        is_published: formData.is_published
      }

      if (editing) {
        await eventApi.update(editing.id, dataToSave)
        setEvents(events.map(e => e.id === editing.id ? { ...e, ...dataToSave } : e))
      } else {
        const newEvent = await eventApi.create(dataToSave)
        setEvents([...events, newEvent])
      }

      resetForm()
    } catch (error) {
      setError('保存エラー: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (event) => {
    setEditing(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      image_url: event.image_url || '',
      event_date: event.event_date,
      start_time: event.start_time ? timeUtils.toTimeString(event.start_time) : '',
      end_time: event.end_time ? timeUtils.toTimeString(event.end_time) : '',
      link_url: event.link_url || '',
      popup_image_url: event.popup_image_url || '',
      is_published: event.is_published
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('このイベントを削除してもよろしいですか？')) {
      return
    }

    try {
      setSaving(true)
      await eventApi.delete(id)
      setEvents(events.filter(e => e.id !== id))
    } catch (error) {
      setError('削除エラー: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="manager-container">
      <h2>イベント管理</h2>

      {/* フォーム */}
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>イベントタイトル *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="例：新しいメニュー発表会"
            disabled={saving}
          />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>開催日 *</label>
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>開始時間</label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>終了時間</label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              disabled={saving}
            />
          </div>
        </div>

        <div className="form-group">
          <label>説明</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="イベントの詳細説明"
            rows={3}
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label>カバー画像URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            disabled={saving}
          />
          {formData.image_url && (
            <div className="image-preview">
              <img src={formData.image_url} alt="Preview" onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23ddd" width="200" height="150"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImage load error%3C/text%3E%3C/svg%3E'
              }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>詳細ページURL（外部リンク）</label>
          <input
            type="url"
            value={formData.link_url}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            placeholder="https://example.com/event-details"
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label>ポップアップ画像URL</label>
          <input
            type="url"
            value={formData.popup_image_url}
            onChange={(e) => setFormData({ ...formData, popup_image_url: e.target.value })}
            placeholder="https://example.com/popup.jpg"
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              disabled={saving}
            />
            <span>公開する</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            <Save size={18} />
            {editing ? '更新' : '追加'}
          </button>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="btn-secondary"
            >
              <X size={18} />
              キャンセル
            </button>
          )}
        </div>
      </form>

      {/* イベント一覧 */}
      <div className="events-list">
        <h3>登録済みイベント（{events.length}個）</h3>

        {loading ? (
          <div className="loading-state">
            <AlertCircle size={24} />
            <p>読み込み中...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p>イベントがまだ登録されていません</p>
          </div>
        ) : (
          <div className="events-cards">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h4>{event.title}</h4>
                  <div className="event-badges">
                    {event.is_published ? (
                      <span className="badge-published">
                        <Eye size={14} /> 公開
                      </span>
                    ) : (
                      <span className="badge-draft">
                        <EyeOff size={14} /> 下書き
                      </span>
                    )}
                  </div>
                </div>

                <div className="event-details">
                  <p><strong>日付:</strong> {dateUtils.formatDisplay(event.event_date)}</p>
                  {event.start_time && (
                    <p>
                      <strong>時間:</strong> {timeUtils.toTimeString(event.start_time)}
                      {event.end_time && ` ～ ${timeUtils.toTimeString(event.end_time)}`}
                    </p>
                  )}
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                </div>

                <div className="event-actions">
                  <button
                    onClick={() => handleEdit(event)}
                    disabled={saving}
                    className="btn-icon btn-edit"
                    title="編集"
                  >
                    <EditIcon width={16} height={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={saving}
                    className="btn-icon btn-delete"
                    title="削除"
                  >
                    <DeleteIcon width={16} height={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ヘルプテキスト */}
      <div className="help-section">
        <h4>💡 イベント管理のヒント</h4>
        <ul>
          <li>カバー画像はカレンダーのモーダルに表示されます</li>
          <li>外部リンク OR ポップアップ画像のどちらかを選択できます</li>
          <li>複数の画像を使用する場合：カバー + ポップアップで層構成</li>
          <li>下書き状態では公開ページに表示されません</li>
          <li>URLは https:// から始まる完全なURLを入力してください</li>
        </ul>
      </div>
    </div>
  )
}
