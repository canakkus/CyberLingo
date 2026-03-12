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
  },

  googlePrefill: {
    email: '',
    isGoogleFlow: false
  },

  async initialize() {
    this.loading = true
    try {
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
        this.userStats = { xp: 0, level: 1, streak: 0 }
      }
    })
  },

  // --- Profile ---

  async loadProfile() {
    if (!this.user) return
    return this.loadProfileFor(this.user.id)
  },

  async loadProfileFor(userId) {
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
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: this.user.id, team }, { onConflict: 'id' })

      if (error) {
        console.error('Error saving team:', error)
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
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('xp, level, streak')
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
      }
    } catch (err) {
      console.error('loadUserStats failed:', err)
    }
  },

  async saveUserStats(stats) {
    if (!this.user) return
    try {
      const updates = {
        id: this.user.id,
        xp: stats.xp ?? this.userStats.xp,
        level: stats.level ?? this.userStats.level,
        streak: stats.streak ?? this.userStats.streak,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('user_stats')
        .upsert(updates, { onConflict: 'id' })

      if (error) {
        console.error('Error saving user stats:', error)
        return
      }

      Object.assign(this.userStats, updates)
    } catch (err) {
      console.error('saveUserStats failed:', err)
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
      return { user: this.user }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    this.isAdmin = false
    return data
  },

  async signOut() {
    this.isAdmin = false
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    this.user = null
    this.session = null
    this.profile = { team: null, display_name: null }
    this.userStats = { xp: 0, level: 1, streak: 0 }
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
