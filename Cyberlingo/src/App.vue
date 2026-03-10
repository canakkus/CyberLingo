<template>
  <main v-if="currentPage === 'landing'" class="landing">
    <section class="hero">
      <p class="eyebrow">CyberLingo</p>
      <h1>Cybersecurity lernen wie eine Sprache.</h1>
      <p class="lead">
        Interaktive Missionen, klare Lernpfade und praxisnahe Uebungen fuer Schulen,
        Teams und Selbstlerner.
      </p>

      <div class="badges">
        <span>Strukturiert</span>
        <span>Gamifiziert</span>
        <span>Praxisnah</span>
      </div>

      <ul class="benefits">
        <li>Kurze Lerneinheiten mit messbarem Fortschritt</li>
        <li>Missionen von Grundlagen bis Incident Response</li>
        <li>Geeignet fuer HTL, Ausbildung und Onboarding</li>
      </ul>
    </section>

    <section class="auth-card">
      <div class="tab-row">
        <button
          type="button"
          class="tab"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          Login
        </button>
        <button
          type="button"
          class="tab"
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          Registrieren
        </button>
      </div>

      <h2>{{ mode === 'login' ? 'Willkommen zurueck' : 'Konto erstellen' }}</h2>
      <p class="auth-subtitle">
        {{ mode === 'login' ? 'Melde dich an und starte deine naechste Mission.' : 'Starte in wenigen Sekunden mit deinem Lernpfad.' }}
      </p>

      <form class="auth-form" @submit.prevent="submitAuth">
        <label for="email">E-Mail</label>
        <input id="email" v-model.trim="email" type="email" required autocomplete="email" />

        <label for="password">Passwort</label>
        <input id="password" v-model="password" type="password" required autocomplete="current-password" />

        <template v-if="mode === 'register'">
          <ul class="password-rules">
            <li :class="{ ok: passwordChecks.hasLength, error: !passwordChecks.hasLength && password.length > 0 }">Mindestens 8 Zeichen</li>
            <li :class="{ ok: passwordChecks.hasSpecial, error: !passwordChecks.hasSpecial && password.length > 0 }">Mindestens 1 Sonderzeichen</li>
            <li :class="{ ok: passwordChecks.hasNumber, error: !passwordChecks.hasNumber && password.length > 0 }">Mindestens 1 Zahl</li>
            <li :class="{ ok: passwordChecks.hasUpper, error: !passwordChecks.hasUpper && password.length > 0 }">Mindestens 1 Grossbuchstabe</li>
          </ul>

          <label for="displayName">Anzeigename</label>
          <input id="displayName" v-model.trim="displayName" type="text" required autocomplete="name" />
        </template>

        <p v-if="authError" class="auth-error">{{ authError }}</p>

        <button type="submit" class="primary-btn">
          {{ mode === 'login' ? 'Einloggen' : 'Registrieren' }}
        </button>
      </form>

      <div class="divider"><span>oder</span></div>

      <div
        id="g_id_onload"
        data-client_id="787643878218-7fi5mq8dee6fb37j5pcs1srsuafitlgl.apps.googleusercontent.com"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      ></div>
      <div
        class="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="continue_with"
        data-shape="pill"
        data-logo_alignment="left"
      ></div>
    </section>
  </main>

  <main v-else-if="currentPage === 'team-selection'" class="team-selection">
    <div class="team-cards-container">
      <h2>Wähle deine Seite</h2>
      <p class="subtitle">Entscheide dich für einen Lernpfad. Du kannst dies später jederzeit ändern.</p>
      
      <div class="teams-wrapper">
        <button class="team-card blue-team" @click="selectTeam('blue')">
          <div class="icon-placeholder">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="Blue Team Icon Placeholder" />
          </div>
          <h3>Blue Team</h3>
          <p>Verteidige Systeme, analysiere Bedrohungen und sichere Netzwerke ab.</p>
        </button>

        <button class="team-card red-team" @click="selectTeam('red')">
          <div class="icon-placeholder">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="Red Team Icon Placeholder" />
          </div>
          <h3>Red Team</h3>
          <p>Denke wie ein Angreifer, finde Schwachstellen und teste Systeme.</p>
        </button>
      </div>
    </div>
  </main>

  <main v-else-if="currentPage === 'dashboard'" class="dashboard">
    <aside class="nav-sidebar">
      <nav>
        <button class="nav-btn">
          <span class="icon">👤</span>
          Profile
        </button>
        <button class="nav-btn">
          <span class="icon">🛒</span>
          Store
        </button>
        <button class="nav-btn">
          <span class="icon">🔔</span>
          Notifications
        </button>
      </nav>
    </aside>

    <section class="main-content">
      <header class="main-header">
        <h2>MAIN PAGE</h2>
      </header>

      <div class="difficulty-grid">
        <button class="diff-card beginner">
          <h3>BEGINNER</h3>
        </button>
        <button class="diff-card intermediate">
          <h3>INTERMEDIATE</h3>
        </button>
        <button class="diff-card pro">
          <h3>PRO</h3>
        </button>
      </div>
    </section>

    <aside class="stats-sidebar">
      <div class="stats-header">
        <div class="team-badge" :class="selectedTeam">
          {{ selectedTeam === 'red' ? 'RED TEAM' : 'BLUE TEAM' }}
        </div>
        <div class="stat-item">
          <span class="label">XP</span>
          <span class="value">0</span>
        </div>
        <div class="stat-item">
          <span class="label">LEVEL</span>
          <span class="value">1</span>
        </div>
        <div class="stat-item">
          <span class="label">STREAK</span>
          <span class="value">0</span>
        </div>
      </div>

      <div class="quests-section">
        <h3>QUESTS</h3>
        <div class="quest-list">
          <!-- Placeholder for quests -->
          <div class="quest-item">
            <div class="quest-icon">🎯</div>
            <div class="quest-details">
              <h4>Erstes Login</h4>
              <p>50 / 50 XP</p>
            </div>
          </div>
          <div class="quest-item locked">
            <div class="quest-icon">🔒</div>
            <div class="quest-details">
              <h4>Absolviere 1 Lektion</h4>
              <p>0 / 100 XP</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const currentPage = ref('landing')
const mode = ref('login')
const email = ref('')
const password = ref('')
const displayName = ref('')
const authError = ref('')
const selectedTeam = ref('')

const passwordChecks = computed(() => ({
  hasLength: password.value.length >= 8,
  hasSpecial: /[^A-Za-z0-9]/.test(password.value),
  hasNumber: /\d/.test(password.value),
  hasUpper: /[A-Z]/.test(password.value),
}))

function submitAuth() {
  authError.value = ''

  if (mode.value === 'login') {
    alert(`Login gestartet fuer ${email.value}`)
    return
  }

  if (!displayName.value) {
    authError.value = 'Bitte gib einen Anzeigenamen ein.'
    return
  }

  const validPassword = Object.values(passwordChecks.value).every(Boolean)
  if (!validPassword) {
    authError.value = 'Passwort erfuellt noch nicht alle Anforderungen.'
    return
  }

  // Go to team selection after successful registration
  currentPage.value = 'team-selection'
}

function selectTeam(team) {
  selectedTeam.value = team
  currentPage.value = 'dashboard'
}

window.handleCredentialResponse = (response) => {
  const payload = decodeJwtResponse(response?.credential)
  if (!payload) return
  // Go to team selection after successful Google login
  currentPage.value = 'team-selection'
}

function decodeJwtResponse(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch (error) {
    console.error('JWT decode failed:', error)
    return null
  }
}

onMounted(() => {
  const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
  if (existingScript) return

  const googleScript = document.createElement('script')
  googleScript.src = 'https://accounts.google.com/gsi/client'
  googleScript.async = true
  googleScript.defer = true
  document.head.appendChild(googleScript)
})

onUnmounted(() => {
  delete window.handleCredentialResponse
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Space+Grotesk:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');

:global(body) {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  background: #0b1220;
  color: #dce9ff;
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
  border: 1px solid #243a5c;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(10, 20, 36, 0.95), rgba(10, 18, 31, 0.95));
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.35);
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
  color: #f1f7ff;
}

.lead {
  margin: 0;
  color: #b3c6e2;
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
  border: 1px solid #2f5b91;
  background: rgba(13, 31, 56, 0.65);
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  color: #90bff5;
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
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0 0 0.5rem;
  color: #f1f7ff;
}

.team-cards-container .subtitle {
  color: #a6bcdb;
  margin: 0 0 3.5rem;
  font-size: 1.15rem;
}

.teams-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 768px) {
  .teams-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.team-card {
  background: linear-gradient(180deg, rgba(16, 29, 51, 0.4), rgba(10, 18, 31, 0.8));
  border: 1px solid #243a5c;
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.icon-placeholder {
  width: 140px;
  height: 140px;
  background-color: #050a14;
  border-radius: 24px;
  border: 2px dashed #2f496f;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

.icon-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transition: opacity 0.4s ease;
}

.team-card h3 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  font-size: 2rem;
  margin: 0;
  color: #f1f7ff;
  transition: color 0.4s ease;
}

.team-card p {
  color: #95afcf;
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
  border-color: #1fb39c;
  box-shadow: 0 20px 50px rgba(31, 179, 156, 0.15), 0 0 0 1px rgba(31, 179, 156, 0.5);
  background: linear-gradient(180deg, rgba(19, 59, 74, 0.8), rgba(10, 18, 31, 0.95));
}

.blue-team:hover .icon-placeholder {
  border-color: #1fb39c;
  box-shadow: 0 0 30px rgba(31, 179, 156, 0.3);
  transform: scale(1.05);
}

.blue-team:hover .icon-placeholder img {
  opacity: 1;
  filter: drop-shadow(0 0 10px rgba(31, 179, 156, 0.5));
}

.blue-team:hover h3 {
  color: #53c7b5;
  text-shadow: 0 0 20px rgba(31, 179, 156, 0.4);
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
  border-color: #e2586e;
  box-shadow: 0 20px 50px rgba(226, 88, 110, 0.15), 0 0 0 1px rgba(226, 88, 110, 0.5);
  background: linear-gradient(180deg, rgba(74, 25, 36, 0.8), rgba(10, 18, 31, 0.95));
}

.red-team:hover .icon-placeholder {
  border-color: #e2586e;
  box-shadow: 0 0 30px rgba(226, 88, 110, 0.3);
  transform: scale(1.05);
}

.red-team:hover .icon-placeholder img {
  opacity: 1;
  filter: drop-shadow(0 0 10px rgba(226, 88, 110, 0.5));
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
  color: #7e97bc;
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

.diff-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(180deg, rgba(23, 42, 71, 0.8), rgba(10, 18, 31, 0.95));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.diff-card:hover h3 {
  transform: scale(1.05);
}

.diff-card.beginner:hover { border-color: #1fb39c; box-shadow: 0 8px 24px rgba(31, 179, 156, 0.15); }
.diff-card.intermediate:hover { border-color: #f39c12; box-shadow: 0 8px 24px rgba(243, 156, 18, 0.15); }
.diff-card.pro:hover { border-color: #e2586e; box-shadow: 0 8px 24px rgba(226, 88, 110, 0.15); }

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

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 200px 1fr;
  }
  .stats-sidebar {
    grid-column: 1 / -1;
    border-left: none;
    border-top: 1px solid #243a5c;
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
    border-bottom: 1px solid #243a5c;
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
