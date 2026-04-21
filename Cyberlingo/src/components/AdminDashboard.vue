<template>
  <main class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <span class="brand-icon">
          <!-- Gear SVG -->
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
        </span>
        <h2>Admin Panel</h2>
      </div>
      <nav class="admin-nav">
        <!-- Overview -->
        <button class="admin-nav-btn" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </span>
          Übersicht
        </button>
        <!-- Quests -->
        <button class="admin-nav-btn" :class="{ active: activeTab === 'quests' }" @click="activeTab = 'quests'">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </span>
          Quests
        </button>
        <!-- Levels -->
        <button class="admin-nav-btn" :class="{ active: activeTab === 'levels' }" @click="activeTab = 'levels'">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
            </svg>
          </span>
          Levels
        </button>
        <!-- Theme toggle -->
        <button class="admin-nav-btn theme-toggle" @click="$emit('toggle-theme')">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </span>
          Theme wechseln
        </button>
      </nav>
      <div class="sidebar-footer">
        <button class="admin-nav-btn back-btn" @click="$emit('go-back')">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </span>
          Dashboard
        </button>
        <button class="admin-nav-btn logout-btn" @click="handleLogout">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </span>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <section class="admin-main">
      <!-- OVERVIEW TAB -->
      <div v-if="activeTab === 'overview'" class="tab-content">
        <h1 class="page-title">Übersicht</h1>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-number">{{ store.quests.length }}</div>
            <div class="stat-label">Quests</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-number">{{ store.levels.length }}</div>
            <div class="stat-label">Levels</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-number">{{ totalLessons }}</div>
            <div class="stat-label">Lektionen</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-number">{{ activeQuests }}</div>
            <div class="stat-label">Aktive Quests</div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Schnellaktionen</h3>
          <div class="actions-row">
            <button class="action-btn" @click="activeTab = 'quests'; showQuestForm = true; resetQuestForm()">
              + Neue Quest
            </button>
            <button class="action-btn" @click="activeTab = 'levels'; showLevelForm = true; resetLevelForm()">
              + Neues Level
            </button>
            <button class="action-btn danger" @click="confirmReset">
              🔄 Auf Standard zurücksetzen
            </button>
          </div>
        </div>
      </div>

      <!-- QUESTS TAB -->
      <div v-if="activeTab === 'quests'" class="tab-content">
        <div class="tab-header">
          <h1 class="page-title">Quests verwalten</h1>
          <button class="add-btn" @click="showQuestForm = true; resetQuestForm()">
            + Neue Quest
          </button>
        </div>

        <!-- Quest Form Modal -->
        <div v-if="showQuestForm" class="form-overlay" @click.self="showQuestForm = false">
          <div class="form-card">
            <h2>{{ editingQuestId ? 'Quest bearbeiten' : 'Neue Quest erstellen' }}</h2>
            <form @submit.prevent="submitQuest">
              <div class="form-group">
                <label>Titel</label>
                <input v-model="questForm.title" type="text" required placeholder="Quest-Titel..." />
              </div>
              <div class="form-group">
                <label>Beschreibung</label>
                <textarea v-model="questForm.description" required placeholder="Was soll der User tun?"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Icon (Emoji)</label>
                  <div class="emoji-picker">
                    <input v-model="questForm.icon" type="text" maxlength="2" class="emoji-input" />
                    <div class="emoji-options">
                      <button type="button" v-for="e in emojiOptions" :key="e" @click="questForm.icon = e" class="emoji-btn">{{ e }}</button>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>XP-Belohnung</label>
                  <input v-model.number="questForm.xpReward" type="number" required min="1" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Schwierigkeit</label>
                  <select v-model="questForm.difficulty">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Status</label>
                  <label class="toggle-label">
                    <input type="checkbox" v-model="questForm.isActive" class="toggle-input" />
                    <span class="toggle-switch"></span>
                    <span>{{ questForm.isActive ? 'Aktiv' : 'Inaktiv' }}</span>
                  </label>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showQuestForm = false">Abbrechen</button>
                <button type="submit" class="submit-btn">{{ editingQuestId ? 'Speichern' : 'Erstellen' }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Quest Table -->
        <div class="data-table">
          <div class="table-header">
            <span class="col-icon">Icon</span>
            <span class="col-title">Titel</span>
            <span class="col-xp">XP</span>
            <span class="col-diff">Schwierigkeit</span>
            <span class="col-status">Status</span>
            <span class="col-actions">Aktionen</span>
          </div>
          <TransitionGroup name="list" tag="div">
            <div v-for="quest in store.quests" :key="quest.id" class="table-row">
              <span class="col-icon quest-emoji">{{ quest.icon }}</span>
              <span class="col-title">
                <strong>{{ quest.title }}</strong>
                <small>{{ quest.description }}</small>
              </span>
              <span class="col-xp">
                <span class="xp-badge">{{ quest.xpReward }} XP</span>
              </span>
              <span class="col-diff">
                <span class="diff-badge" :class="quest.difficulty">{{ quest.difficulty }}</span>
              </span>
              <span class="col-status">
                <span class="status-dot" :class="{ active: quest.isActive }"></span>
                {{ quest.isActive ? 'Aktiv' : 'Inaktiv' }}
              </span>
              <span class="col-actions">
                <button class="icon-btn edit" @click="editQuest(quest)" title="Bearbeiten">✏️</button>
                <button class="icon-btn delete" @click="confirmDeleteQuest(quest.id)" title="Löschen">🗑️</button>
              </span>
            </div>
          </TransitionGroup>
          <div v-if="store.quests.length === 0" class="empty-state">
            <span>🎯</span>
            <p>Noch keine Quests vorhanden.</p>
          </div>
        </div>
      </div>

      <!-- LEVELS TAB -->
      <div v-if="activeTab === 'levels'" class="tab-content">
        <div class="tab-header">
          <h1 class="page-title">Levels verwalten</h1>
          <button class="add-btn" @click="showLevelForm = true; resetLevelForm()">
            + Neues Level
          </button>
        </div>

        <!-- Level Form Modal -->
        <div v-if="showLevelForm" class="form-overlay" @click.self="showLevelForm = false">
          <div class="form-card">
            <h2>{{ editingLevelId ? 'Level bearbeiten' : 'Neues Level erstellen' }}</h2>
            <form @submit.prevent="submitLevel">
              <div class="form-group">
                <label>Name</label>
                <input v-model="levelForm.name" type="text" required placeholder="Level-Name..." />
              </div>
              <div class="form-group">
                <label>Beschreibung</label>
                <textarea v-model="levelForm.description" required placeholder="Worum geht es in diesem Level?"></textarea>
              </div>
              <div class="form-group">
                <label>Schwierigkeit</label>
                <select v-model="levelForm.difficulty">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showLevelForm = false">Abbrechen</button>
                <button type="submit" class="submit-btn">{{ editingLevelId ? 'Speichern' : 'Erstellen' }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Lesson Form Modal -->
        <div v-if="showLessonForm" class="form-overlay" @click.self="showLessonForm = false">
          <div class="form-card">
            <h2>Neue Lektion hinzufügen</h2>
            <form @submit.prevent="submitLesson">
              <div class="form-group">
                <label>Titel</label>
                <input v-model="lessonForm.title" type="text" required placeholder="Lektions-Titel..." />
              </div>
              <div class="form-group">
                <label>Beschreibung</label>
                <textarea v-model="lessonForm.description" required placeholder="Was wird gelernt?"></textarea>
              </div>
              <div class="form-group">
                <label>XP-Belohnung</label>
                <input v-model.number="lessonForm.xpReward" type="number" required min="1" />
              </div>
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showLessonForm = false">Abbrechen</button>
                <button type="submit" class="submit-btn">Hinzufügen</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Level Cards -->
        <div class="levels-list">
          <TransitionGroup name="list" tag="div">
            <div v-for="level in store.levels" :key="level.id" class="level-card">
              <div class="level-header" @click="toggleLevel(level.id)">
                <div class="level-info">
                  <span class="diff-badge" :class="level.difficulty">{{ level.difficulty }}</span>
                  <h3>{{ level.name }}</h3>
                  <p>{{ level.description }}</p>
                </div>
                <div class="level-meta">
                  <span class="lesson-count">{{ level.lessons.length }} Lektionen</span>
                  <span class="chevron" :class="{ open: expandedLevels.has(level.id) }">▶</span>
                </div>
              </div>

              <div v-if="expandedLevels.has(level.id)" class="level-body">
                <div class="lessons-list">
                  <div v-for="lesson in level.lessons" :key="lesson.id" class="lesson-item">
                    <div class="lesson-info">
                      <strong>{{ lesson.title }}</strong>
                      <small>{{ lesson.description }}</small>
                    </div>
                    <div class="lesson-meta">
                      <span class="xp-badge small">{{ lesson.xpReward }} XP</span>
                      <button class="icon-btn delete small" @click="confirmDeleteLesson(level.id, lesson.id)" title="Löschen">🗑️</button>
                    </div>
                  </div>
                  <div v-if="level.lessons.length === 0" class="empty-lessons">
                    Noch keine Lektionen.
                  </div>
                </div>
                <div class="level-actions">
                  <button class="action-btn small" @click="openLessonForm(level.id)">+ Lektion hinzufügen</button>
                  <button class="icon-btn edit" @click="editLevel(level)" title="Bearbeiten">✏️</button>
                  <button class="icon-btn delete" @click="confirmDeleteLevel(level.id)" title="Löschen">🗑️</button>
                </div>
              </div>
            </div>
          </TransitionGroup>
          <div v-if="store.levels.length === 0" class="empty-state">
            <span>📚</span>
            <p>Noch keine Levels vorhanden.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Delete Confirmation -->
    <div v-if="deleteConfirm.show" class="form-overlay" @click.self="deleteConfirm.show = false">
      <div class="form-card confirm-card">
        <h2>⚠️ Löschen bestätigen</h2>
        <p>{{ deleteConfirm.message }}</p>
        <div class="form-actions">
          <button class="cancel-btn" @click="deleteConfirm.show = false">Abbrechen</button>
          <button class="submit-btn danger" @click="executeDelete">Löschen</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { authStore } from '../authStore.js'
import {
  store,
  addQuest,
  updateQuest,
  deleteQuest,
  addLevel,
  updateLevel,
  deleteLevel,
  addLesson,
  deleteLesson,
  resetToDefaults,
} from '../dataStore.js'

defineEmits(['go-back', 'toggle-theme', 'logout'])

async function handleLogout() {
  await authStore.signOut()
}

const activeTab = ref('overview')

// --- Computed stats ---
const totalLessons = computed(() => store.levels.reduce((sum, l) => sum + l.lessons.length, 0))
const activeQuests = computed(() => store.quests.filter((q) => q.isActive).length)

// --- Quest Form ---
const showQuestForm = ref(false)
const editingQuestId = ref(null)
const questForm = reactive({
  title: '',
  description: '',
  icon: '🎯',
  xpReward: 50,
  difficulty: 'beginner',
  isActive: true,
})

const emojiOptions = ['🎯', '📖', '🏆', '🔥', '🛡️', '⚔️', '🔓', '🧠', '💻', '🌐', '🔑', '🚀']

function resetQuestForm() {
  editingQuestId.value = null
  questForm.title = ''
  questForm.description = ''
  questForm.icon = '🎯'
  questForm.xpReward = 50
  questForm.difficulty = 'beginner'
  questForm.isActive = true
}

function editQuest(quest) {
  editingQuestId.value = quest.id
  questForm.title = quest.title
  questForm.description = quest.description
  questForm.icon = quest.icon
  questForm.xpReward = quest.xpReward
  questForm.difficulty = quest.difficulty
  questForm.isActive = quest.isActive
  showQuestForm.value = true
}

function submitQuest() {
  if (editingQuestId.value) {
    updateQuest(editingQuestId.value, { ...questForm })
  } else {
    addQuest({ ...questForm })
  }
  showQuestForm.value = false
  resetQuestForm()
}

// --- Level Form ---
const showLevelForm = ref(false)
const editingLevelId = ref(null)
const levelForm = reactive({
  name: '',
  description: '',
  difficulty: 'beginner',
})

function resetLevelForm() {
  editingLevelId.value = null
  levelForm.name = ''
  levelForm.description = ''
  levelForm.difficulty = 'beginner'
}

function editLevel(level) {
  editingLevelId.value = level.id
  levelForm.name = level.name
  levelForm.description = level.description
  levelForm.difficulty = level.difficulty
  showLevelForm.value = true
}

function submitLevel() {
  if (editingLevelId.value) {
    updateLevel(editingLevelId.value, { ...levelForm })
  } else {
    addLevel({ ...levelForm })
  }
  showLevelForm.value = false
  resetLevelForm()
}

// --- Lesson Form ---
const showLessonForm = ref(false)
const lessonLevelId = ref(null)
const lessonForm = reactive({
  title: '',
  description: '',
  xpReward: 25,
})

function openLessonForm(levelId) {
  lessonLevelId.value = levelId
  lessonForm.title = ''
  lessonForm.description = ''
  lessonForm.xpReward = 25
  showLessonForm.value = true
}

function submitLesson() {
  addLesson(lessonLevelId.value, { ...lessonForm })
  showLessonForm.value = false
}

// --- Expand/Collapse Levels ---
const expandedLevels = reactive(new Set())

function toggleLevel(id) {
  if (expandedLevels.has(id)) {
    expandedLevels.delete(id)
  } else {
    expandedLevels.add(id)
  }
}

// --- Delete Confirmation ---
const deleteConfirm = reactive({
  show: false,
  message: '',
  action: null,
})

function confirmDeleteQuest(id) {
  const quest = store.quests.find((q) => q.id === id)
  deleteConfirm.message = `Quest "${quest?.title}" wirklich löschen?`
  deleteConfirm.action = () => deleteQuest(id)
  deleteConfirm.show = true
}

function confirmDeleteLevel(id) {
  const level = store.levels.find((l) => l.id === id)
  deleteConfirm.message = `Level "${level?.name}" und alle zugehörigen Lektionen wirklich löschen?`
  deleteConfirm.action = () => deleteLevel(id)
  deleteConfirm.show = true
}

function confirmDeleteLesson(levelId, lessonId) {
  const level = store.levels.find((l) => l.id === levelId)
  const lesson = level?.lessons.find((ls) => ls.id === lessonId)
  deleteConfirm.message = `Lektion "${lesson?.title}" wirklich löschen?`
  deleteConfirm.action = () => deleteLesson(levelId, lessonId)
  deleteConfirm.show = true
}

function confirmReset() {
  deleteConfirm.message = 'Alle Daten auf die Standardwerte zurücksetzen? Alle Änderungen gehen verloren!'
  deleteConfirm.action = () => resetToDefaults()
  deleteConfirm.show = true
}

function executeDelete() {
  if (deleteConfirm.action) deleteConfirm.action()
  deleteConfirm.show = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Space+Grotesk:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');

.admin-dashboard {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: 'Work Sans', sans-serif;
  transition: background 0.3s ease, color 0.3s ease;
}

/* --- Sidebar --- */
.admin-sidebar {
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}


.admin-brand h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.admin-nav-btn {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.admin-nav-btn:hover {
  background: var(--nav-btn-hover);
  color: var(--text-primary);
  border-color: var(--border-color);
  transform: translateX(4px);
}

.admin-nav-btn.active {
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
  border-color: var(--accent-teal);
  box-shadow: 0 0 20px var(--accent-teal-glow);
}

.nav-icon {
  font-size: 1.2rem;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon svg {
  width: 22px;
  height: 22px;
  color: currentColor;
}

.brand-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-teal);
}

.brand-icon svg {
  width: 28px;
  height: 28px;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.back-btn, .logout-btn {
  color: var(--text-secondary);
  border-radius: 12px;
}

.back-btn:hover {
  color: var(--accent-teal);
  background: var(--accent-teal-glow);
  border-color: var(--accent-teal);
}

.logout-btn:hover {
  color: var(--accent-red);
  background: var(--accent-red-glow);
  border-color: var(--accent-red);
}

/* --- Main Content --- */
.admin-main {
  padding: 2.5rem 3rem;
  overflow-y: auto;
  max-height: 100vh;
}

.page-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  margin: 0 0 2rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tab-header .page-title {
  margin: 0;
}

/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-teal);
  box-shadow: 0 12px 32px var(--card-shadow);
}

.stat-icon {
  font-size: 2rem;
}

.stat-number {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-teal);
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

/* --- Quick Actions --- */
.quick-actions h3 {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text-primary);
  font-size: 1.1rem;
  margin: 0 0 1rem;
}

.actions-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.7rem 1.4rem;
  background: var(--accent-teal-glow);
  border: 1px solid var(--accent-teal);
  border-radius: 12px;
  color: var(--accent-teal);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.action-btn:hover {
  background: var(--accent-teal);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--accent-teal-glow);
}

.action-btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.82rem;
}

.action-btn.danger {
  background: var(--accent-red-glow);
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.action-btn.danger:hover {
  background: var(--accent-red);
  color: white;
  box-shadow: 0 6px 16px var(--accent-red-glow);
}

/* --- Add Button --- */
.add-btn {
  padding: 0.7rem 1.5rem;
  background: var(--accent-teal);
  border: 1px solid var(--accent-teal);
  border-radius: 12px;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(28, 184, 160, 0.2);
}

.add-btn:hover {
  filter: brightness(1.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-teal-glow);
}

/* --- Form Overlay --- */
.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 24px 64px var(--card-shadow);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.form-card h2 {
  font-family: 'Space Grotesk', sans-serif;
  margin: 0 0 1.5rem;
  color: var(--text-primary);
  font-size: 1.4rem;
}

.confirm-card {
  max-width: 420px;
  text-align: center;
}

.confirm-card p {
  color: var(--text-secondary);
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238ea8cc' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-teal);
  box-shadow: 0 0 0 3px var(--accent-teal-glow);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* --- Emoji Picker --- */
.emoji-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.emoji-input {
  font-size: 1.8rem;
  text-align: center;
  width: 64px !important;
  height: 52px;
  padding: 0.4rem !important;
}

.emoji-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.emoji-btn {
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  border-color: var(--accent-teal);
  background: var(--accent-teal-glow);
  transform: scale(1.15);
}

/* --- Toggle Switch --- */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-primary);
  margin-top: 0.5rem;
}

.toggle-input {
  display: none;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: var(--border-color);
  border-radius: 12px;
  position: relative;
  transition: background 0.25s ease;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: var(--text-secondary);
  border-radius: 50%;
  transition: all 0.25s ease;
}

.toggle-input:checked + .toggle-switch {
  background: var(--accent-teal);
}

.toggle-input:checked + .toggle-switch::after {
  left: 23px;
  background: #fff;
}

/* --- Buttons --- */
.cancel-btn {
  padding: 0.7rem 1.25rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: var(--nav-btn-hover);
  color: var(--text-primary);
}

.submit-btn {
  padding: 0.7rem 1.5rem;
  background: var(--accent-teal);
  border: 1px solid var(--accent-teal);
  border-radius: 10px;
  color: white;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.submit-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-teal-glow);
}

.submit-btn.danger {
  background: linear-gradient(135deg, #e2586e, #c73d52);
  border-color: #e2586e;
  color: #fff;
}

.submit-btn.danger:hover {
  box-shadow: 0 4px 12px var(--accent-red-glow);
}

.icon-btn {
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-btn.edit:hover {
  background: rgba(31, 179, 156, 0.12);
  border-color: rgba(31, 179, 156, 0.3);
}

.icon-btn.delete:hover {
  background: rgba(226, 88, 110, 0.12);
  border-color: rgba(226, 88, 110, 0.3);
}

.icon-btn.small {
  width: 30px;
  height: 30px;
  font-size: 0.85rem;
}

/* --- Data Table --- */
.data-table {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 120px 100px 100px;
  padding: 1rem 1.25rem;
  background: var(--bg-card-alt);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 120px 100px 100px;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--accent-teal-glow);
}

.quest-emoji {
  font-size: 1.6rem;
}

.col-title strong {
  display: block;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.col-title small {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.col-actions {
  display: flex;
  gap: 0.35rem;
}

/* --- Badges --- */
.xp-badge {
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.xp-badge.small {
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
}

.diff-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.diff-badge.beginner {
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
}

.diff-badge.intermediate {
  background: rgba(243, 156, 18, 0.15);
  color: #f5b731;
}

.diff-badge.pro {
  background: var(--accent-red-glow);
  color: var(--accent-red);
}

/* --- Status Dot --- */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
  margin-right: 0.4rem;
}

.status-dot.active {
  background: var(--accent-teal);
  box-shadow: 0 0 8px var(--accent-teal-glow);
}

.col-status {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

/* --- Levels --- */
.levels-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.level-card {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.level-card:hover {
  border-color: var(--accent-teal);
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: var(--bg-card);
  cursor: pointer;
  transition: background 0.2s ease;
}

.level-header:hover {
  background: var(--bg-card-alt);
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.level-info h3 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  color: var(--text-primary);
}

.level-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.level-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lesson-count {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.chevron {
  font-size: 0.7rem;
  color: var(--text-secondary);
  transition: transform 0.25s ease;
}

.chevron.open {
  transform: rotate(90deg);
}

.level-body {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-main);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 600px; }
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: background 0.15s ease;
}

.lesson-item:hover {
  background: var(--bg-card-alt);
}

.lesson-info strong {
  display: block;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.lesson-info small {
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.empty-lessons {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
  padding: 1rem;
}

.level-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

/* --- Empty State --- */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state span {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.75rem;
}

.empty-state p {
  font-size: 1rem;
}

/* --- List Transitions --- */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

/* --- Responsive --- */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns: 50px 1fr 80px 100px 90px 80px;
    font-size: 0.8rem;
  }
}

@media (max-width: 900px) {
  .admin-dashboard {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    position: static;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .admin-brand {
    border-bottom: none;
    padding-bottom: 0;
  }

  .admin-nav {
    flex-direction: row;
    flex: 1;
  }

  .back-btn {
    margin-top: 0;
    border-top: none;
    padding-top: 0;
  }

  .admin-main {
    padding: 1.5rem;
    max-height: none;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .table-header { display: none; }

  .table-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem;
  }

  .col-title {
    flex: 1;
    min-width: 150px;
  }
}
</style>
