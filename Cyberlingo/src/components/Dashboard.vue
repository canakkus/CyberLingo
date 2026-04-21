<template>
  <main class="dashboard">
    <aside class="nav-sidebar">
      <nav>
        <button class="nav-btn" @click="$emit('go-to-profile')">
          <span class="icon">👤</span>
          Profile
        </button>
        <button class="nav-btn">
          <span class="icon">
            <!-- Store icon -->
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v2.5c0 .83.5 1.55 1.22 1.88V19c0 1.1.9 2 2 2h13.56c1.1 0 2-.9 2-2v-8.62C21.5 10.05 22 9.33 22 8.5V6c0-1.1-.9-2-2-2zm-1 15H5v-8h14v8zm1-10H4V6h16v3z"/>
              <path d="M3 6.5c0 .83.67 1.5 1.5 1.5S6 7.33 6 6.5 5.33 5 4.5 5 3 5.67 3 6.5zm4.5 0C7.5 7.33 8.17 8 9 8s1.5-.67 1.5-1.5S9.83 5 9 5s-1.5.67-1.5 1.5zm4.5 0c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S14.33 5 13.5 5 12 5.67 12 6.5zm4.5 0c0 .83.67 1.5 1.5 1.5S19.5 7.33 19.5 6.5 18.83 5 18 5s-1.5.67-1.5 1.5z"/>
            </svg>
          </span>
          Store
        </button>
        <button class="nav-btn">
          <span class="icon">
            <!-- Bell / Notification icon -->
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </span>
          Notifications
        </button>
        <button v-if="authStore.isAdmin" class="nav-btn admin-btn" @click="$emit('go-to-admin')">
          <span class="icon">⚙️</span>
          Admin
        </button>
        <button class="nav-btn theme-toggle" @click="$emit('toggle-theme')">
          <span class="icon">
            <!-- Dark mode moon icon -->
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          </span>
          Theme wechseln
        </button>
        <button class="nav-btn logout-btn" @click="handleLogout">
          <span class="icon">
            <!-- Logout icon -->
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </span>
          Abmelden
        </button>
      </nav>
    </aside>

    <section class="main-content">
      <header class="main-header">
        <h2>LEVELS</h2>
      </header>

      <div class="difficulty-grid">
        <button class="diff-card beginner" @click="selectDifficulty('beginner')">
          <h3>BEGINNER</h3>
        </button>
        <button class="diff-card intermediate" :class="{ locked: authStore.userStats.level < 2 }" @click="selectDifficulty('advanced')">
          <span v-if="authStore.userStats.level < 2" class="lock-icon">🔒</span>
          <h3>ADVANCED</h3>
        </button>
        <button class="diff-card pro" :class="{ locked: authStore.userStats.level < 3 }" @click="selectDifficulty('pro')">
          <span v-if="authStore.userStats.level < 3" class="lock-icon">🔒</span>
          <h3>PRO</h3>
        </button>
      </div>
    </section>

    <aside class="stats-sidebar">
      <div class="stats-header">
        <div class="team-switch-container">
          <button 
            class="team-badge clickable" 
            :class="authStore.profile.team"
            style="border-style: solid; cursor: pointer;"
            @click="openTeamSelection"
            title="Team wechseln"
          >
            {{ authStore.profile.team === 'red' ? 'RED TEAM' : 'BLUE TEAM' }} ✏️
          </button>
        </div>
        <div class="stat-item">
          <span class="label">XP</span>
          <span class="value">{{ authStore.userStats.xp }}</span>
        </div>
        <div class="stat-item">
          <span class="label">LEVEL</span>
          <span class="value">{{ authStore.userStats.level }}</span>
        </div>
        <div class="stat-item streak-item" :class="{ 'streak-active': authStore.userStats.streak > 0 }">
          <span class="label">STREAK</span>
          <span class="value streak-value">
            <span class="streak-flame" v-if="authStore.userStats.streak > 0">🔥</span>
            {{ authStore.userStats.streak }}
          </span>
        </div>
      </div>

      <div class="quests-section">
        <h3>QUESTS</h3>
        <div class="quest-list">
          <div v-for="quest in activeQuests" :key="quest.id" class="quest-item" :class="{ completed: quest.completed }">
            <div class="quest-icon">{{ quest.icon }}</div>
            <div class="quest-details">
              <h4>{{ quest.title }}</h4>
              <p v-if="quest.completed" class="done-text">Bereit zum Abholen! ⚡</p>
              <p v-else>{{ quest.description }}</p>
            </div>
          </div>
          <div v-if="activeQuests.length === 0" class="no-quests">
            Alle aktuellen Quests erledigt! 🎉
          </div>
        </div>
        <button class="view-quests-btn" @click="$emit('go-to-quests')">Alle Quests ansehen</button>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { dynamicQuests } from '../dataStore.js'
import { authStore } from '../authStore.js'

const activeQuests = computed(() => {
  return dynamicQuests.value.filter(q => q.isActive && !q.claimed).slice(0, 3)
})

defineProps({
  selectedTeam: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['go-to-admin', 'toggle-theme', 'go-to-profile', 'go-to-quests', 'go-to-lesson', 'go-to-team-selection'])

function openTeamSelection() {
  emit('go-to-team-selection')
}

async function handleLogout() {
  await authStore.signOut()
}

function selectDifficulty(diff) {
  if (diff === 'advanced' && authStore.userStats.level < 2) {
    alert('Dieser Modus ist gesperrt. Bitte schließe zuerst das Level "Beginner" ab.')
    return
  }
  if (diff === 'pro' && authStore.userStats.level < 3) {
    alert('Dieser Modus ist gesperrt. Bitte schließe zuerst das Level "Advanced" ab.')
    return
  }
  emit('go-to-lesson', diff)
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr 320px;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Dashboard: Nav Sidebar */
.nav-sidebar {
  border-right: 1px solid var(--border-color);
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
}

.nav-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: sticky;
  top: 2rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 16px;
  color: var(--text-secondary);
  font-family: 'Work Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-btn:hover {
  background: var(--nav-btn-hover);
  color: var(--text-primary);
  border-color: var(--border-color);
  transform: translateX(4px);
}

.nav-btn .icon {
  font-size: 1.4rem;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-btn .icon svg {
  width: 22px;
  height: 22px;
  color: currentColor;
}

/* Dashboard: Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
}

.main-header h2 {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.5rem;
  color: var(--text-primary);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 2rem 0;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.diff-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 3rem 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  aspect-ratio: 4 / 5;
  box-shadow: 0 8px 20px var(--card-shadow);
}

.diff-card h3 {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.4rem;
  color: var(--text-primary);
  margin: 0;
  transition: transform 0.3s ease;
}

.diff-card:hover:not(.locked) {
  transform: translateY(-4px);
  background: var(--bg-card-alt);
  box-shadow: 0 12px 24px var(--card-shadow);
}

.diff-card:hover:not(.locked) h3 {
  transform: scale(1.05);
}

.diff-card.beginner:hover:not(.locked) { border-color: var(--accent-teal); box-shadow: 0 8px 24px var(--accent-teal-glow); }
.diff-card.intermediate:hover:not(.locked) { border-color: #f39c12; box-shadow: 0 8px 24px rgba(243, 156, 18, 0.15); }
.diff-card.pro:hover:not(.locked) { border-color: var(--accent-red); box-shadow: 0 8px 24px var(--accent-red-glow); }

.diff-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bg-card-alt);
}

.lock-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: grayscale(1);
}

/* Dashboard: Stats Sidebar */
.stats-sidebar {
  border-left: 1px solid var(--border-color);
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  flex-wrap: wrap;
}

.team-badge {
  font-family: 'Work Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  letter-spacing: 0.05em;
}

.team-badge.red {
  background: var(--accent-red-glow);
  color: var(--accent-red);
  border: 1px solid var(--accent-red);
}

.team-badge.blue {
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
  border: 1px solid var(--accent-teal);
}

.team-switch-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.team-badge.clickable {
  cursor: pointer;
  transition: filter 0.2s ease;
}

.team-badge.clickable:hover {
  filter: brightness(1.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.stat-item .label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 700;
  letter-spacing: 0.05em;
}

.stat-item .value {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 600;
}

/* Streak styling */
.streak-item.streak-active .label {
  color: #f97316;
}

.streak-value {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.streak-flame {
  font-size: 1rem;
  animation: flameFlicker 1.5s ease-in-out infinite;
  display: inline-block;
}

@keyframes flameFlicker {
  0%, 100% { transform: scale(1) rotate(-3deg); }
  25% { transform: scale(1.15) rotate(3deg); }
  50% { transform: scale(1.05) rotate(-2deg); }
  75% { transform: scale(1.2) rotate(4deg); }
}

.streak-item.streak-active .value {
  color: #f97316;
  text-shadow: 0 0 12px rgba(249, 115, 22, 0.5);
}

.quests-section h3 {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.05em;
}

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quest-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.quest-item:hover {
  background: var(--bg-card);
  border-color: var(--border-color);
  transform: translateY(-2px);
}

.quest-item.locked {
  opacity: 0.6;
  background: var(--bg-card-alt);
}

.quest-icon {
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--bg-main);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.nav-btn.logout-btn:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
  background: var(--accent-red-glow);
}

.view-quests-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  font-family: 'Work Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-quests-btn:hover {
  background: var(--nav-btn-hover);
  color: var(--text-primary);
  border-color: var(--accent-teal);
}

.view-quests-btn:active {
  transform: translateY(2px);
}

.quest-details h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.quest-details p {
  margin: 0;
  color: var(--text-secondary);
  font-family: 'Work Sans', sans-serif;
  font-size: 0.85rem;
}

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 200px 1fr;
  }
  .stats-sidebar {
    grid-column: 1 / -1;
    border-left: none;
    border-top: 1px solid var(--border-color);
    padding-left: 0;
    padding-top: 2rem;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .quests-section {
    flex: 1;
    min-width: 300px;
  }
}

@media (max-width: 900px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
  .nav-sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding-right: 0;
    padding-bottom: 1.5rem;
  }
  .nav-sidebar nav {
    flex-direction: row;
    justify-content: center;
    position: static;
  }
  .difficulty-grid {
    grid-template-columns: 1fr;
  }
}
</style>
