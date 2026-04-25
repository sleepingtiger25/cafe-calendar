import { format, parse, isToday, isSameDay } from 'date-fns'
import { ja } from 'date-fns/locale'

export const dateUtils = {
  // YYYY-MM-DD形式の文字列を取得
  toDateString(date) {
    return format(date, 'yyyy-MM-dd')
  },

  // 文字列をDateオブジェクトに変換
  parseDate(dateString) {
    return new Date(dateString)
  },

  // 表示用フォーマット（例：2024年1月15日）
  formatDisplay(dateString) {
    const date = new Date(dateString)
    return format(date, 'yyyy年M月d日(EEEE)', { locale: ja })
  },

  // 短いフォーマット（例：1月15日）
  formatShort(dateString) {
    const date = new Date(dateString)
    return format(date, 'M月d日(E)', { locale: ja })
  },

  // 曜日のみ
  getDayOfWeek(dateString) {
    const date = new Date(dateString)
    return format(date, 'EEEE', { locale: ja })
  },

  // 今日かチェック
  isToday(dateString) {
    const date = new Date(dateString)
    return isToday(date)
  },

  // 土日判定
  isWeekend(dateString) {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6
  }
}

// 時間フォーマット
export const timeUtils = {
  // HH:MM形式を取得
  toTimeString(timeString) {
    if (!timeString) return ''
    return timeString.substring(0, 5) // "08:30:00" -> "08:30"
  },

  // "08:30" を "08:30:00" に変換
  toFullTimeString(timeString) {
    if (!timeString) return '00:00:00'
    const parts = timeString.split(':')
    return `${parts[0]}:${parts[1]}:00`
  },

  // 表示用フォーマット（例：午前8時30分）
  formatDisplay(timeString) {
    if (!timeString || timeString === '00:00:00') return '定休日'
    const [hours, minutes] = timeString.split(':')
    const h = parseInt(hours)
    const m = parseInt(minutes)
    
    const period = h >= 12 ? '午後' : '午前'
    const hour = h >= 12 ? (h === 12 ? 12 : h - 12) : h
    
    return `${period}${hour}時${String(m).padStart(2, '0')}分`
  },

  // 営業時間テキスト（例：08:30-16:30）
  formatRange(startTime, endTime) {
    if (!startTime || !endTime || startTime === '00:00:00' && endTime === '00:00:00') {
      return '定休日'
    }
    const start = this.toTimeString(startTime)
    const end = this.toTimeString(endTime)
    return `${start}～${end}`
  }
}

// 色ユーティリティ
export const colorUtils = {
  // 16進数カラーコードの妥当性確認
  isValidColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color)
  },

  // 色に基づいて文字色を決定（白または黒）
  getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }
}

// 画像ユーティリティ
export const imageUtils = {
  // 画像URLの妥当性確認
  isValidImageUrl(url) {
    if (!url) return false
    try {
      new URL(url)
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
    } catch {
      return false
    }
  },

  // ファイルサイズをMBで取得
  getFileSizeInMB(bytes) {
    return (bytes / 1024 / 1024).toFixed(2)
  }
}

// ストレージユーティリティ
export const storageUtils = {
  setAuth(password) {
    const hash = btoa(password) // 簡易的なエンコード
    sessionStorage.setItem('_auth', hash)
  },

  getAuth() {
    return sessionStorage.getItem('_auth')
  },

  clearAuth() {
    sessionStorage.removeItem('_auth')
  },

  isAuthenticated(password) {
    const stored = this.getAuth()
    return stored === btoa(password)
  }
}
