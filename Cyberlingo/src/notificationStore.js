import { reactive } from 'vue'
import { supabase } from './supabase'

export const notificationStore = reactive({
  items: [],
  _userId: null,
  _dismissed: [], // IDs of server notifications already dismissed

  async init(userId) {
    this._userId = userId

    // Load local (streak-lost etc.) from localStorage
    try {
      const raw = localStorage.getItem(`cyberlingo-notifs-${userId}`)
      if (raw) this.items = JSON.parse(raw)
    } catch {}

    // Load dismissed server notification IDs from user_stats
    try {
      const { data } = await supabase
        .from('user_stats')
        .select('dismissed_notifications')
        .eq('id', userId)
        .single()
      this._dismissed = data?.dismissed_notifications || []
    } catch {}

    // Fetch server notifications (global + user-specific)
    await this._fetchServerNotifications()
  },

  reset() {
    this._userId = null
    this._dismissed = []
    this.items = []
  },

  async _fetchServerNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, message, icon, type, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error || !data) return

      for (const n of data) {
        // Skip if already dismissed
        if (this._dismissed.includes(n.id)) continue
        // Skip if already in local list (avoid duplicates on re-init)
        if (this.items.some(i => i.serverId === n.id)) continue

        this.items.unshift({
          id: Date.now() + Math.random(),
          serverId: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          icon: n.icon,
          read: false,
          time: n.created_at,
        })
      }

      // Re-sort by time desc
      this.items.sort((a, b) => new Date(b.time) - new Date(a.time))
      if (this.items.length > 30) this.items.length = 30
      this._save()
    } catch {}
  },

  add({ type, title, message, icon = '🔔' }) {
    this.items.unshift({
      id: Date.now(),
      type,
      title,
      message,
      icon,
      read: false,
      time: new Date().toISOString(),
    })
    if (this.items.length > 30) this.items.length = 30
    this._save()
  },

  markAllRead() {
    this.items.forEach(n => { n.read = true })
    this._save()
  },

  async remove(id) {
    const item = this.items.find(n => n.id === id)
    this.items = this.items.filter(n => n.id !== id)
    this._save()

    // Persist dismissal of server notifications to Supabase
    if (item?.serverId && this._userId) {
      const newDismissed = [...new Set([...this._dismissed, item.serverId])]
      this._dismissed = newDismissed
      supabase
        .from('user_stats')
        .update({ dismissed_notifications: newDismissed })
        .eq('id', this._userId)
        .then(() => {})
    }
  },

  _save() {
    if (!this._userId) return
    try {
      localStorage.setItem(`cyberlingo-notifs-${this._userId}`, JSON.stringify(this.items))
    } catch {}
  },

  get unreadCount() {
    return this.items.filter(n => !n.read).length
  },
})
