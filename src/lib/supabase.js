import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase環境変数が未設定です。.env.localを確認してください。')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// スケジュールパターン操作
export const scheduleApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('schedule_patterns')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async create(pattern) {
    const { data, error } = await supabase
      .from('schedule_patterns')
      .insert([pattern])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async update(id, pattern) {
    const { data, error } = await supabase
      .from('schedule_patterns')
      .update({ ...pattern, updated_at: new Date() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('schedule_patterns')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// イベント操作
export const eventApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async getByDate(date) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_date', date)
      .eq('is_published', true)
    
    if (error) throw error
    return data || []
  },

  async create(event) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async update(id, event) {
    const { data, error } = await supabase
      .from('events')
      .update({ ...event, updated_at: new Date() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}
