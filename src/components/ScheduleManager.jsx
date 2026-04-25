import React, { useState, useEffect } from 'react'
import { Plus, Save, X, AlertCircle } from 'lucide-react'
import { scheduleApi } from '../lib/supabase'
import { timeUtils } from '../lib/utils'

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

export default function ScheduleManager({ setError }) {
  const [patterns, setPatterns] = useState([])
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    start_time: '08:30',
    end_time: '16:30',
    color: '#E8D5C4'
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPatterns()
  }, [])

  const loadPatterns = async () => {
    try {
      setLoading(true)
      const data = await scheduleApi.getAll()
      setPatterns(data)
    } catch (error) {
      setError('パターン読み込みエラー: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      start_time: '08:30',
      end_time: '16:30',
      color: '#E8D5C4'
    })
    setEditing(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('名前を入力してください')
      return
    }

    try {
      setSaving(true)
      
      const dataToSave = {
        name: formData.name.trim(),
        start_time: timeUtils.toFullTimeString(formData.start_time),
        end_time: timeUtils.toFullTimeString(formData.end_time),
        color: formData.color
      }

      if (editing) {
        await scheduleApi.update(editing.id, dataToSave)
        setPatterns(patterns.map(p => p.id === editing.id ? { ...p, ...dataToSave } : p))
        setError('') // 成功時はエラーをクリア
      } else {
        const newPattern = await scheduleApi.create(dataToSave)
        setPatterns([...patterns, newPattern])
      }

      resetForm()
    } catch (error) {
      setError('保存エラー: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (pattern) => {
    setEditing(pattern)
    setFormData({
      name: pattern.name,
      start_time: timeUtils.toTimeString(pattern.start_time),
      end_time: timeUtils.toTimeString(pattern.end_time),
      color: pattern.color
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('このパターンを削除してもよろしいですか？')) {
      return
    }

    try {
      setSaving(true)
      await scheduleApi.delete(id)
      setPatterns(patterns.filter(p => p.id !== id))
    } catch (error) {
      setError('削除エラー: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="manager-container">
      <h2>営業時間パターン管理</h2>

      {/* フォーム */}
      <form className="pattern-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>パターン名 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="例：通常営業、土日祝日"
            disabled={saving}
          />
        </div>

        <div className="form-group-row">
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

          <div className="form-group">
            <label>色</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                disabled={saving}
              />
              <code>{formData.color}</code>
            </div>
          </div>
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

      {/* パターン一覧 */}
      <div className="patterns-list">
        <h3>登録済みパターン（{patterns.length}個）</h3>

        {loading ? (
          <div className="loading-state">
            <AlertCircle size={24} />
            <p>読み込み中...</p>
          </div>
        ) : patterns.length === 0 ? (
          <div className="empty-state">
            <p>パターンがまだ登録されていません</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="patterns-table">
              <thead>
                <tr>
                  <th>名前</th>
                  <th>営業時間</th>
                  <th>色</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {patterns.map(pattern => (
                  <tr key={pattern.id}>
                    <td className="pattern-name">{pattern.name}</td>
                    <td>
                      {pattern.start_time === '00:00:00' && pattern.end_time === '00:00:00' ? (
                        <span className="closed-badge">定休日</span>
                      ) : (
                        <span className="time-badge">
                          {timeUtils.toTimeString(pattern.start_time)} ～ {timeUtils.toTimeString(pattern.end_time)}
                        </span>
                      )}
                    </td>
                    <td>
                      <div
                        className="color-swatch"
                        style={{ backgroundColor: pattern.color }}
                        title={pattern.color}
                      ></div>
                    </td>
                    <td className="action-buttons">
                      <button
                        onClick={() => handleEdit(pattern)}
                        disabled={saving}
                        className="btn-icon btn-edit"
                        title="編集"
                      >
                        <EditIcon width={16} height={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pattern.id)}
                        disabled={saving}
                        className="btn-icon btn-delete"
                        title="削除"
                      >
                        <DeleteIcon width={16} height={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ヘルプテキスト */}
      <div className="help-section">
        <h4>💡 パターン管理のヒント</h4>
        <ul>
          <li>複数の営業パターンを作成できます</li>
          <li>色を使い分けることで、カレンダーが見やすくなります</li>
          <li>「休日」パターンは開始時間・終了時間を00:00に設定してください</li>
          <li>土日祝日のパターンは別途作成して、イベントやカスタマイズに使います</li>
        </ul>
      </div>
    </div>
  )
}
