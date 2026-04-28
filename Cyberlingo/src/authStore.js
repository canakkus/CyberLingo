import { reactive } from 'vue'
import { supabase } from './supabase'

export const authStore = reactive({
  user: null,
  session: null,
  authMessage: '',
  loading: true,
  isAdmin: false,

  // Profile data from Supabase (team, display_name)
  profile: {
    team: null,
    display_name: null,
  },

  // User stats from Supabase
  userStats: {
    xp: 0,
    level: 1,
    streak: 0,
    last_login: null,
    lesson_progress: {},
    claimed_quests: [],
    coins: 0,
    owned_items: [],
    equipped_avatar: 'av-default',
    equipped_accessory: null,
  },

  googlePrefill: {
    email: '',
    isGoogleFlow: false
  },

  async initialize() {
    this.loading = true
    try {
      // Restore admin session from localStorage if present
      if (localStorage.getItem('cyberlingo_admin') === 'true') {
        this.user = { email: 'admin@cyberlingo.internal', id: 'admin-id' }
        this.isAdmin = true
        this.loading = false
        return
      }

      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) console.error('Error fetching session:', error)

      this.session = session
      this.user = session?.user ?? null

      if (this.user) {
        await this.loadProfile()
        await this.loadUserStats()
      }
    } catch (err) {
      console.error('Supabase init failed:', err)
    } finally {
      this.loading = false
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      this.session = session

      if (session?.user) {
        // Load profile + stats BEFORE setting user
        // so the watcher in App.vue fires with team already available
        const tempUser = session.user
        await Promise.all([
          this.loadProfileFor(tempUser.id),
          this.loadUserStatsFor(tempUser.id),
        ])
        this.user = tempUser
      } else {
        this.user = null
        this.profile = { team: null, display_name: null }
        this.userStats = { xp: 0, level: 1, streak: 0, last_login: null, lesson_progress: {}, claimed_quests: [], coins: 0, owned_items: [], equipped_avatar: 'av-default', equipped_accessory: null }
      }
    })
  },

  // --- Profile ---

  async loadProfile() {
    if (!this.user) return
    return this.loadProfileFor(this.user.id)
  },

  async loadProfileFor(userId) {
    if (userId === 'admin-id') return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('team, display_name')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      if (data) {
        this.profile.team = data.team
        this.profile.display_name = data.display_name
      }
    } catch (err) {
      console.error('loadProfile failed:', err)
    }
  },

  async saveTeam(team) {
    if (!this.user) return
    if (this.isAdmin) {
      this.profile.team = team
      return
    }
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: this.user.id, team }, { onConflict: 'id' })

      if (error) {
        console.error('Error saving team:', error)
        alert('Fehler beim Speichern des Teams in Supabase: ' + error.message)
        return
      }
      this.profile.team = team
    } catch (err) {
      console.error('saveTeam failed:', err)
    }
  },

  async updateDisplayName(name) {
    if (!this.user || !name.trim()) return
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: this.user.id, display_name: name.trim() }, { onConflict: 'id' })

    if (error) throw error
    this.profile.display_name = name.trim()
  },

  // --- User Stats ---

  async loadUserStats() {
    if (!this.user) return
    return this.loadUserStatsFor(this.user.id)
  },

  async loadUserStatsFor(userId) {
    if (userId === 'admin-id') return
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('xp, level, streak, last_login, lesson_progress, claimed_quests, coins, owned_items, equipped_avatar, equipped_accessory')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user stats:', error)
        return
      }

      if (data) {
        this.userStats.xp = data.xp ?? 0
        this.userStats.level = data.level ?? 1
        this.userStats.streak = data.streak ?? 0
        this.userStats.last_login = data.last_login ?? null
        this.userStats.lesson_progress = data.lesson_progress ?? {}
        this.userStats.claimed_quests = data.claimed_quests || []
        this.userStats.coins = data.coins ?? 0
        this.userStats.owned_items = data.owned_items || []
        this.userStats.equipped_avatar = data.equipped_avatar || 'av-default'
        this.userStats.equipped_accessory = data.equipped_accessory || null
      }

      // Update streak based on login date
      await this.updateStreak()
    } catch (err) {
      console.error('loadUserStats failed:', err)
    }
  },

  async saveUserStats(stats) {
    if (!this.user) return
    
    // Update local state immediately
    Object.assign(this.userStats, stats)

    if (this.isAdmin) return // Admin stats are session-only

    try {
      const updates = {
        id: this.user.id,
        xp: stats.xp ?? this.userStats.xp,
        level: stats.level ?? this.userStats.level,
        streak: stats.streak ?? this.userStats.streak,
        last_login: stats.last_login ?? this.userStats.last_login,
        lesson_progress: stats.lesson_progress ?? this.userStats.lesson_progress,
        claimed_quests: stats.claimed_quests ?? this.userStats.claimed_quests,
        coins: stats.coins ?? this.userStats.coins,
        owned_items: stats.owned_items ?? this.userStats.owned_items,
        equipped_avatar: stats.equipped_avatar ?? this.userStats.equipped_avatar,
        equipped_accessory: stats.equipped_accessory !== undefined ? stats.equipped_accessory : this.userStats.equipped_accessory,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('user_stats')
        .upsert(updates, { onConflict: 'id' })

      if (error) {
        console.error('Error saving user stats:', error)
        return
      }
    } catch (err) {
      console.error('saveUserStats failed:', err)
    }
  },

  async updateStreak() {
    if (!this.user || this.isAdmin) return

    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    const lastLoginRaw = this.userStats.last_login
    const todayStr = todayDate.toISOString().split('T')[0] // "YYYY-MM-DD"

    if (lastLoginRaw) {
      const lastLoginDate = new Date(lastLoginRaw)
      lastLoginDate.setHours(0, 0, 0, 0)
      const lastLoginStr = lastLoginDate.toISOString().split('T')[0]

      if (lastLoginStr === todayStr) {
        // Already logged in today — no change needed
        return
      }

      const diffMs = todayDate - lastLoginDate
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day → increment streak 🔥
        this.userStats.streak = (this.userStats.streak || 0) + 1
      } else {
        // Streak broken → reset to 1
        this.userStats.streak = 1
      }
    } else {
      // First login ever → start streak at 1
      this.userStats.streak = 1
    }

    this.userStats.last_login = new Date().toISOString()
    // Daily login reward: +10 Ling-Coins
    const newCoins = (this.userStats.coins || 0) + 10
    await this.saveUserStats({
      streak: this.userStats.streak,
      last_login: this.userStats.last_login,
      coins: newCoins,
    })
  },

  async saveLessonProgress(team, level, progressData) {
    if (!this.user) return
    const currentProgress = JSON.parse(JSON.stringify(this.userStats.lesson_progress))
    if (!currentProgress[team]) currentProgress[team] = {}
    currentProgress[team][level] = progressData
    await this.saveUserStats({ lesson_progress: currentProgress })
  },

  async claimQuest(questId, xpReward) {
    if (!this.user) return
    if (this.userStats.claimed_quests.includes(questId)) return

    const newClaimed = [...this.userStats.claimed_quests, questId]
    const newXp = this.userStats.xp + xpReward

    await this.saveUserStats({ xp: newXp, claimed_quests: newClaimed })
  },

  async addCoins(amount) {
    if (!this.user) return
    const newCoins = (this.userStats.coins || 0) + amount
    await this.saveUserStats({ coins: newCoins })
  },

  async buyItem(itemId, price) {
    if (!this.user) return false
    if ((this.userStats.coins || 0) < price) return false
    if (this.userStats.owned_items.includes(itemId)) return false
    const newCoins = this.userStats.coins - price
    const newOwned = [...this.userStats.owned_items, itemId]
    await this.saveUserStats({ coins: newCoins, owned_items: newOwned })
    return true
  },

  async equipItem(itemId, type) {
    if (!this.user) return
    if (type === 'avatar') {
      await this.saveUserStats({ equipped_avatar: itemId })
    } else if (type === 'accessory') {
      const newVal = this.userStats.equipped_accessory === itemId ? null : itemId
      await this.saveUserStats({ equipped_accessory: newVal })
    }
  },

  // --- Auth ---

  async signUp(email, password, displayName) {
    this.authMessage = ''
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    })

    if (error) {
      if (error.message.toLowerCase().includes('already registered') || error.status === 400) {
        throw new Error('USER_ALREADY_EXISTS')
      }
      throw error
    }
    return data
  },

  async signIn(email, password) {
    this.authMessage = ''

    // Hardcoded Admin check
    if (email === 'admin' && password === 'admin') {
      this.user = { email: 'admin@cyberlingo.internal', id: 'admin-id' }
      this.isAdmin = true
      this.loading = false
      localStorage.setItem('cyberlingo_admin', 'true')
      return { user: this.user }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    this.isAdmin = false
    return data
  },

  async signOut() {
    this.isAdmin = false
    localStorage.removeItem('cyberlingo_admin')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    this.user = null
    this.session = null
    this.profile = { team: null, display_name: null }
    this.userStats = { xp: 0, level: 1, streak: 0, last_login: null, lesson_progress: {}, claimed_quests: [], coins: 0, owned_items: [], equipped_avatar: 'av-default', equipped_accessory: null }
  },

  async signInWithGoogle() {
    this.authMessage = ''
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) throw error
    return data
  },

  async checkGoogleUser(email) {
    this.googlePrefill.email = email
    this.googlePrefill.isGoogleFlow = true
    return { exists: false }
  },

  setAuthMessage(msg) {
    this.authMessage = msg
  },

  clearGooglePrefill() {
    this.googlePrefill.email = ''
    this.googlePrefill.isGoogleFlow = false
  }
})
