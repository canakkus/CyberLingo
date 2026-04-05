<template>
  <main class="quests-page">
    <!-- XP Popup Animation -->
    <Transition name="xp-pop">
      <div v-if="xpPopup.visible" class="xp-popup" :style="{ top: xpPopup.y + 'px', left: xpPopup.x + 'px' }">
        +{{ xpPopup.amount }} XP ⚡
      </div>
    </Transition>

    <div class="quests-container">
      <header class="quests-header">
        <button class="back-btn" @click="$emit('go-back')">← Zurück</button>
        <div class="header-info">
          <h1>Missionen & Quests</h1>
          <div class="total-xp-badge">
            <span class="xp-icon">⚡</span>
            <span>{{ authStore.userStats.xp }} XP</span>
          </div>
        </div>
      </header>

      <div class="quest-tabs">
        <button class="quest-tab" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
          Alle Quests
        </button>
        <button class="quest-tab" :class="{ active: activeFilter === 'active' }" @click="activeFilter = 'active'">
          Aktiv
        </button>
        <button class="quest-tab" :class="{ active: activeFilter === 'done' }" @click="activeFilter = 'done'">
          Abgeschlossen
        </button>
      </div>

      <div class="quest-grid-large">
        <div
          v-for="quest in filteredQuests"
          :key="quest.id"
          class="quest-card-large"
          :class="{
            inactive: !quest.isActive,
            completed: quest.completed,
            claimed: quest.claimed,
            claiming: claimingId === quest.id
          }"
        >
          <div class="quest-icon-main">{{ quest.icon }}</div>

          <div class="quest-main-info">
            <div class="quest-top-row">
              <h3>{{ quest.title }}</h3>
              <span class="difficulty-tag" :class="quest.difficulty">{{ quest.difficulty }}</span>
            </div>
            <p class="quest-desc">{{ quest.description }}</p>

            <div class="quest-progress-footer">
              <div class="progress-bar-container">
                <div
                  class="progress-fill"
                  :class="{ 'fill-complete': quest.completed }"
                  :style="{ width: progressWidth(quest) }"
                ></div>
              </div>
              <div class="quest-meta">
                <span class="xp-gain">+{{ quest.xpReward }} XP</span>
                <div class="quest-actions">
                  <!-- Not started -->
                  <span v-if="!quest.isActive && !quest.completed && !quest.claimed" class="quest-status locked-text">🔒 Gesperrt</span>
                  <!-- Active but not claimable -->
                  <span v-else-if="quest.isActive && !quest.completed" class="quest-status">In Arbeit</span>
                  <!-- Completed, ready to claim -->
                  <button
                    v-else-if="quest.completed && !quest.claimed"
                    class="claim-btn"
                    :disabled="claimingId === quest.id"
                    @click="claimXP(quest, $event)"
                  >
                    <span v-if="claimingId === quest.id" class="spinner"></span>
                    <span v-else>⚡ XP abholen</span>
                  </button>
                  <!-- Already claimed -->
                  <span v-else-if="quest.claimed" class="quest-status claimed-text">✅ Abgeholt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { dynamicQuests } from '../dataStore'
import { authStore } from '../authStore'

defineEmits(['go-back'])

const activeFilter = ref('all')
const claimingId = ref(null)
const xpPopup = ref({ visible: false, amount: 0, x: 0, y: 0 })

const filteredQuests = computed(() => {
  if (activeFilter.value === 'all') return dynamicQuests.value
  if (activeFilter.value === 'active') return dynamicQuests.value.filter(q => q.isActive && !q.claimed)
  return dynamicQuests.value.filter(q => q.claimed)
})

function progressWidth(quest) {
  if (quest.claimed || quest.completed) return '100%'
  if (!quest.isActive) return '0%'
  return '40%' // In-progress visual
}

async function claimXP(quest, event) {
  if (claimingId.value) return
  claimingId.value = quest.id

  try {
    // Get click position for the popup
    const rect = event.currentTarget.getBoundingClientRect()
    xpPopup.value = {
      visible: false,
      amount: quest.xpReward,
      x: rect.left + rect.width / 2,
      y: rect.top - 20
    }

    // Short delay for claiming animation
    await new Promise(r => setTimeout(r, 400))

    // Award XP and register claim in Supabase
    await authStore.claimQuest(quest.id, quest.xpReward)

    // Show XP popup
    xpPopup.value.visible = true
  } catch (err) {
    console.error('Quest claim failed:', err)
  } finally {
    claimingId.value = null
  }

  // Hide popup after animation
  setTimeout(() => {
    xpPopup.value.visible = false
  }, 1800)
}
</script>

<style scoped>
.quests-page {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: var(--bg-main);
  position: relative;
  overflow: hidden;
}

.quests-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.quests-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  margin: 0;
  color: var(--text-primary);
}

.total-xp-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--accent-teal-glow);
  border: 1px solid var(--accent-teal);
  color: var(--accent-teal);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.4rem 0.9rem;
  border-radius: 99px;
}

.xp-icon { font-size: 1.1rem; }

.back-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.back-btn:hover {
  background: var(--bg-card-alt);
  color: var(--text-primary);
  border-color: var(--accent-teal);
}

/* Tabs */
.quest-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.quest-tab {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.quest-tab:hover { color: var(--text-primary); }
.quest-tab.active {
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
  font-weight: 700;
}

/* Quest Grid */
.quest-grid-large { display: grid; gap: 1.25rem; }

.quest-card-large {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.quest-card-large:hover {
  transform: translateX(6px);
  border-color: var(--accent-teal);
}

.quest-card-large.inactive {
  opacity: 0.5;
  pointer-events: none;
}

.quest-card-large.claimed {
  border-color: var(--accent-teal);
  background: var(--accent-teal-glow);
}

.quest-card-large.claiming {
  transform: scale(1.01);
  box-shadow: 0 0 30px var(--accent-teal-glow);
}

.quest-icon-main {
  font-size: 3rem;
  background: var(--bg-card-alt);
  min-width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.quest-card-large.claiming .quest-icon-main {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  60% { transform: rotate(-5deg); }
  80% { transform: rotate(5deg); }
}

.quest-main-info { flex: 1; }

.quest-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.quest-top-row h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.difficulty-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.difficulty-tag.beginner { background: var(--accent-teal-glow); color: var(--accent-teal); }
.difficulty-tag.intermediate { background: rgba(243,156,18,0.15); color: #f39c12; }
.difficulty-tag.pro { background: var(--accent-red-glow); color: var(--accent-red); }

.quest-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

/* Progress */
.progress-bar-container {
  height: 6px;
  background: var(--bg-card-alt);
  border-radius: 4px;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-teal);
  border-radius: 4px;
  box-shadow: 0 0 8px var(--accent-teal-glow);
  transition: width 0.6s ease;
}

.progress-fill.fill-complete {
  background: linear-gradient(90deg, var(--accent-teal), #67d2bc);
  box-shadow: 0 0 16px var(--accent-teal-glow);
}

.quest-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.xp-gain {
  color: var(--accent-teal);
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.quest-actions { display: flex; align-items: center; gap: 0.5rem; }

.quest-status {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.locked-text { color: var(--text-secondary); opacity: 0.6; }
.claimed-text { color: var(--accent-teal); font-weight: 600; }

/* Claim Button */
.claim-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--accent-teal), #0ea58e);
  color: #062720;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 14px var(--accent-teal-glow);
}

.claim-btn:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 8px 24px var(--accent-teal-glow);
}

.claim-btn:active {
  transform: scale(0.97);
}

.claim-btn:disabled {
  opacity: 0.7;
  cursor: default;
  transform: none;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(6,39,32,0.3);
  border-top-color: #062720;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* XP Popup */
.xp-popup {
  position: fixed;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, var(--accent-teal), #0ea58e);
  color: #062720;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 900;
  font-size: 1.5rem;
  padding: 0.5rem 1.4rem;
  border-radius: 50px;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 8px 30px var(--accent-teal-glow), 0 0 0 2px var(--accent-teal);
  white-space: nowrap;
}

/* XP popup transition */
.xp-pop-enter-active {
  animation: xpFloat 1.8s ease forwards;
}

@keyframes xpFloat {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  15%  { opacity: 1; transform: translate(-50%, -80%) scale(1.2); }
  30%  { transform: translate(-50%, -90%) scale(1); }
  70%  { opacity: 1; transform: translate(-50%, -160%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -200%) scale(0.9); }
}

@media (max-width: 700px) {
  .quest-card-large {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
    gap: 1rem;
  }

  .quest-top-row {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .header-info { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
}
</style>
