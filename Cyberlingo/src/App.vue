<template>
  <div v-if="authStore.loading" class="loading-overlay">
    <div class="loader"></div>
  </div>
  <LandingPage
    v-else-if="currentPage === 'landing'"
    @toggle-theme="toggleTheme"
  />

  <TeamSelection
    v-else-if="currentPage === 'team-selection'"
    @team-selected="selectTeam"
  />

  <main v-else-if="currentPage === 'dashboard'" class="dashboard">
    <Dashboard
      :selected-team="selectedTeam"
      :is-dark-mode="isDarkMode"
      @go-to-admin="currentPage = 'admin'"
      @go-to-profile="currentPage = 'profile'"
      @go-to-quests="currentPage = 'quests'"
      @go-to-store="currentPage = 'store'"
      @go-to-lesson="(lvl) => { currentLevel = lvl; currentPage = 'lesson' }"
      @toggle-theme="toggleTheme"
      @go-to-team-selection="currentPage = 'team-selection'"
    />
  </main>

  <Profile
    v-else-if="currentPage === 'profile'"
    :selected-team="selectedTeam"
    @go-back="currentPage = 'dashboard'"
    @go-to-team-selection="goToTeamSelectionFromProfile"
  />

  <Quests
    v-else-if="currentPage === 'quests'"
    @go-back="currentPage = 'dashboard'"
  />

  <Store
    v-else-if="currentPage === 'store'"
    @go-back="currentPage = 'dashboard'"
  />

  <AdminDashboard
    v-else-if="currentPage === 'admin'"
    @go-back="currentPage = 'dashboard'"
    @toggle-theme="toggleTheme"
  />

  <LessonPage
    v-else-if="currentPage === 'lesson'"
    :level="currentLevel"
    @go-back="currentPage = 'dashboard'"
  />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import LandingPage from './components/LandingPage.vue'
import Dashboard from './components/Dashboard.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import Profile from './components/Profile.vue'
import Quests from './components/Quests.vue'
import Store from './components/Store.vue'
import TeamSelection from './components/TeamSelection.vue'
import LessonPage from './components/LessonPage.vue'
import { authStore } from './authStore.js'

const currentPage = ref('landing')
const currentLevel = ref('beginner')
const afterTeamSelection = ref('dashboard') // where to go after team is picked
const isDarkMode = ref(localStorage.getItem('theme') !== 'light')

// Team comes from Supabase profile, not local state
const selectedTeam = computed(() => authStore.profile.team ?? '')

// Initialize theme
watch(isDarkMode, (val) => {
  const theme = val ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}, { immediate: true })

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
}

// Navigate based on auth + team status
function navigateAfterAuth() {
  if (authStore.isAdmin) {
    currentPage.value = 'admin'
    return
  }
  if (authStore.user) {
    // If team already chosen, go straight to dashboard
    if (authStore.profile.team) {
      currentPage.value = 'dashboard'
    } else {
      currentPage.value = 'team-selection'
    }
  } else {
    currentPage.value = 'landing'
  }
}

// Initialize auth on mount
onMounted(async () => {
  await authStore.initialize()
  navigateAfterAuth()
})

// Watch user session for navigation
watch(() => authStore.user, (newUser, oldUser) => {
  if (newUser && !oldUser) {
    // Fresh login — wait briefly for profile to load, then navigate
    navigateAfterAuth()
  } else if (!newUser) {
    currentPage.value = 'landing'
  }
})

// Also watch profile.team in case it loads slightly after user
watch(() => authStore.profile.team, (team) => {
  if (currentPage.value === 'team-selection' && team) {
    currentPage.value = afterTeamSelection.value
    afterTeamSelection.value = 'dashboard'
  }
})

function goToTeamSelectionFromProfile() {
  afterTeamSelection.value = 'profile'
  currentPage.value = 'team-selection'
}

async function selectTeam(team) {
  await authStore.saveTeam(team)
  currentPage.value = afterTeamSelection.value
  afterTeamSelection.value = 'dashboard' // reset
}

onUnmounted(() => {
  delete window.handleCredentialResponse
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Space+Grotesk:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');

:global(:root) {
  /* DARK THEME (Default) */
  --bg-main: #0b1220;
  --bg-card: rgba(10, 20, 36, 0.95);
  --bg-card-alt: rgba(16, 29, 51, 0.4);
  --bg-hero: rgba(10, 20, 36, 0.95);
  --border-color: #243a5c;
  --text-primary: #f1f7ff;
  --text-secondary: #a6bcdb;
  --accent-teal: #1fb39c;
  --accent-teal-glow: rgba(31, 179, 156, 0.15);
  --accent-red: #e2586e;
  --accent-red-glow: rgba(226, 88, 110, 0.15);
  --nav-btn-hover: rgba(36, 58, 92, 0.4);
  --loader-border: #1d3254;
  --card-shadow: rgba(0, 0, 0, 0.35);
}

:global([data-theme='light']) {
  /* LIGHT THEME Overrides */
  --bg-main: #f0f4f8;
  --bg-card: #ffffff;
  --bg-card-alt: #e1e8f0;
  --bg-hero: #ffffff;
  --border-color: #d1dceb;
  --text-primary: #1a2b4b;
  --text-secondary: #5a6d8c;
  --accent-teal: #16a085;
  --accent-teal-glow: rgba(22, 160, 133, 0.1);
  --accent-red: #c0392b;
  --accent-red-glow: rgba(192, 57, 43, 0.1);
  --nav-btn-hover: #e1e8f0;
  --loader-border: #d1dceb;
  --card-shadow: rgba(0, 0, 0, 0.1);
}

:global(body) {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  background: var(--bg-main);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader {
  width: 48px;
  height: 48px;
  border: 4px solid var(--loader-border);
  border-bottom-color: var(--accent-teal);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.landing {
  min-height: 100vh;
  padding: 2rem 1rem;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: stretch;
}

.hero,
.auth-card {
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background: var(--bg-hero);
  box-shadow: 0 16px 32px var(--card-shadow);
}

.hero {
  padding: 2rem;
  background:
    radial-gradient(circle at 0% 0%, rgba(31, 166, 184, 0.25), transparent 42%),
    radial-gradient(circle at 85% 0%, rgba(46, 90, 163, 0.32), transparent 48%),
    linear-gradient(180deg, rgba(10, 20, 36, 0.95), rgba(10, 18, 31, 0.95));
}


.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #53c7b5;
}

h1 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  margin: 0.5rem 0 0.8rem;
  font-size: clamp(1.8rem, 3.6vw, 2.6rem);
  line-height: 1.1;
  color: var(--text-primary);
}

.lead {
  margin: 0;
  color: var(--text-secondary);
  max-width: 58ch;
}

.badges {
  margin-top: 1.1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.badges span {
  font-family: 'JetBrains Mono', monospace;
  border: 1px solid var(--border-color);
  background: var(--bg-card-alt);
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  color: var(--accent-teal);
}

.benefits {
  margin: 1.2rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
}

.benefits li {
  border-left: 2px solid #22a693;
  padding-left: 0.7rem;
  color: #c6d6ee;
}

.auth-card {
  padding: 1.2rem;
}

.tab-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.tab {
  font-family: 'JetBrains Mono', monospace;
  border: 1px solid #2f496f;
  background: #101d33;
  color: #8ea8cc;
  border-radius: 10px;
  padding: 0.6rem;
  font: inherit;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab:not(.active):hover {
  background: #172a48;
  color: #c6d6ee;
  border-color: #3b5a8e;
  transform: translateY(-1px);
}

.tab.active {
  color: #e7f1ff;
  border-color: #2db39f;
  background: linear-gradient(180deg, #17344d, #12283e);
}

h2 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  margin: 0;
  font-size: 1.15rem;
  color: #f0f6ff;
}

.auth-subtitle {
  margin: 0.35rem 0 0.9rem;
  color: #a6bcdb;
}

.auth-form {
  display: grid;
  gap: 0.55rem;
}

.auth-form label {
  font-size: 0.9rem;
  color: #95afcf;
}

.auth-form input {
  border: 1px solid #314f78;
  background: #0a1629;
  color: #e2edff;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
}

.auth-form input:focus {
  outline: 2px solid #1ab7aa;
  border-color: #1ab7aa;
}

.password-rules {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.35rem;
}

.password-rules li {
  color: #8ba6cb;
  font-size: 0.86rem;
  transition: color 0.3s ease;
}

.password-rules li.ok {
  color: #67d2bc;
}

.password-rules li.error {
  color: #ff8793;
}

.auth-error {
  margin: 0.2rem 0;
  color: #ff8793;
  font-size: 0.86rem;
}

.primary-btn {
  margin-top: 0.35rem;
  border: 1px solid #1fb39c;
  background: linear-gradient(180deg, #1cb8a0, #118f7d);
  color: #062720;
  border-radius: 10px;
  padding: 0.7rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.primary-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(28, 184, 160, 0.25);
}

.primary-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(28, 184, 160, 0.2);
}

.divider {
  margin: 1rem 0 0.9rem;
  text-align: center;
  position: relative;
  color: #7e97bc;
  font-size: 0.85rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid #2b4163;
}

.divider span {
  position: relative;
  padding: 0 0.6rem;
  background: #0d192c;
}



@media (max-width: 900px) {
  .landing {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 1.4rem;
  }
}

/* --- Team Selection Page Styles --- */
.team-selection {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.team-cards-container {
  text-align: center;
  width: 100%;
}

.team-cards-container h2 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  margin: 0 0 0.75rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.team-cards-container .subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 60ch;
  margin: 0 auto 4rem;
.team-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  padding: 3.5rem 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--card-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.teams-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.team-card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: var(--accent-teal);
  box-shadow: 0 20px 40px var(--card-shadow);
}

.team-card.red-team:hover {
  border-color: var(--accent-red);
  box-shadow: 0 20px 40px var(--accent-red-glow);
}

.team-card.blue-team:hover {
  border-color: var(--accent-teal);
  box-shadow: 0 20px 40px var(--accent-teal-glow);
}

.team-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  padding: 3.5rem 2.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  font: inherit;
  color: inherit;
  box-shadow: 0 8px 32px var(--card-shadow);
}

.knight-icon {
  width: 160px;
  height: 180px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
}

.knight-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.team-card h3 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  font-size: 2rem;
  margin: 0;
  color: var(--text-primary);
  transition: color 0.4s ease;
}

.team-card p {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  font-size: 1.05rem;
  transition: color 0.4s ease;
}

/* Blue Team Hover Effects */
.blue-team {
  border-color: rgba(31, 179, 156, 0.2);
}

.blue-team:hover {
  transform: translateY(-8px);
  border-color: var(--accent-teal);
  box-shadow: 0 20px 50px var(--accent-teal-glow), 0 0 0 1px var(--accent-teal);
  background: var(--bg-card-alt);
}

.blue-team:hover .knight-icon {
  transform: scale(1.08) translateY(-6px);
  filter: drop-shadow(0 12px 24px rgba(31, 179, 156, 0.5));
}

.blue-team:hover .knight-icon img {
  filter: drop-shadow(0 0 14px rgba(31, 179, 156, 0.6));
}

.blue-team:hover h3 {
  color: var(--accent-teal);
  text-shadow: 0 0 20px var(--accent-teal-glow);
}

.blue-team:hover p {
  color: #c0d8f0;
}

.blue-team:active {
  transform: translateY(-2px);
}

/* Red Team Hover Effects */
.red-team {
  border-color: rgba(226, 88, 110, 0.2);
}

.red-team:hover {
  transform: translateY(-8px);
  border-color: var(--accent-red);
  box-shadow: 0 20px 50px var(--accent-red-glow), 0 0 0 1px var(--accent-red);
  background: var(--bg-card-alt);
}

.red-team:hover .knight-icon {
  transform: scale(1.08) translateY(-6px);
  filter: drop-shadow(0 12px 24px rgba(226, 88, 110, 0.5));
}

.red-team:hover .knight-icon img {
  filter: drop-shadow(0 0 14px rgba(226, 88, 110, 0.6));
}

.red-team:hover h3 {
  color: #f77e91;
  text-shadow: 0 0 20px rgba(226, 88, 110, 0.4);
}

.red-team:hover p {
  color: #fbe0e4;
}

.red-team:active {
  transform: translateY(-2px);
}

/* --- Dashboard Page Styles --- */
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
  border-right: 1px solid #243a5c;
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
  color: #a6bcdb;
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
  background: rgba(36, 58, 92, 0.4);
  color: #f1f7ff;
  border-color: #243a5c;
  transform: translateX(4px);
}

.nav-btn .icon {
  font-size: 1.4rem;
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
  color: #ffffff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 2rem 0;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.diff-card {
  background: linear-gradient(180deg, rgba(16, 29, 51, 0.6), rgba(10, 18, 31, 0.9));
  border: 1px solid #243a5c;
  border-radius: 20px;
  padding: 2.5rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;
}

.diff-card h3 {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.4rem;
  color: #f1f7ff;
  margin: 0;
  transition: transform 0.3s ease;
}

.diff-card:hover:not(.locked) {
  transform: translateY(-4px);
  background: linear-gradient(180deg, rgba(23, 42, 71, 0.8), rgba(10, 18, 31, 0.95));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.diff-card:hover:not(.locked) h3 {
  transform: scale(1.05);
}

.diff-card.beginner:hover:not(.locked) { border-color: #1fb39c; box-shadow: 0 8px 24px rgba(31, 179, 156, 0.15); }
.diff-card.intermediate:hover:not(.locked) { border-color: #f39c12; box-shadow: 0 8px 24px rgba(243, 156, 18, 0.15); }
.diff-card.pro:hover:not(.locked) { border-color: #e2586e; box-shadow: 0 8px 24px rgba(226, 88, 110, 0.15); }

.diff-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
  flex-direction: column;
  gap: 0.5rem;
}

.lock-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: grayscale(1);
}

/* Dashboard: Stats Sidebar */
.stats-sidebar {
  border-left: 1px solid #243a5c;
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
  background: rgba(16, 29, 51, 0.4);
  border: 1px solid #243a5c;
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
  background: rgba(226, 88, 110, 0.15);
  color: #f77e91;
  border: 1px solid rgba(226, 88, 110, 0.3);
}

.team-badge.blue {
  background: rgba(31, 179, 156, 0.15);
  color: #53c7b5;
  border: 1px solid rgba(31, 179, 156, 0.3);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.stat-item .label {
  font-size: 0.7rem;
  color: #7e97bc;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.stat-item .value {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.1rem;
  color: #f1f7ff;
  font-weight: 600;
}

.quests-section h3 {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.5rem;
  color: #f1f7ff;
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
  background: rgba(16, 29, 51, 0.4);
  border: 1px solid #243a5c;
  border-radius: 16px;
  transition: all 0.2s ease;
}

.quest-item:hover {
  background: rgba(23, 42, 71, 0.6);
  border-color: #3b5a8e;
  transform: translateY(-2px);
}

.quest-item.locked {
  opacity: 0.6;
  background: rgba(10, 18, 31, 0.4);
}

.quest-icon {
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #101d33;
  border-radius: 12px;
  border: 1px solid #243a5c;
}

.view-quests-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid #3b5a8e;
  border-radius: 12px;
  color: #a6bcdb;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-quests-btn:hover {
  background: rgba(36, 58, 92, 0.4);
  color: #f1f7ff;
  border-color: #53c7b5;
}

.view-quests-btn:active {
  transform: translateY(2px);
}

.quest-details h4 {
  margin: 0 0 0.25rem 0;
  color: #e2edff;
  font-size: 1rem;
}

.quest-details p {
  margin: 0;
  color: #7e97bc;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.85rem;
}

  .difficulty-grid {
    grid-template-columns: 1fr;
  }
}
</style>
