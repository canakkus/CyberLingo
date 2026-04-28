<template>
  <main class="dashboard">
    <aside class="nav-sidebar">
      <nav>
        <button class="nav-btn btn-profile" @click="$emit('go-to-profile')">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </span>
          Profile
        </button>

        <button class="nav-btn btn-store" @click="$emit('go-to-store')">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v2.5c0 .83.5 1.55 1.22 1.88V19c0 1.1.9 2 2 2h13.56c1.1 0 2-.9 2-2v-8.62C21.5 10.05 22 9.33 22 8.5V6c0-1.1-.9-2-2-2zm-1 15H5v-8h14v8zm1-10H4V6h16v3z"/>
              <path d="M3 6.5c0 .83.67 1.5 1.5 1.5S6 7.33 6 6.5 5.33 5 4.5 5 3 5.67 3 6.5zm4.5 0C7.5 7.33 8.17 8 9 8s1.5-.67 1.5-1.5S9.83 5 9 5s-1.5.67-1.5 1.5zm4.5 0c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S14.33 5 13.5 5 12 5.67 12 6.5zm4.5 0c0 .83.67 1.5 1.5 1.5S19.5 7.33 19.5 6.5 18.83 5 18 5s-1.5.67-1.5 1.5z"/>
            </svg>
          </span>
          Store
        </button>

        <button class="nav-btn btn-notifications">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </span>
          Notifications
        </button>

        <button v-if="authStore.isAdmin" class="nav-btn admin-btn btn-admin" @click="$emit('go-to-admin')">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </span>
          Admin
        </button>

        <button class="nav-btn btn-theme" @click="$emit('toggle-theme')">
          <span class="icon theme-icon-wrap">
            <Transition name="moon-switch" mode="out-in">
              <svg v-if="!isDarkMode" key="light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <svg v-else key="dark" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </Transition>
          </span>
          Theme wechseln
        </button>

        <button class="nav-btn logout-btn btn-logout" @click="handleLogout">
          <span class="icon">
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
        <div class="stat-item streak-item"
          :class="{
            'streak-active': authStore.userStats.streak > 0,
            'streak-blue': authStore.userStats.streak > 0 && authStore.profile.team === 'blue',
            'streak-red': authStore.userStats.streak > 0 && authStore.profile.team === 'red'
          }">
          <span class="label">STREAK</span>
          <span class="value streak-value">
            <span class="streak-flame" v-if="authStore.userStats.streak > 0">
              <!-- Team-colored SVG flame -->
              <svg class="flame-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
            </span>
            {{ authStore.userStats.streak }}
          </span>
        </div>
        <div class="stat-item">
          <span class="label">🪙 COINS</span>
          <span class="value coins-value">{{ authStore.userStats.coins ?? 0 }}</span>
        </div>
      </div>

      <!-- Admin coins setter -->
      <div v-if="authStore.isAdmin" class="admin-streak-setter admin-coins-setter">
        <span class="admin-streak-label">🪙 Coins setzen</span>
        <div class="admin-streak-controls">
          <button class="streak-adj coins-adj" @click="adminSetCoins((authStore.userStats.coins ?? 0) - 50)">−</button>
          <input
            class="streak-input"
            type="number"
            min="0"
            :value="authStore.userStats.coins ?? 0"
            @change="adminSetCoins(+$event.target.value)"
          />
          <button class="streak-adj coins-adj" @click="adminSetCoins((authStore.userStats.coins ?? 0) + 50)">+</button>
        </div>
      </div>

      <!-- Admin streak setter -->
      <div v-if="authStore.isAdmin" class="admin-streak-setter">
        <span class="admin-streak-label">🔧 Streak setzen</span>
        <div class="admin-streak-controls">
          <button class="streak-adj" @click="adminSetStreak(authStore.userStats.streak - 1)">−</button>
          <input
            class="streak-input"
            type="number"
            min="0"
            :value="authStore.userStats.streak"
            @change="adminSetStreak(+$event.target.value)"
          />
          <button class="streak-adj" @click="adminSetStreak(authStore.userStats.streak + 1)">+</button>
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
  },
  isDarkMode: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['go-to-admin', 'toggle-theme', 'go-to-profile', 'go-to-quests', 'go-to-store', 'go-to-lesson', 'go-to-team-selection'])

function openTeamSelection() {
  emit('go-to-team-selection')
}

async function handleLogout() {
  await authStore.signOut()
}

function adminSetCoins(val) {
  const n = Math.max(0, Number(val) || 0)
  authStore.saveUserStats({ coins: n })
}

function adminSetStreak(val) {
  const n = Math.max(0, Number(val) || 0)
  authStore.userStats.streak = n
  // Also persist (admin session-only, no DB needed)
  authStore.saveUserStats({ streak: n })
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
  gap: 0.4rem;
  position: sticky;
  top: 2rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  width: 100%;
  padding: 1.15rem 1.4rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 16px;
  color: var(--text-secondary);
  font-family: 'Work Sans', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
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
  font-size: 1.5rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-btn .icon svg {
  width: 28px;
  height: 28px;
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

.coins-value {
  color: #f5b731;
}

/* Streak styling */
.streak-value {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.streak-flame {
  display: flex;
  align-items: center;
}

.flame-svg {
  width: 18px;
  height: 18px;
  animation: flameFlicker 1.2s ease-in-out infinite;
  filter: drop-shadow(0 0 4px currentColor);
}

@keyframes flameFlicker {
  0%, 100% { transform: scaleY(1) scaleX(1) rotate(-2deg); }
  20%       { transform: scaleY(1.15) scaleX(0.95) rotate(2deg); }
  40%       { transform: scaleY(0.95) scaleX(1.05) rotate(-3deg); }
  60%       { transform: scaleY(1.2) scaleX(0.92) rotate(3deg); }
  80%       { transform: scaleY(1.05) scaleX(1) rotate(-1deg); }
}

/* Blue team flame */
.streak-blue .flame-svg { color: #3b82f6; }
.streak-blue .value     { color: #3b82f6; text-shadow: 0 0 12px rgba(59,130,246,0.6); }
.streak-blue .label     { color: #3b82f6; }

/* Red team flame */
.streak-red .flame-svg  { color: #ef4444; }
.streak-red .value      { color: #ef4444; text-shadow: 0 0 12px rgba(239,68,68,0.6); }
.streak-red .label      { color: #ef4444; }

/* Fallback (no team) */
.streak-active:not(.streak-blue):not(.streak-red) .flame-svg { color: #f97316; }
.streak-active:not(.streak-blue):not(.streak-red) .value     { color: #f97316; }

/* ---- Theme moon icon animation ---- */
.theme-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Slide+fade transition for moon switch */
.moon-switch-enter-active,
.moon-switch-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.moon-switch-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}
.moon-switch-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

/* ---- Icon click animations ---- */

/* Profile: bounce on click */
.btn-profile:active .icon { animation: iconBounce 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
.btn-profile:hover .icon  { animation: iconWiggle 0.5s ease; }

/* Store: pop scale on click */
.btn-store:active .icon  { animation: iconPop 0.35s ease; }
.btn-store:hover .icon   { animation: iconFloat 0.6s ease infinite alternate; }

/* Bell: ring shake on hover */
.btn-notifications:hover .icon  { animation: iconRing 0.5s ease; }
.btn-notifications:active .icon { animation: iconRing 0.3s ease; }

/* Admin/gear: spin on hover */
.btn-admin:hover .icon  { animation: iconSpin 0.6s ease; }
.btn-admin:active .icon { animation: iconSpin 0.4s ease; }

/* Theme/moon: pulse on hover */
.btn-theme:hover .icon  { animation: iconPulse 0.5s ease; }
.btn-theme:active .icon { animation: iconPop 0.3s ease; }

/* Logout: slide right on click */
.btn-logout:hover .icon  { animation: iconSlide 0.4s ease; }
.btn-logout:active .icon { animation: iconSlide 0.25s ease; }

@keyframes iconBounce {
  0%,100% { transform: translateY(0) scale(1); }
  30%      { transform: translateY(-6px) scale(1.15); }
  60%      { transform: translateY(2px) scale(0.95); }
}

@keyframes iconWiggle {
  0%,100% { transform: rotate(0deg); }
  20%     { transform: rotate(-12deg); }
  40%     { transform: rotate(12deg); }
  60%     { transform: rotate(-8deg); }
  80%     { transform: rotate(6deg); }
}

@keyframes iconPop {
  0%,100% { transform: scale(1); }
  40%     { transform: scale(1.35); }
  70%     { transform: scale(0.9); }
}

@keyframes iconFloat {
  from { transform: translateY(0); }
  to   { transform: translateY(-4px); }
}

@keyframes iconRing {
  0%,100% { transform: rotate(0deg) scale(1); }
  15%     { transform: rotate(15deg) scale(1.1); }
  35%     { transform: rotate(-13deg) scale(1.1); }
  55%     { transform: rotate(10deg); }
  75%     { transform: rotate(-8deg); }
}

@keyframes iconSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes iconPulse {
  0%,100% { transform: scale(1); opacity: 1; }
  50%     { transform: scale(1.25); opacity: 0.8; }
}

@keyframes iconSlide {
  0%   { transform: translateX(0); }
  40%  { transform: translateX(6px); }
  70%  { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}

/* ---- Admin Streak Setter ---- */
.admin-streak-setter {
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-streak-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-streak-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.streak-adj {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.streak-adj:hover { background: rgba(139, 92, 246, 0.3); transform: scale(1.1); }
.streak-adj:active { transform: scale(0.92); }

.admin-coins-setter {
  background: rgba(245, 183, 49, 0.08);
  border-color: rgba(245, 183, 49, 0.25);
}
.admin-coins-setter .admin-streak-label { color: #f5b731; }
.coins-adj {
  border-color: rgba(245, 183, 49, 0.4) !important;
  background: rgba(245, 183, 49, 0.15) !important;
  color: #f5b731 !important;
}
.coins-adj:hover { background: rgba(245, 183, 49, 0.3) !important; }

.streak-input {
  flex: 1;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: #e2d9f3;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  padding: 0.3rem 0.4rem;
  outline: none;
}
.streak-input:focus { border-color: #a78bfa; }
.streak-input::-webkit-inner-spin-button,
.streak-input::-webkit-outer-spin-button { opacity: 0.4; }

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
