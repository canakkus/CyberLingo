<template>
  <main class="profile-page">
    <div class="profile-container">
      <header class="profile-header">
        <button class="back-btn" @click="$emit('go-back')">← Zurück</button>
        <h1>Mein Profil</h1>
      </header>

      <div class="profile-card">
        <div class="user-info">
          <div class="avatar-large">{{ userInitial }}</div>
          <div class="user-details">
            <div class="name-row">
              <h2 v-if="!editingName">{{ displayName }}</h2>
              <div v-else class="name-edit-row">
                <input
                  ref="nameInput"
                  v-model.trim="editNameValue"
                  class="name-input"
                  maxlength="30"
                  @keyup.enter="saveName"
                  @keyup.escape="cancelEdit"
                />
                <button class="name-save-btn" :disabled="savingName" @click="saveName">
                  {{ savingName ? '...' : '✓' }}
                </button>
                <button class="name-cancel-btn" @click="cancelEdit">✕</button>
              </div>
              <button v-if="!editingName" class="edit-name-btn" title="Namen ändern" @click="startEdit">✏️</button>
            </div>
            <p v-if="saveNameError" class="name-error">{{ saveNameError }}</p>
            <p>{{ authStore.user?.email }}</p>
            <div class="team-selection">
              <span class="team-tag" :class="activeTeam" @click="$emit('go-to-team-selection')" title="Team wechseln">
                {{ activeTeam === 'red' ? 'RED TEAM' : 'BLUE TEAM' }} ✏️
              </span>
            </div>
          </div>
        </div>

        <div class="stats-grid-large">
          <div class="stat-box">
            <span class="stat-icon">⚡</span>
            <div class="stat-content">
              <span class="stat-value">{{ xp }}</span>
              <span class="stat-label">Gesamt XP</span>
            </div>
          </div>
          <div class="stat-box">
            <span class="stat-icon">📈</span>
            <div class="stat-content">
              <span class="stat-value">{{ level }}</span>
              <span class="stat-label">Aktuelles Level</span>
            </div>
          </div>
          <div class="stat-box streak-box" :class="'streak-' + activeTeam">
            <span class="stat-icon flame-wrap">
              <svg class="flame-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
            </span>
            <div class="stat-content">
              <span class="stat-value">{{ streak }}</span>
              <span class="stat-label">Tage Streak</span>
            </div>
          </div>
          <div class="stat-box coins-box">
            <span class="stat-icon">🪙</span>
            <div class="stat-content">
              <span class="stat-value">{{ coins }}</span>
              <span class="stat-label">Ling-Coins</span>
            </div>
          </div>
        </div>
      </div>

      <div class="achievements-section">
        <h3>Errungenschaften</h3>
        <div class="achievement-list">
          <div class="achievement-item locked">
            <span class="icon">🏆</span>
            <p>Erste Mission abgeschlossen (In Kürze)</p>
          </div>
          <div class="achievement-item locked">
            <span class="icon">🛡️</span>
            <p>Netzwerk-Experte (In Kürze)</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { authStore } from '../authStore'

const props = defineProps({
  selectedTeam: {
    type: String,
    default: ''
  }
})

defineEmits(['go-back', 'go-to-team-selection'])

const displayName = computed(() => {
  return authStore.profile.display_name
    || authStore.user?.user_metadata?.display_name
    || authStore.user?.email?.split('@')[0]
    || 'Agent'
})

const userInitial = computed(() => displayName.value.charAt(0).toUpperCase())
const activeTeam = computed(() => props.selectedTeam || authStore.profile.team || 'blue')
const xp = computed(() => authStore.userStats.xp)
const level = computed(() => authStore.userStats.level)
const streak = computed(() => authStore.userStats.streak)
const coins = computed(() => authStore.userStats.coins ?? 0)

// --- Name Editing ---
const editingName = ref(false)
const editNameValue = ref('')
const savingName = ref(false)
const saveNameError = ref('')
const nameInput = ref(null)

function startEdit() {
  editNameValue.value = displayName.value
  saveNameError.value = ''
  editingName.value = true
  nextTick(() => nameInput.value?.focus())
}

function cancelEdit() {
  editingName.value = false
  saveNameError.value = ''
}

async function saveName() {
  if (!editNameValue.value || editNameValue.value === displayName.value) {
    cancelEdit()
    return
  }
  savingName.value = true
  saveNameError.value = ''
  try {
    await authStore.updateDisplayName(editNameValue.value)
    editingName.value = false
  } catch (err) {
    saveNameError.value = 'Fehler beim Speichern.'
  } finally {
    savingName.value = false
  }
}

</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: var(--bg-main);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.back-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: var(--bg-card-alt);
  color: var(--text-primary);
  border-color: var(--accent-teal);
}

h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  margin: 0;
  color: var(--text-primary);
}

.profile-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 12px 32px var(--card-shadow);
  margin-bottom: 2.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 2rem;
}

.avatar-large {
  width: 100px;
  height: 100px;
  background: var(--accent-teal);
  color: #0d192c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  box-shadow: 0 0 20px var(--accent-teal-glow);
}

.user-details h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-primary);
}

/* Name editing */
.name-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.25rem;
}

.edit-name-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  padding: 0.1rem;
  line-height: 1;
}

.edit-name-btn:hover { opacity: 1; }

.name-edit-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.name-input {
  background: var(--bg-main);
  border: 1.5px solid var(--accent-teal);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  width: 200px;
  outline: none;
}

.name-save-btn, .name-cancel-btn {
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.name-save-btn {
  background: var(--accent-teal);
  color: #062720;
}

.name-save-btn:hover:not(:disabled) { filter: brightness(1.15); }
.name-save-btn:disabled { opacity: 0.5; cursor: default; }

.name-cancel-btn {
  background: var(--bg-card-alt);
  color: var(--text-secondary);
}

.name-cancel-btn:hover { color: var(--accent-red); border-color: var(--accent-red); }

.name-error {
  margin: 0 0 0.3rem;
  color: var(--accent-red);
  font-size: 0.8rem;
}

.user-details p {
  color: var(--text-secondary);
  margin: 0.25rem 0 0.75rem;
}

.team-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  letter-spacing: 0.05em;
}

.team-tag.red {
  background: var(--accent-red-glow);
  color: var(--accent-red);
  border: 1px solid var(--accent-red);
}

.team-tag.blue {
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
  border: 1px solid var(--accent-teal);
}

.team-btn {
  padding: 0.4rem 0.8rem;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.team-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.red-btn {
  background: var(--accent-red-glow);
  color: var(--accent-red);
  border-color: var(--accent-red);
}
.red-btn:not(:disabled):hover {
  filter: brightness(1.2);
}

.blue-btn {
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
  border-color: var(--accent-teal);
}
.blue-btn:not(:disabled):hover {
  filter: brightness(1.2);
}

.stats-grid-large {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-box {
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.achievements-section h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.achievement-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.achievement-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 1.25rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.achievement-item.locked {
  opacity: 0.5;
  filter: grayscale(1);
}

.achievement-item .icon {
  font-size: 1.5rem;
}

.achievement-item p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* --- Animated flame icon --- */
.flame-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flame-svg {
  width: 2rem;
  height: 2rem;
  animation: flameFlicker 1.2s ease-in-out infinite;
  filter: drop-shadow(0 0 5px currentColor);
}

@keyframes flameFlicker {
  0%, 100% { transform: scaleY(1) scaleX(1) rotate(-2deg); }
  20%       { transform: scaleY(1.15) scaleX(0.95) rotate(2deg); }
  40%       { transform: scaleY(0.95) scaleX(1.05) rotate(-3deg); }
  60%       { transform: scaleY(1.2) scaleX(0.92) rotate(3deg); }
  80%       { transform: scaleY(1.05) scaleX(1) rotate(-1deg); }
}

/* Blue team streak */
.streak-box.streak-blue .flame-svg { color: #3b82f6; }
.streak-box.streak-blue .stat-value { color: #3b82f6; text-shadow: 0 0 12px rgba(59,130,246,0.6); }
.streak-box.streak-blue .stat-label { color: #3b82f6; }

/* Red team streak */
.streak-box.streak-red .flame-svg  { color: #ef4444; }
.streak-box.streak-red .stat-value { color: #ef4444; text-shadow: 0 0 12px rgba(239,68,68,0.6); }
.streak-box.streak-red .stat-label { color: #ef4444; }

/* Coins box */
.coins-box .stat-icon { font-size: 2rem; }
.coins-box .stat-value { color: #f5b731; }

@media (max-width: 600px) {
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  .stats-grid-large {
    grid-template-columns: 1fr 1fr;
  }
  .achievement-list {
    grid-template-columns: 1fr;
  }
}
</style>
