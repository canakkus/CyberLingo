import { reactive, watch, computed } from 'vue'
import { authStore } from './authStore'

const STORAGE_KEY = 'cyberlingo-data'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to load from localStorage:', e)
  }
  return null
}

const defaultData = {
  quests: [
    {
      id: 1,
      title: 'Erstes Login',
      description: 'Melde dich zum ersten Mal an.',
      icon: '🎯',
      xpReward: 50,
      difficulty: 'beginner',
      isActive: true,
      completed: true,  // Auto-completed: user is logged in
      claimed: false,
    },
    {
      id: 2,
      title: 'Absolviere 1 Lektion',
      description: 'Schließe deine erste Lektion ab.',
      icon: '📖',
      xpReward: 100,
      difficulty: 'beginner',
      isActive: true,
      completed: false,
      claimed: false,
    },
    {
      id: 3,
      title: '5 Lektionen abgeschlossen',
      description: 'Absolviere insgesamt 5 Lektionen.',
      icon: '🏆',
      xpReward: 250,
      difficulty: 'intermediate',
      isActive: true,
      completed: false,
      claimed: false,
    },
    {
      id: 4,
      title: '7-Tage Streak',
      description: 'Lerne 7 Tage hintereinander.',
      icon: '🔥',
      xpReward: 500,
      difficulty: 'pro',
      isActive: true,
      completed: false,
      claimed: false,
    },
  ],
  levels: [
    {
      id: 1,
      name: 'Netzwerk-Grundlagen',
      difficulty: 'beginner',
      description: 'Lerne die Basics über Netzwerke und Protokolle.',
      lessons: [
        { id: 1, title: 'Was ist ein Netzwerk?', description: 'Grundlagen der Netzwerktechnik.', xpReward: 25 },
        { id: 2, title: 'TCP/IP Modell', description: 'Die Schichten des TCP/IP Modells.', xpReward: 30 },
        { id: 3, title: 'DNS verstehen', description: 'Wie funktioniert das Domain Name System?', xpReward: 30 },
      ],
    },
    {
      id: 2,
      name: 'Passwort-Sicherheit',
      difficulty: 'beginner',
      description: 'Verstehe warum starke Passwörter wichtig sind.',
      lessons: [
        { id: 4, title: 'Sichere Passwörter', description: 'Was macht ein Passwort sicher?', xpReward: 25 },
        { id: 5, title: 'Hashing & Salting', description: 'Wie werden Passwörter gespeichert?', xpReward: 35 },
      ],
    },
    {
      id: 3,
      name: 'Phishing erkennen',
      difficulty: 'intermediate',
      description: 'Lerne Phishing-Angriffe zu identifizieren.',
      lessons: [
        { id: 6, title: 'Phishing-Mails', description: 'Typische Merkmale erkennen.', xpReward: 40 },
        { id: 7, title: 'Social Engineering', description: 'Psychologische Tricks der Angreifer.', xpReward: 45 },
      ],
    },
  ],
  nextQuestId: 5,
  nextLevelId: 4,
  nextLessonId: 8,
}

// Quests and Levels stay in localStorage (admin-managed content)
const saved = loadFromStorage()
export const store = reactive(saved || JSON.parse(JSON.stringify(defaultData)))

// Migrate: fill in missing completed/claimed fields from old localStorage data
store.quests = store.quests.map(q => {
  const def = defaultData.quests.find(d => d.id === q.id)
  return {
    ...q,
  }
})

export const dynamicQuests = computed(() => {
  return store.quests.map(q => {
    let completed = false
    const stats = authStore.userStats

    if (q.id === 1) { // 1st Login
      completed = !!authStore.user
    } else if (q.id === 2) { // 1 Lektion
      let topicCount = 0
      Object.values(stats.lesson_progress || {}).forEach(teamLvl => {
        Object.values(teamLvl || {}).forEach(prog => {
          if (prog.topicQuizDone) {
            topicCount += prog.topicQuizDone.filter(Boolean).length
          }
        })
      })
      completed = topicCount >= 1
    } else if (q.id === 3) { // 5 Lektionen
      let topicCount = 0
      Object.values(stats.lesson_progress || {}).forEach(teamLvl => {
        Object.values(teamLvl || {}).forEach(prog => {
          if (prog.topicQuizDone) {
            topicCount += prog.topicQuizDone.filter(Boolean).length
          }
        })
      })
      completed = topicCount >= 5
    } else if (q.id === 4) { // 7-day streak
      completed = stats.streak >= 7
    } else {
      // Fallback for custom admin quests (just use whatever is in store)
      completed = q.completed
    }

    const claimed = stats.claimed_quests?.includes(q.id) || false
    return { ...q, completed, claimed }
  })
})

// Persist quests/levels to localStorage
watch(
  () => JSON.stringify({ quests: store.quests, levels: store.levels, nextQuestId: store.nextQuestId, nextLevelId: store.nextLevelId, nextLessonId: store.nextLessonId }),
  (json) => {
    try {
      localStorage.setItem(STORAGE_KEY, json)
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
    }
  },
)

// --- Quest CRUD ---
export function addQuest(quest) {
  store.quests.push({
    ...quest,
    id: store.nextQuestId++,
  })
}

export function updateQuest(id, updates) {
  const idx = store.quests.findIndex((q) => q.id === id)
  if (idx !== -1) {
    store.quests[idx] = { ...store.quests[idx], ...updates }
  }
}

export function deleteQuest(id) {
  store.quests = store.quests.filter((q) => q.id !== id)
}

// --- Level CRUD ---
export function addLevel(level) {
  store.levels.push({
    ...level,
    id: store.nextLevelId++,
    lessons: level.lessons || [],
  })
}

export function updateLevel(id, updates) {
  const idx = store.levels.findIndex((l) => l.id === id)
  if (idx !== -1) {
    const existing = store.levels[idx]
    store.levels[idx] = { ...existing, ...updates, lessons: updates.lessons || existing.lessons }
  }
}

export function deleteLevel(id) {
  store.levels = store.levels.filter((l) => l.id !== id)
}

// --- Lesson CRUD ---
export function addLesson(levelId, lesson) {
  const level = store.levels.find((l) => l.id === levelId)
  if (level) {
    level.lessons.push({
      ...lesson,
      id: store.nextLessonId++,
    })
  }
}

export function deleteLesson(levelId, lessonId) {
  const level = store.levels.find((l) => l.id === levelId)
  if (level) {
    level.lessons = level.lessons.filter((ls) => ls.id !== lessonId)
  }
}

// --- Reset to defaults ---
export function resetToDefaults() {
  Object.assign(store, JSON.parse(JSON.stringify(defaultData)))
}
