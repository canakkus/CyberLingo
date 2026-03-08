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
            <li :class="{ ok: passwordChecks.hasLength }">Mindestens 8 Zeichen</li>
            <li :class="{ ok: passwordChecks.hasSpecial }">Mindestens 1 Sonderzeichen</li>
            <li :class="{ ok: passwordChecks.hasNumber }">Mindestens 1 Zahl</li>
            <li :class="{ ok: passwordChecks.hasUpper }">Mindestens 1 Grossbuchstabe</li>
          </ul>

          <label for="displayName">Anzeigename</label>
          <input id="displayName" v-model.trim="displayName" type="text" required autocomplete="name" />
        </template>

        <p v-if="authError" class="auth-error">{{ authError }}</p>

        <button type="submit" class="primary-btn">
          {{ mode === 'login' ? 'Einloggen' : 'Weiter zur Niveauauswahl' }}
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

  <main v-else class="onboarding-page">
    <section class="onboarding-card duolingo-card">
      <div class="character-header">
        <div class="avatar-robot">🤖</div>
        <div class="speech-bubble">
          Wie viel Cybersecurity kannst du schon?
        </div>
      </div>

      <form class="level-form" @submit.prevent="completeOnboarding">
        <label class="level-option" :class="{ selected: level === 'beginner' }">
          <input v-model="level" type="radio" value="beginner" name="level" />
          <div class="icon-signal">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="2" y="16" width="4" height="4" rx="1" fill="#1fb39c" />
              <rect x="8" y="12" width="4" height="8" rx="1" fill="#334155" />
              <rect x="14" y="8" width="4" height="12" rx="1" fill="#334155" />
              <rect x="20" y="4" width="4" height="16" rx="1" fill="#334155" />
            </svg>
          </div>
          <div class="level-text">
            Ich fange ganz neu mit Cybersecurity an.
          </div>
        </label>

        <label class="level-option" :class="{ selected: level === 'intermediate' }">
          <input v-model="level" type="radio" value="intermediate" name="level" />
          <div class="icon-signal">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="2" y="16" width="4" height="4" rx="1" fill="#1fb39c" />
              <rect x="8" y="12" width="4" height="8" rx="1" fill="#1fb39c" />
              <rect x="14" y="8" width="4" height="12" rx="1" fill="#334155" />
              <rect x="20" y="4" width="4" height="16" rx="1" fill="#334155" />
            </svg>
          </div>
          <div class="level-text">
            Ich kenne gängige Begriffe und Angriffsarten.
          </div>
        </label>

        <label class="level-option" :class="{ selected: level === 'advanced' }">
          <input v-model="level" type="radio" value="advanced" name="level" />
          <div class="icon-signal">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="2" y="16" width="4" height="4" rx="1" fill="#1fb39c" />
              <rect x="8" y="12" width="4" height="8" rx="1" fill="#1fb39c" />
              <rect x="14" y="8" width="4" height="12" rx="1" fill="#1fb39c" />
              <rect x="20" y="4" width="4" height="16" rx="1" fill="#334155" />
            </svg>
          </div>
          <div class="level-text">
            Ich weiß gut über IT-Sicherheit Bescheid (Praxis).
          </div>
        </label>
        
        <label class="level-option" :class="{ selected: level === 'expert' }">
          <input v-model="level" type="radio" value="expert" name="level" />
          <div class="icon-signal">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="2" y="16" width="4" height="4" rx="1" fill="#1fb39c" />
              <rect x="8" y="12" width="4" height="8" rx="1" fill="#1fb39c" />
              <rect x="14" y="8" width="4" height="12" rx="1" fill="#1fb39c" />
              <rect x="20" y="4" width="4" height="16" rx="1" fill="#1fb39c" />
            </svg>
          </div>
          <div class="level-text">
            Ich kann mich detailliert und technisch äußern.
          </div>
        </label>

        <button type="submit" class="primary-btn continue-btn">WEITER</button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const currentPage = ref('landing')
const mode = ref('login')
const email = ref('')
const password = ref('')
const displayName = ref('')
const level = ref('beginner')
const authError = ref('')

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

  currentPage.value = 'onboarding'
}

function completeOnboarding() {
  alert(`Registrierung abgeschlossen fuer ${displayName.value} (Level: ${level.value}).`)
}

window.handleCredentialResponse = (response) => {
  const payload = decodeJwtResponse(response?.credential)
  if (!payload) return
  alert(`Google Login erfolgreich: ${payload.email || payload.name || 'User'}`)
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

.landing,
.onboarding-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

.landing {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: stretch;
}

.hero,
.auth-card,
.onboarding-card {
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

.onboarding-card {
  max-width: 760px;
  margin: 4rem auto;
  padding: 1.5rem;
}

.duolingo-card {
  max-width: 600px;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.character-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  justify-content: center;
}

.avatar-robot {
  font-size: 4.5rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.speech-bubble {
  position: relative;
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  font-size: 1.25rem;
  color: #f1f5f9;
  font-weight: 600;
}

@media (min-width: 601px) {
  .speech-bubble::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-style: solid;
    left: -12px;
    border-width: 10px 12px 10px 0;
    border-color: transparent #334155 transparent transparent;
    z-index: 1;
  }
  .speech-bubble::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-style: solid;
    left: -9px;
    border-width: 8px 10px 8px 0;
    border-color: transparent #1e293b transparent transparent;
    z-index: 2;
  }
}

@media (max-width: 600px) {
  .character-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  .speech-bubble::before {
    content: '';
    position: absolute;
    border-style: solid;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 10px 12px 10px;
    border-color: transparent transparent #334155 transparent;
  }
  .speech-bubble::after {
    content: '';
    position: absolute;
    border-style: solid;
    top: -9px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 8px 10px 8px;
    border-color: transparent transparent #1e293b transparent;
  }
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

.auth-form,
.level-form {
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
}

.password-rules li.ok {
  color: #67d2bc;
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

.level-option {
  border: 2px solid #334155;
  background: transparent;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0.75rem;
}

.level-option:not(.selected):hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.level-option.selected {
  border-color: #2db39f;
  background: rgba(45, 179, 159, 0.1);
}

.level-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.icon-signal {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.level-text {
  font-weight: 600;
  font-size: 1.05rem;
  color: #f8fafc;
}

.continue-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 1.1rem;
  border-radius: 16px;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

@media (max-width: 900px) {
  .landing {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 1.4rem;
  }

  .onboarding-card {
    margin: 2rem auto;
  }
}
</style>
