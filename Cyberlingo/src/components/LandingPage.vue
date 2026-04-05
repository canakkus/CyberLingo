<template>
  <main class="landing">
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

    <button class="landing-theme-toggle" @click="$emit('toggle-theme')" title="Theme wechseln">
      🌓
    </button>
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
        <label for="email">E-Mail / Benutzername</label>
        <input id="email" v-model.trim="email" type="text" required autocomplete="email" />

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

        <p v-if="authStore.authMessage" class="auth-success-msg">{{ authStore.authMessage }}</p>
        <p v-if="authError" class="auth-error">{{ authError }}</p>

        <button type="submit" class="primary-btn" :disabled="loading">
          {{ loading ? 'Verarbeite...' : (mode === 'login' ? 'Einloggen' : 'Registrieren') }}
        </button>
      </form>

      <div class="divider"><span>oder</span></div>

      <button type="button" class="google-btn" :disabled="googleLoading" @click="handleGoogleSignIn">
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span>{{ googleLoading ? 'Wird geladen...' : 'Mit Google anmelden' }}</span>
      </button>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { authStore } from '../authStore'

defineEmits(['toggle-theme'])

const mode = ref('login')
const email = ref('')
const password = ref('')
const displayName = ref('')
const authError = ref('')
const loading = ref(false)
const googleLoading = ref(false)

const passwordChecks = computed(() => ({
  hasLength: password.value.length >= 8,
  hasSpecial: /[^A-Za-z0-9]/.test(password.value),
  hasNumber: /\d/.test(password.value),
  hasUpper: /[A-Z]/.test(password.value),
}))

async function submitAuth() {
  authError.value = ''
  authStore.setAuthMessage('')
  loading.value = true

  try {
    if (mode.value === 'login') {
      await authStore.signIn(email.value, password.value)
      // Navigation is handled by the watcher in App.vue
    } else {
      if (!displayName.value) {
        authError.value = 'Bitte gib einen Anzeigenamen ein.'
        return
      }

      const validPassword = Object.values(passwordChecks.value).every(Boolean)
      if (!validPassword) {
        authError.value = 'Passwort erfuellt noch nicht alle Anforderungen.'
        return
      }

      await authStore.signUp(email.value, password.value, displayName.value)
      authStore.setAuthMessage('Registrierung erfolgreich! Bitte prüfe deine E-Mails.')
    }
  } catch (err) {
    if (err.message === 'USER_ALREADY_EXISTS') {
      mode.value = 'login'
      authStore.setAuthMessage('Du hast bereits einen Account. Bitte logge dich hier ein.')
    } else {
      authError.value = err.message || 'Ein Fehler ist aufgetreten.'
    }
  } finally {
    loading.value = false
  }
}

async function handleGoogleSignIn() {
  googleLoading.value = true
  authError.value = ''
  try {
    // Supabase OAuth handles both new AND existing users automatically:
    // existing → signs in, new → creates account
    await authStore.signInWithGoogle()
    // Page redirects to Google, so no further action needed here
  } catch (err) {
    authError.value = err.message || 'Google Anmeldung fehlgeschlagen.'
    googleLoading.value = false
  }
}
</script>

<style scoped>
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
  background: var(--bg-card);
  box-shadow: 0 16px 32px var(--card-shadow);
}

.hero {
  padding: 2rem;
  background: var(--bg-card);
}

.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent-teal);
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
  color: var(--text-secondary);
}

.benefits {
  margin: 1.2rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
}

.benefits li {
  border-left: 2px solid var(--accent-teal);
  padding-left: 0.7rem;
  color: var(--text-secondary);
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
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-secondary);
  border-radius: 10px;
  padding: 0.6rem;
  font: inherit;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab:not(.active):hover {
  background: var(--nav-btn-hover);
  color: var(--text-primary);
  border-color: var(--border-color);
  transform: translateY(-1px);
}

.tab.active {
  color: var(--text-primary);
  border-color: var(--accent-teal);
  background: var(--bg-card-alt);
}

h2 {
  font-family: 'Space Grotesk', 'Work Sans', sans-serif;
  margin: 0;
  font-size: 1.15rem;
  color: var(--text-primary);
}

.auth-subtitle {
  margin: 0.35rem 0 0.9rem;
  color: var(--text-secondary);
}

.auth-form {
  display: grid;
  gap: 0.55rem;
}

.auth-form label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.auth-form input {
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-primary);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
}

.auth-form input:focus {
  outline: 2px solid var(--accent-teal);
  border-color: var(--accent-teal);
}

.password-rules {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.35rem;
}

.password-rules li {
  color: var(--text-secondary);
  font-size: 0.86rem;
  transition: color 0.3s ease;
}

.password-rules li.ok {
  color: var(--accent-teal);
}

.password-rules li.error {
  color: var(--accent-red);
}

.auth-error {
  margin: 0.2rem 0;
  color: var(--accent-red);
  font-size: 0.86rem;
}

.auth-success-msg {
  margin: 0.2rem 0;
  color: var(--accent-teal);
  font-size: 0.86rem;
  font-weight: 600;
  padding: 0.5rem;
  background: var(--accent-teal-glow);
  border-radius: 8px;
}

.primary-btn {
  margin-top: 0.35rem;
  border: 1px solid var(--accent-teal);
  background: var(--accent-teal);
  color: white;
  border-radius: 10px;
  padding: 0.7rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px var(--card-shadow);
}

.primary-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--accent-teal-glow);
}

.primary-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px var(--accent-teal-glow);
}

.divider {
  margin: 1rem 0 0.9rem;
  text-align: center;
  position: relative;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid var(--border-color);
}

.divider span {
  position: relative;
  padding: 0 0.6rem;
  background: var(--bg-main);
}

.landing-theme-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--card-shadow);
}

.landing-theme-toggle:hover {
  background: var(--nav-btn-hover);
  transform: translateY(-2px);
  border-color: var(--accent-teal);
}

@media (max-width: 900px) {
  .landing {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 1.4rem;
  }
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.google-btn:hover:not(:disabled) {
  background: var(--nav-btn-hover);
  border-color: var(--accent-teal);
  transform: translateY(-2px);
  box-shadow: 0 4px 14px var(--card-shadow);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
