// 日本の祝日を内閣府のAPIから取得
// キャッシュ機能付き

let holidayCache = {}
const CACHE_KEY = 'japan_holidays'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24時間

export async function getJapanHolidays(year) {
  // ローカルストレージからキャッシュを確認
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      const data = JSON.parse(cached)
      if (data.expiry > Date.now() && data.holidays[year]) {
        return data.holidays[year] || []
      }
    } catch (e) {
      console.error('キャッシュ読み込みエラー:', e)
    }
  }

  try {
    // 内閣府のCSVファイルから取得（形式: 2024-01-01,元日）
    const response = await fetch(
      `https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv`
    )
    const text = await response.text()

    const holidays = []
    const lines = text.split('\n')

    for (const line of lines) {
      if (!line.trim()) continue
      
      const [dateStr] = line.split(',')
      const date = new Date(dateStr)
      
      if (date.getFullYear() === year) {
        holidays.push(dateStr)
      }
    }

    // キャッシュに保存
    const cacheData = {
      holidays: { [year]: holidays },
      expiry: Date.now() + CACHE_EXPIRY
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

    return holidays
  } catch (error) {
    console.warn('祝日取得エラー:', error)
    
    // フォールバック：手動定義の祝日リスト（2024-2025）
    const fallbackHolidays = {
      2024: [
        '2024-01-01', // 元日
        '2024-01-08', // 成人の日
        '2024-02-11', // 建国記念日
        '2024-02-12', // 振替休日
        '2024-02-23', // 天皇誕生日
        '2024-03-20', // 春分の日
        '2024-04-29', // 昭和の日
        '2024-05-03', // 憲法記念日
        '2024-05-04', // みどりの日
        '2024-05-05', // こどもの日
        '2024-05-06', // 振替休日
        '2024-07-15', // 海の日
        '2024-08-11', // 山の日
        '2024-08-12', // 振替休日
        '2024-09-16', // 敬老の日
        '2024-09-22', // 秋分の日
        '2024-09-23', // 振替休日
        '2024-10-14', // スポーツの日
        '2024-11-03', // 文化の日
        '2024-11-04', // 振替休日
        '2024-11-23', // 勤労感謝の日
      ],
      2025: [
        '2025-01-01', // 元日
        '2025-01-13', // 成人の日
        '2025-02-11', // 建国記念日
        '2025-02-23', // 天皇誕生日
        '2025-03-20', // 春分の日
        '2025-04-29', // 昭和の日
        '2025-05-03', // 憲法記念日
        '2025-05-04', // みどりの日
        '2025-05-05', // こどもの日
        '2025-05-06', // 振替休日
        '2025-07-21', // 海の日
        '2025-08-11', // 山の日
        '2025-09-15', // 敬老の日
        '2025-09-23', // 秋分の日
        '2025-10-13', // スポーツの日
        '2025-11-03', // 文化の日
        '2025-11-23', // 勤労感謝の日
        '2025-11-24', // 振替休日
      ],
      2026: [
        '2026-01-01', // 元日
        '2026-01-12', // 成人の日
        '2026-02-11', // 建国記念日
        '2026-02-23', // 天皇誕生日
        '2026-03-20', // 春分の日
        '2026-04-29', // 昭和の日
        '2026-05-03', // 憲法記念日
        '2026-05-04', // みどりの日
        '2026-05-05', // こどもの日
        '2026-07-20', // 海の日
        '2026-08-11', // 山の日
        '2026-09-21', // 敬老の日
        '2026-09-22', // 秋分の日
        '2026-10-12', // スポーツの日
        '2026-11-03', // 文化の日
        '2026-11-23', // 勤労感謝の日
      ]
    }

    return fallbackHolidays[year] || []
  }
}

// 指定日が祝日かチェック
export async function isHoliday(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const holidays = await getJapanHolidays(year)
  return holidays.includes(dateString)
}

// 指定年月の祝日リストを取得
export async function getMonthHolidays(year, month) {
  const holidays = await getJapanHolidays(year)
  const monthStr = String(month).padStart(2, '0')
  
  return holidays.filter(h => h.startsWith(`${year}-${monthStr}`))
}
