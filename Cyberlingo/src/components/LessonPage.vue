<template>
  <main class="lesson-page">
    <div class="lesson-container">
      <header class="lesson-header">
        <button class="back-btn" @click="$emit('go-back')">← Zurück</button>
        <h1>{{ lessonDataTitle }}</h1>
        <span class="level-badge">{{ levelBadgeText }}</span>
      </header>

      <!-- 3-column Topics Row -->
      <div class="topics-row">
        <div
          v-for="(topic, ti) in topics"
          :key="ti"
          class="topic-col"
          :class="{ locked: !isTopicUnlocked(ti) }"
        >
          <!-- Topic Card -->
          <div class="topic-card" :class="{ done: topicQuizDone[ti], locked: !isTopicUnlocked(ti) }">
            <div class="topic-header" @click="toggleTopic(ti)">
              <div class="topic-icon">{{ topic.icon }}</div>
              <div class="topic-info">
                <h3>{{ topic.title }}</h3>
                <p v-if="!isTopicUnlocked(ti)">🔒 Erst vorheriges Quiz abschließen</p>
                <p v-else-if="topicQuizDone[ti]" class="done-text">✅ Quiz abgeschlossen!</p>
                <p v-else>{{ topic.sections.length }} Abschnitte durchlesen</p>
              </div>
              <div v-if="isTopicUnlocked(ti)" class="topic-arrow" :class="{ open: expandedTopic === ti }">▼</div>
              <div v-else class="lock-tag">🔒</div>
            </div>

            <Transition name="slide">
              <div v-if="expandedTopic === ti && isTopicUnlocked(ti)" class="topic-content">
                <div
                  v-for="(sec, si) in topic.sections"
                  :key="si"
                  class="theory-section"
                  :class="{ active: currentStep[ti] === si, done: si < currentStep[ti] }"
                >
                  <div class="section-header" @click="currentStep[ti] = si">
                    <span class="step-num" :class="{ completed: si < currentStep[ti] }">
                      {{ si < currentStep[ti] ? '✓' : si + 1 }}
                    </span>
                    <h4>{{ sec.title }}</h4>
                  </div>
                  <div v-if="currentStep[ti] === si" class="section-body">
                    <div v-html="sec.content"></div>
                    <div class="section-nav">
                      <button v-if="si > 0" class="nav-btn-small" @click="currentStep[ti] = si - 1">← Zurück</button>
                      <button v-if="si < topic.sections.length - 1" class="nav-btn-small primary" @click="currentStep[ti] = si + 1">Weiter →</button>
                      <button v-else class="nav-btn-small primary finish" @click="markTopicRead(ti)">🎉 Theorie abschließen</button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Connector down to quiz circle -->
          <div class="col-connector">
            <div class="col-line" :class="{ active: topicReadDone[ti] }"></div>
          </div>

          <!-- Quiz circle node -->
          <div
            class="quiz-circle"
            :class="{ unlocked: topicReadDone[ti], done: topicQuizDone[ti], locked: !topicReadDone[ti] }"
            @click="openTopicQuiz(ti)"
          >
            <span class="quiz-circle-icon">{{ topicQuizDone[ti] ? '✅' : '⭐' }}</span>
            <span class="quiz-circle-label">Quiz {{ ti + 1 }}</span>
            <span v-if="!topicReadDone[ti]" class="quiz-lock">🔒</span>
          </div>

          <!-- Connector down to merge lines area -->
          <div class="col-connector">
            <div class="col-line" :class="{ active: topicQuizDone[ti] }"></div>
          </div>
        </div>
      </div>

      <!-- SVG connecting lines to final quiz -->
      <div class="merge-zone">
        <svg class="merge-svg" viewBox="0 0 900 120" preserveAspectRatio="none">
          <!-- Left line (Topic 1) -->
          <line x1="150" y1="0" x2="450" y2="120"
            :class="{ 'line-active': topicQuizDone[0] }" />
          <!-- Middle line (Topic 2) -->
          <line x1="450" y1="0" x2="450" y2="120"
            :class="{ 'line-active': topicQuizDone[1] }" />
          <!-- Right line (Topic 3) -->
          <line x1="750" y1="0" x2="450" y2="120"
            :class="{ 'line-active': topicQuizDone[2] }" />
        </svg>
      </div>

      <!-- Final Quiz Node -->
      <div class="final-quiz-zone">
        <div
          class="final-star"
          :class="{ locked: !finalUnlocked, unlocking: finalUnlockAnim, unlocked: finalUnlocked }"
          @click="openFinalQuiz"
        >
          <div class="final-star-icon">🏆</div>
          <span class="final-star-label">Final Quiz</span>
          <span v-if="!finalUnlocked" class="final-lock">🔒</span>
        </div>
        <p v-if="!finalUnlocked" class="final-hint">Schließe alle 3 Quizze ab, um das Final Quiz freizuschalten</p>
        <p v-else-if="finalQuizDone" class="final-hint done-text">🎉 Alle Inhalte abgeschlossen!</p>
      </div>
    </div>

    <!-- Quiz Modal -->
    <Transition name="quiz-appear">
      <div v-if="activeQuiz !== null" class="quiz-overlay" @click.self="activeQuiz = null">
        <div class="quiz-modal">
          <div class="quiz-header">
            <h2>📝 {{ activeQuizTitle }}</h2>
            <button class="close-btn" @click="activeQuiz = null">✕</button>
          </div>

          <div v-if="!quizCompleted" class="quiz-body">
            <div class="quiz-progress">
              <span>Frage {{ currentQ + 1 }} / {{ activeQuestions.length }}</span>
              <div class="progress-bar-container">
                <div class="progress-fill" :style="{ width: (currentQ / activeQuestions.length * 100) + '%' }"></div>
              </div>
            </div>

            <!-- MC Question -->
            <div v-if="activeQuestions[currentQ]?.type !== 'open'" class="question-card">
              <h3>{{ activeQuestions[currentQ].question }}</h3>
              <div class="options">
                <button
                  v-for="(opt, oIndex) in activeQuestions[currentQ].options"
                  :key="oIndex"
                  class="option-btn"
                  :class="{
                    selected: selectedAns === oIndex,
                    correct: answered && oIndex === activeQuestions[currentQ].correctIndex,
                    wrong: answered && selectedAns === oIndex && oIndex !== activeQuestions[currentQ].correctIndex
                  }"
                  :disabled="answered"
                  @click="selectAnswer(oIndex)"
                >
                  <span class="opt-key">{{ String.fromCharCode(65 + oIndex) }}</span>
                  <span class="opt-text">{{ opt }}</span>
                </button>
              </div>
              <Transition name="fade">
                <div v-if="answered" class="explanation">
                  <p :class="selectedAns === activeQuestions[currentQ].correctIndex ? 'correct-text' : 'wrong-text'">
                    {{ selectedAns === activeQuestions[currentQ].correctIndex ? '✅ Richtig!' : '❌ Falsch!' }}
                  </p>
                  <p v-if="activeQuestions[currentQ].explanation" class="expl-text">{{ activeQuestions[currentQ].explanation }}</p>
                  <button class="nav-btn-small primary" @click="nextQ">Weiter →</button>
                </div>
              </Transition>
            </div>

            <!-- Open Question -->
            <div v-else class="question-card open-question">
              <h3>{{ activeQuestions[currentQ].question }}</h3>
              <textarea v-model="openAnswers[currentQ]" class="open-answer-input" rows="4" placeholder="Deine Antwort..."></textarea>
              <div class="open-hint">
                <details>
                  <summary>💡 Beispiel-Antwort zeigen</summary>
                  <p>{{ activeQuestions[currentQ].expected || activeQuestions[currentQ].hint }}</p>
                </details>
              </div>
              <button class="nav-btn-small primary" @click="nextQ">
                {{ currentQ < activeQuestions.length - 1 ? 'Weiter →' : '🎉 Quiz abschließen' }}
              </button>
            </div>
          </div>

          <!-- Quiz Complete -->
          <div v-else class="quiz-complete">
            <div class="complete-icon">🏆</div>
            <h3>Quiz abgeschlossen!</h3>
            <p class="score-text">{{ correctCount }} / {{ activeQuestions.filter(q => q.type !== 'open').length }} MC-Fragen richtig</p>
            <p class="xp-reward-text">+{{ activeQuiz === 'final' ? 300 : 100 }} XP verdient! ⚡</p>
            <button class="nav-btn-small primary" @click="claimXP">XP abholen</button>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { authStore } from '../authStore.js'
import { lessonsData } from '../data/lessonData.js'

const props = defineProps({
  level: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['go-back'])

const currentTeam = computed(() => authStore.profile.team || 'blue')
const lessonDataObj = computed(() => {
  if (!lessonsData[currentTeam.value]) return lessonsData.blue.beginner
  return lessonsData[currentTeam.value][props.level] || lessonsData.blue.beginner
})

const lessonDataTitle = computed(() => `🛡️ ${lessonDataObj.value.title}`)
const levelBadgeText = computed(() => props.level.toUpperCase())
const topics = computed(() => lessonDataObj.value.topics)

// --- State ---
const expandedTopic = ref(null)
const currentStep = ref([0, 0, 0])
const topicReadDone = ref([false, false, false])
const topicQuizDone = ref([false, false, false])
const finalQuizDone = ref(false)
const finalUnlockAnim = ref(false)
const activeQuiz = ref(null) // 0,1,2 or 'final'

// Quiz state
const currentQ = ref(0)
const selectedAns = ref(null)
const answered = ref(false)
const correctCount = ref(0)
const quizCompleted = ref(false)
const openAnswers = ref({})

function isTopicUnlocked(ti) {
  if (ti === 0) return true
  return topicQuizDone.value[ti - 1]
}

function toggleTopic(ti) {
  if (!isTopicUnlocked(ti)) return
  expandedTopic.value = expandedTopic.value === ti ? null : ti
}

function markTopicRead(ti) {
  topicReadDone.value[ti] = true
  expandedTopic.value = null
}

function openTopicQuiz(ti) {
  if (!topicReadDone.value[ti]) return
  resetQuiz()
  activeQuiz.value = ti
}

function openFinalQuiz() {
  if (!finalUnlocked.value) return
  resetQuiz()
  activeQuiz.value = 'final'
}

function resetQuiz() {
  currentQ.value = 0
  selectedAns.value = null
  answered.value = false
  correctCount.value = 0
  quizCompleted.value = false
  openAnswers.value = {}
}

function selectAnswer(index) {
  if (answered.value) return
  selectedAns.value = index
  answered.value = true
  if (index === activeQuestions.value[currentQ.value].correctIndex) correctCount.value++
}

function nextQ() {
  if (currentQ.value < activeQuestions.value.length - 1) {
    currentQ.value++
    selectedAns.value = null
    answered.value = false
  } else {
    quizCompleted.value = true
  }
}

async function claimXP() {
  const xpGain = activeQuiz.value === 'final' ? 300 : 100
  const newXp = authStore.userStats.xp + xpGain
  
  let newLevel = authStore.userStats.level
  if (activeQuiz.value === 'final') {
    if (props.level === 'beginner' && newLevel < 2) newLevel = 2
    if (props.level === 'advanced' && newLevel < 3) newLevel = 3
  }
  
  await authStore.saveUserStats({ xp: newXp, level: newLevel, streak: authStore.userStats.streak })
  authStore.userStats.xp = newXp
  authStore.userStats.level = newLevel

  if (activeQuiz.value === 'final') {
    finalQuizDone.value = true
  } else {
    topicQuizDone.value[activeQuiz.value] = true
  }
  activeQuiz.value = null
}

const finalUnlocked = computed(() => topicQuizDone.value.every(Boolean))

watch(finalUnlocked, (val) => {
  if (val) {
    finalUnlockAnim.value = true
    setTimeout(() => { finalUnlockAnim.value = false }, 2000)
  }
})

const activeQuizTitle = computed(() => {
  if (activeQuiz.value === 'final') return `Final Quiz – ${lessonDataObj.value.title}`
  if (activeQuiz.value !== null) return topics.value[activeQuiz.value].title
  return ''
})

const activeQuestions = computed(() => {
  if (activeQuiz.value === 'final') return lessonDataObj.value.finalQuiz
  if (activeQuiz.value !== null) return topics.value[activeQuiz.value].quiz
  return []
})

// Dynamic Data Replaced
</script>

<style scoped>
.lesson-page {
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: var(--bg-main);
}

.lesson-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.lesson-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.lesson-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  margin: 0;
  color: var(--text-primary);
  flex: 1;
}

.level-badge {
  font-family: 'JetBrains Mono', monospace;
  background: var(--accent-teal-glow);
  color: var(--accent-teal);
  border: 1px solid var(--accent-teal);
  padding: 0.3rem 0.8rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
}

.back-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font: inherit;
}
.back-btn:hover { background: var(--bg-card-alt); color: var(--text-primary); border-color: var(--accent-teal); }

/* ---- 3-Column Topics Row ---- */
.topics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.topic-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Topic Card */
.topic-card {
  width: 100%;
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 6px 24px var(--card-shadow);
}

.topic-card.done { border-color: var(--accent-teal); background: var(--accent-teal-glow); }
.topic-card.locked { opacity: 0.5; }

.topic-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}
.topic-header:hover { background: var(--bg-card-alt); }

.topic-icon {
  font-size: 2rem;
  background: var(--bg-card-alt);
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
}

.topic-info { flex: 1; min-width: 0; }
.topic-info h3 { margin: 0; font-size: 1rem; color: var(--text-primary); line-height: 1.3; }
.topic-info p { margin: 0.2rem 0 0; color: var(--text-secondary); font-size: 0.82rem; }
.done-text { color: var(--accent-teal) !important; font-weight: 700; }

.topic-arrow { font-size: 0.9rem; color: var(--text-secondary); transition: transform 0.3s ease; flex-shrink: 0; }
.topic-arrow.open { transform: rotate(180deg); }
.lock-tag { font-size: 1.1rem; flex-shrink: 0; }

/* Topic Content */
.topic-content { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: 0.4rem; }

.theory-section {
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.theory-section.active { border-color: var(--accent-teal); box-shadow: 0 0 16px var(--accent-teal-glow); }
.theory-section.done { opacity: 0.6; }

.section-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; cursor: pointer; transition: background 0.2s;
}
.section-header:hover { background: rgba(255,255,255,0.03); }

.step-num {
  min-width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--bg-card); border: 1.5px solid var(--border-color);
  font-weight: 700; font-size: 0.8rem; color: var(--text-secondary);
  flex-shrink: 0;
}
.step-num.completed { background: var(--accent-teal); color: #062720; border-color: var(--accent-teal); }

.section-header h4 { margin: 0; color: var(--text-primary); font-size: 0.9rem; }

.section-body { padding: 0 1rem 1rem; color: var(--text-secondary); line-height: 1.65; font-size: 0.9rem; }
.section-body :deep(ul) { padding-left: 1.2rem; margin: 0.5rem 0; }
.section-body :deep(li) { margin-bottom: 0.4rem; }
.section-body :deep(strong) { color: var(--text-primary); }
.section-body :deep(p) { margin: 0.5rem 0; }

.tool-box, .htl-box {
  margin-top: 0.75rem; padding: 0.6rem 0.9rem;
  border-radius: 10px; font-size: 0.85rem;
}
.tool-box { background: rgba(31, 179, 156, 0.08); border-left: 3px solid var(--accent-teal); }
.htl-box { background: rgba(243, 156, 18, 0.08); border-left: 3px solid #f39c12; }
.tool-label, .htl-label { font-weight: 700; display: block; margin-bottom: 0.2rem; color: var(--text-primary); }

.section-nav { display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: flex-end; }

/* Column Connector lines */
.col-connector { display: flex; flex-direction: column; align-items: center; height: 36px; }

.col-line {
  width: 3px; flex: 1;
  background: var(--border-color);
  border-radius: 99px;
  transition: background 0.6s ease, box-shadow 0.6s ease;
}
.col-line.active { background: var(--accent-teal); box-shadow: 0 0 10px var(--accent-teal-glow); }

/* Quiz Circle Node */
.quiz-circle {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  box-shadow: 0 4px 16px var(--card-shadow);
  flex-shrink: 0;
}
.quiz-circle.locked { opacity: 0.35; cursor: not-allowed; filter: grayscale(1); }
.quiz-circle.unlocked:not(.done):hover { transform: scale(1.15) rotate(5deg); box-shadow: 0 10px 30px var(--accent-teal-glow); border-color: var(--accent-teal); }
.quiz-circle.unlocked { border-color: var(--accent-teal); }
.quiz-circle.done { border-color: var(--accent-teal); background: var(--accent-teal-glow); }

.quiz-circle-icon { font-size: 1.6rem; line-height: 1; }
.quiz-circle-label { font-size: 0.62rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
.quiz-lock { position: absolute; top: -4px; right: -4px; font-size: 1rem; }

/* SVG Merge Lines */
.merge-zone {
  width: 100%;
  height: 100px;
  margin-top: 0;
}

.merge-svg {
  width: 100%;
  height: 100%;
}

.merge-svg line {
  stroke: var(--border-color);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke 0.6s ease, filter 0.6s ease;
}

.merge-svg line.line-active {
  stroke: var(--accent-teal);
  filter: drop-shadow(0 0 6px rgba(31, 179, 156, 0.6));
}

/* Final Quiz Node */
.final-quiz-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.final-star {
  width: 130px; height: 130px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 3px solid var(--border-color);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  box-shadow: 0 8px 30px var(--card-shadow);
}

.final-star.locked { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); }

.final-star.unlocked {
  border-color: var(--accent-teal);
  filter: none;
  opacity: 1;
}
.final-star.unlocked:hover {
  transform: scale(1.12) rotate(3deg);
  box-shadow: 0 16px 50px var(--accent-teal-glow);
}

.final-star.unlocking { animation: unlockBurst 1.6s ease forwards; }

@keyframes unlockBurst {
  0% { transform: scale(1); filter: grayscale(1); opacity: 0.3; }
  30% { transform: scale(1.4); filter: grayscale(0); opacity: 1; }
  50% { transform: scale(0.95); box-shadow: 0 0 80px var(--accent-teal-glow); }
  70% { transform: scale(1.15) rotate(12deg); }
  100% { transform: scale(1) rotate(0deg); border-color: var(--accent-teal); }
}

.final-star-icon { font-size: 3rem; line-height: 1; }
.final-star-label { font-size: 0.72rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
.final-lock { position: absolute; top: -6px; right: -6px; font-size: 1.3rem; }
.final-hint { color: var(--text-secondary); font-size: 0.85rem; text-align: center; max-width: 280px; }

/* ---- Quiz Modal ---- */
.quiz-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}

.quiz-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  width: 100%; max-width: 680px;
  max-height: 88vh; overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
}

.quiz-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
  position: sticky; top: 0; background: var(--bg-card); z-index: 1;
}
.quiz-header h2 { margin: 0; font-size: 1.2rem; color: var(--text-primary); }

.close-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-card-alt); border: 1px solid var(--border-color);
  color: var(--text-secondary); cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover { background: var(--accent-red-glow); color: var(--accent-red); border-color: var(--accent-red); }

.quiz-body { padding: 1.5rem 2rem; }

.quiz-progress { margin-bottom: 1.5rem; }
.quiz-progress span { font-size: 0.85rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem; }
.progress-bar-container { height: 6px; background: var(--bg-card-alt); border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent-teal); border-radius: 99px; transition: width 0.4s ease; }

.question-card { display: flex; flex-direction: column; gap: 1rem; }
.question-card h3 { margin: 0; color: var(--text-primary); font-size: 1.1rem; line-height: 1.5; }

.options { display: flex; flex-direction: column; gap: 0.6rem; }

.option-btn {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.85rem 1.2rem;
  background: var(--bg-card-alt); border: 1.5px solid var(--border-color);
  border-radius: 14px; cursor: pointer;
  transition: all 0.2s; text-align: left; font: inherit; color: var(--text-primary);
}
.option-btn:not(:disabled):hover { border-color: var(--accent-teal); background: var(--accent-teal-glow); }
.option-btn.selected { border-color: var(--accent-teal); background: var(--accent-teal-glow); }
.option-btn.correct { border-color: #27ae60; background: rgba(39, 174, 96, 0.15); }
.option-btn.wrong { border-color: var(--accent-red); background: var(--accent-red-glow); }
.option-btn:disabled { cursor: not-allowed; }

.opt-key {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--bg-card); border: 1px solid var(--border-color);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.8rem; flex-shrink: 0;
}
.opt-text { font-size: 0.95rem; line-height: 1.4; }

.explanation { padding: 1rem; background: var(--bg-card-alt); border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem; }
.correct-text { color: #27ae60; font-weight: 700; margin: 0; }
.wrong-text { color: var(--accent-red); font-weight: 700; margin: 0; }
.expl-text { color: var(--text-secondary); margin: 0; font-size: 0.9rem; line-height: 1.5; }

.open-question { display: flex; flex-direction: column; gap: 1rem; }
.open-answer-input {
  width: 100%; box-sizing: border-box;
  background: var(--bg-card-alt); border: 1.5px solid var(--border-color);
  border-radius: 12px; color: var(--text-primary); font: inherit; font-size: 0.95rem;
  padding: 0.85rem 1rem; resize: vertical; outline: none;
  transition: border-color 0.2s;
}
.open-answer-input:focus { border-color: var(--accent-teal); }
.open-hint details summary { cursor: pointer; color: var(--accent-teal); font-size: 0.9rem; font-weight: 600; }
.open-hint details p { color: var(--text-secondary); font-size: 0.88rem; margin: 0.5rem 0 0; line-height: 1.5; }

/* Nav buttons */
.nav-btn-small {
  padding: 0.5rem 1.2rem; border-radius: 10px;
  border: 1px solid var(--border-color); background: var(--bg-card-alt);
  color: var(--text-secondary); cursor: pointer; font: inherit; font-weight: 600;
  transition: all 0.2s;
}
.nav-btn-small:hover { color: var(--text-primary); border-color: var(--accent-teal); }
.nav-btn-small.primary { background: var(--accent-teal); color: #062720; border-color: var(--accent-teal); }
.nav-btn-small.primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
.nav-btn-small.finish { background: linear-gradient(135deg, var(--accent-teal), #0ea58e); font-size: 0.95rem; padding: 0.55rem 1.4rem; }

/* Quiz Complete */
.quiz-complete {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1rem; padding: 3rem 2rem; text-align: center;
}
.complete-icon { font-size: 4rem; }
.quiz-complete h3 { margin: 0; font-size: 1.6rem; color: var(--text-primary); }
.score-text { color: var(--text-secondary); margin: 0; font-size: 1.1rem; }
.xp-reward-text { color: var(--accent-teal); font-weight: 700; font-size: 1.2rem; margin: 0; }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.35s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; }
.slide-enter-to, .slide-leave-from { opacity: 1; max-height: 2000px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.quiz-appear-enter-active, .quiz-appear-leave-active { transition: all 0.3s ease; }
.quiz-appear-enter-from, .quiz-appear-leave-to { opacity: 0; }
.quiz-appear-enter-from .quiz-modal, .quiz-appear-leave-to .quiz-modal { transform: scale(0.92) translateY(20px); }

/* Responsive */
@media (max-width: 900px) {
  .topics-row { grid-template-columns: 1fr; }
  .merge-zone { display: none; }
  .lesson-header h1 { font-size: 1.3rem; }
}
</style>
