<template>
  <main class="lesson-page">
    <div class="lesson-container">
      <header class="lesson-header">
        <button class="back-btn" @click="$emit('go-back')">← Zurück</button>
        <h1>🛡️ Blue Team – Basic Level</h1>
        <span class="level-badge">BASIC</span>
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
                      <button class="ask-ai-btn" @click="openAiChat(ti, si)">🤖 Ask AI</button>
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
                  v-for="opt in activeQuestions[currentQ].options"
                  :key="opt.key"
                  class="option-btn"
                  :class="{
                    selected: selectedAns === opt.key,
                    correct: answered && opt.key === activeQuestions[currentQ].correct,
                    wrong: answered && selectedAns === opt.key && opt.key !== activeQuestions[currentQ].correct
                  }"
                  :disabled="answered"
                  @click="selectAnswer(opt.key)"
                >
                  <span class="opt-key">{{ opt.key.toUpperCase() }}</span>
                  <span class="opt-text">{{ opt.text }}</span>
                </button>
              </div>
              <Transition name="fade">
                <div v-if="answered" class="explanation">
                  <p :class="selectedAns === activeQuestions[currentQ].correct ? 'correct-text' : 'wrong-text'">
                    {{ selectedAns === activeQuestions[currentQ].correct ? '✅ Richtig!' : '❌ Falsch!' }}
                  </p>
                  <p class="expl-text">{{ activeQuestions[currentQ].explanation }}</p>
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
                  <p>{{ activeQuestions[currentQ].hint }}</p>
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
            <p class="coins-reward-text">+{{ quizCoinsEarned }} Ling-Coins <img :src="lingcoinImg" class="lingcoin-inline" alt="LC" /></p>
            <button class="nav-btn-small primary" @click="claimXP">Belohnung abholen</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- AI Chat Modal -->
    <Transition name="chat-appear">
      <div v-if="showAiChat" class="ai-chat-overlay" @click.self="showAiChat = false">
        <div class="ai-chat-window">
          <div class="ai-chat-header">
            <div class="ai-chat-header-left">
              <div class="ai-avatar">
                <img :src="authStore.profile.team === 'red' ? leoBörekImg : markusWittImg" :alt="authStore.profile.team === 'red' ? 'Leo Borek' : 'Markus Witt'" />
              </div>
              <div>
                <h3>{{ authStore.profile.team === 'red' ? 'Leo Borek' : 'Markus Witt' }}</h3>
                <span class="ai-status">
                  <span class="ai-status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button class="ai-chat-close" @click="showAiChat = false">✕</button>
          </div>
          <div class="ai-chat-context">
            <span class="context-tag">📚 {{ aiChatContext.topicTitle }}</span>
            <span class="context-tag">📖 {{ aiChatContext.sectionTitle }}</span>
          </div>
          <div class="ai-chat-messages" ref="chatMessagesRef">
            <div
              v-for="(msg, i) in aiMessages"
              :key="i"
              class="ai-msg"
              :class="msg.role"
            >
              <div class="ai-msg-avatar">
                <img v-if="msg.role === 'assistant'" :src="authStore.profile.team === 'red' ? leoBörekImg : markusWittImg" :alt="authStore.profile.team === 'red' ? 'Leo Borek' : 'Markus Witt'" />
                <span v-else>👤</span>
              </div>
              <div class="ai-msg-bubble">
                <p>{{ msg.text }}</p>
                <span class="ai-msg-time">{{ msg.time }}</span>
              </div>
            </div>
            <div v-if="aiTyping" class="ai-msg assistant">
              <div class="ai-msg-avatar">
                <img :src="authStore.profile.team === 'red' ? leoBörekImg : markusWittImg" :alt="authStore.profile.team === 'red' ? 'Leo Borek' : 'Markus Witt'" />
              </div>
              <div class="ai-msg-bubble typing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
            </div>
          </div>
          <div class="ai-chat-input-area">
            <input
              v-model="aiInput"
              class="ai-chat-input"
              placeholder="Frag mich etwas zur Theorie..."
              @keydown.enter="sendAiMessage"
            />
            <button class="ai-send-btn" @click="sendAiMessage" :disabled="!aiInput.trim()">
              <span>➤</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isAiChatOpen" class="chat-overlay" @click.self="closeAiChat">
        <div class="chat-modal">
          <div class="chat-header">
            <h3>Ask AI</h3>
            <button class="close-btn" @click="closeAiChat">✕</button>
          </div>
          <div class="chat-messages">
            <div v-for="(msg, idx) in aiChatMessages" :key="idx" :class="['chat-message', msg.role]">
              <span class="chat-role">{{ msg.role === 'user' ? 'Du' : 'AI' }}</span>
              <p>{{ msg.text }}</p>
            </div>
          </div>
          <div class="chat-input-row">
            <textarea v-model="aiChatInput" rows="3" placeholder="Frage an die KI..."></textarea>
            <button class="nav-btn-small primary" @click="sendAiMessage" :disabled="!aiChatInput.trim()">Senden</button>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { authStore } from '../authStore'
import { askGemini, stripHtml } from '../utils/gemini.js'
import leoBörekImg from '../assets/leo-borek.jpg'
import markusWittImg from '../assets/markus-witt.jpg'
import lingcoinImg from '../assets/lingcoin.png'

const emit = defineEmits(['go-back'])

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

const quizCoinsEarned = computed(() => {
  const baseCoins = activeQuiz.value === 'final' ? 150 : 50
  const mcCount = activeQuestions.value.filter(q => q.type !== 'open').length
  const ratio = mcCount > 0 ? correctCount.value / mcCount : 1
  const bonus = ratio === 1 ? 25 : 0
  return Math.floor(baseCoins * ratio) + bonus
})

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

function selectAnswer(key) {
  if (answered.value) return
  selectedAns.value = key
  answered.value = true
  if (key === activeQuestions.value[currentQ.value].correct) correctCount.value++
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
  const newCoins = (authStore.userStats.coins || 0) + quizCoinsEarned.value
  await authStore.saveUserStats({ xp: newXp, coins: newCoins, level: authStore.userStats.level, streak: authStore.userStats.streak })
  authStore.userStats.xp = newXp

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
  if (activeQuiz.value === 'final') return 'Final Quiz – Blue Team Basic'
  if (activeQuiz.value !== null) return topics[activeQuiz.value].title
  return ''
})

const activeQuestions = computed(() => {
  if (activeQuiz.value === 'final') return finalQuizQuestions
  if (activeQuiz.value !== null) return topics[activeQuiz.value].questions
  return []
})

// AI Chat State
const showAiChat = ref(false)
const aiInput = ref('')
const aiMessages = ref([])
const aiTyping = ref(false)
const chatMessagesRef = ref(null)
const aiChatContext = ref({ topicTitle: '', sectionTitle: '', sectionContent: '' })

function openAiChat(ti, si) {
  const topic = topics[ti]
  const section = topic.sections[si]
  aiChatContext.value = {
    topicTitle: topic.title,
    sectionTitle: section.title,
    sectionContent: stripHtml(section.content || '')
  }
  aiMessages.value = [
    {
      role: 'assistant',
      text: `Hi! Ich bin ${authStore.profile.team === 'red' ? 'Leo Borek' : 'Markus Witt'}, dein CyberLingo AI Assistent. Frag mich alles zum Thema "${section.title}" – ich helfe dir gerne!`,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    }
  ]
  showAiChat.value = true
}

async function sendAiMessage() {
  const text = aiInput.value.trim()
  if (!text) return
  const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  aiMessages.value.push({ role: 'user', text, time: now })
  aiInput.value = ''
  scrollChat()
  aiTyping.value = true
  scrollChat()

  const systemPrompt = `Du bist ein freundlicher Cybersecurity-Lernassistent für CyberLingo.
Aktuelles Thema: "${aiChatContext.value.topicTitle}", Abschnitt: "${aiChatContext.value.sectionTitle}".
Lerninhalt: ${aiChatContext.value.sectionContent}
Beantworte Fragen des Lernenden kurz, klar und auf Deutsch. Bleibe beim Thema Cybersecurity.`

  try {
    const history = aiMessages.value.slice(1)
    const responseText = await askGemini(history, systemPrompt)
    aiTyping.value = false
    aiMessages.value.push({
      role: 'assistant',
      text: responseText,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    })
  } catch (err) {
    aiTyping.value = false
    aiMessages.value.push({
      role: 'assistant',
      text: `❌ Ups, da ist etwas schiefgelaufen: ${err.message}`,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    })
  }
  scrollChat()
}

function scrollChat() {
  setTimeout(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  }, 50)
}

// --- Topic Data ---
const topics = [
  {
    icon: '🔐',
    title: 'IT-Sicherheit & CIA-Triade',
    sections: [
      {
        title: 'Was ist IT-Sicherheit?',
        content: `<p><strong>IT-Sicherheit</strong> schützt digitale Assets vor unbefugtem Zugriff, Manipulation oder Zerstörung. Sie umfasst Hardware, Software, Netzwerke und Daten und berücksichtigt Bedrohungen wie Phishing, Ransomware oder DDoS-Angriffe.</p>
        <ul>
          <li>Wichtige Maßnahmen: Updates, starke Passwörter, Backups und <strong>Multi-Faktor-Authentifizierung (MFA)</strong></li>
          <li>IT-Sicherheit schützt IoT-Systeme, Netzwerke und sensible Daten</li>
          <li>Basiert auf Risikoanalyse, technischen und organisatorischen Maßnahmen</li>
        </ul>
        <div class="htl-box"><span class="htl-label">🎓 HTL-Praxis:</span> Für Projekte wie den Cyber-Threat-Simulator ist IT-Sicherheit essenziell, um sensible Daten in IoT-Systemen oder Netzwerken zu schützen.</div>`
      },
      {
        title: 'CIA-Triade: Vertraulichkeit & Integrität',
        content: `<p>Die <strong>CIA-Triade</strong> (Confidentiality, Integrity, Availability) ist das zentrale Modell der Informationssicherheit.</p>
        <ul>
          <li><strong>Vertraulichkeit (Confidentiality)</strong>: Nur autorisierte Personen können auf Daten zugreifen. Maßnahmen: Verschlüsselung (z. B. AES), Zugriffssteuerung, VPNs.</li>
          <li><strong>Integrität (Integrity)</strong>: Daten bleiben vollständig, korrekt und unverändert. Schutz durch Hash-Funktionen, digitale Signaturen oder Checksums.</li>
        </ul>
        <div class="tool-box"><span class="tool-label">🔧 Tool-Tipp:</span> <strong>Wireshark</strong> – Analysiere Netzwerkverkehr und prüfe, ob Daten unverschlüsselt übertragen werden.</div>`
      },
      {
        title: 'CIA-Triade: Verfügbarkeit & Erweiterte Aspekte',
        content: `<ul>
          <li><strong>Verfügbarkeit (Availability)</strong>: Systeme und Daten sind jederzeit für Berechtigte zugänglich. Gegenmaßnahmen: Redundanz, DDoS-Schutz, Backups.</li>
        </ul>
        <p><strong>Erweiterte Aspekte:</strong> Manchmal wird die Triade um <em>Authentizität</em> erweitert. In der Praxis analysierst du Risiken (Bedrohungen × Vulnerabilities × Impact) und implementierst Schichten:</p>
        <ul>
          <li><strong>Physisch</strong>: Zugangssicherung</li>
          <li><strong>Technisch</strong>: Firewalls, IDS/IPS</li>
          <li><strong>Organisatorisch</strong>: Awareness-Trainings</li>
        </ul>
        <div class="htl-box"><span class="htl-label">🎓 HTL-Praxis:</span> Starte mit BSI-Grundschutz-Katalogen für praktische Umsetzung in Schulprojekten.</div>`
      }
    ],
    questions: [
      {
        question: 'Was steht "C" in der CIA-Triade?',
        options: [{ key: 'a', text: 'Compliance' }, { key: 'b', text: 'Control' }, { key: 'c', text: 'Confidentiality (Vertraulichkeit)' }, { key: 'd', text: 'Communication' }],
        correct: 'c',
        explanation: 'Confidentiality (Vertraulichkeit) schützt vor unbefugtem Zugriff auf Daten.'
      },
      {
        question: 'Welche Maßnahme schützt primär die Integrität (Integrity) von Daten?',
        options: [{ key: 'a', text: 'Firewalls' }, { key: 'b', text: 'Hash-Funktionen oder digitale Signaturen' }, { key: 'c', text: 'Backups' }, { key: 'd', text: 'VPNs' }],
        correct: 'b',
        explanation: 'Hash-Funktionen und digitale Signaturen erkennen Manipulationen an Daten.'
      },
      {
        question: 'Was bedeutet Verfügbarkeit (Availability) in der CIA-Triade?',
        options: [{ key: 'a', text: 'Daten sind vor Manipulation geschützt' }, { key: 'b', text: 'Nur Berechtigte haben Zugriff' }, { key: 'c', text: 'Daten und Systeme sind jederzeit zugänglich' }, { key: 'd', text: 'Daten werden verschlüsselt' }],
        correct: 'c',
        explanation: 'Verfügbarkeit bedeutet, dass Systeme und Daten trotz Ausfällen erreichbar bleiben.'
      },
      {
        question: 'Welche Bedrohung verletzt hauptsächlich die Vertraulichkeit?',
        options: [{ key: 'a', text: 'Phishing oder unbefugter Zugriff' }, { key: 'b', text: 'DDoS-Angriff' }, { key: 'c', text: 'Ransomware' }, { key: 'd', text: 'Hardware-Ausfall' }],
        correct: 'a',
        explanation: 'Phishing und unbefugter Zugriff ermöglichen Datenklau und verletzen die Vertraulichkeit.'
      },
      {
        question: 'Welches IT-Sicherheitsprinzip wird durch starke Passwörter und MFA unterstützt?',
        options: [{ key: 'a', text: 'Integrität' }, { key: 'b', text: 'Vertraulichkeit' }, { key: 'c', text: 'Verfügbarkeit' }, { key: 'd', text: 'Authentizität' }],
        correct: 'b',
        explanation: 'Starke Passwörter und MFA schützen die Vertraulichkeit, indem sie unbefugten Login verhindern.'
      }
    ]
  },
  {
    icon: '🔑',
    title: 'Authentifizierung & Account-Sicherheit',
    sections: [
      {
        title: 'Authentifizierung – Grundlagen',
        content: `<p><strong>Authentifizierung</strong> überprüft die Identität von Nutzern durch:</p>
        <ul>
          <li><strong>Wissen</strong>: Etwas das du weißt (Passwort, PIN)</li>
          <li><strong>Besitz</strong>: Etwas das du hast (Smartphone, Hardware-Token)</li>
          <li><strong>Eigenschaft</strong>: Etwas das du bist (Fingerabdruck, Gesicht)</li>
        </ul>
        <p>Typen: Single-Factor (nur Passwort, unsicher), <strong>Two-Factor (2FA)</strong> oder <strong>Multi-Factor (MFA)</strong> – empfohlen. Protokolle: SAML für SSO, FIDO2 für passwortlos, Kerberos in Active Directory.</p>
        <div class="htl-box"><span class="htl-label">🎓 HTL-Praxis:</span> Mit einem Raspberry Pi kannst du einen TOTP-Server aufsetzen und MFA selbst implementieren.</div>`
      },
      {
        title: 'Account-Sicherheit & Best Practices',
        content: `<p><strong>Account-Sicherheit</strong> umfasst:</p>
        <ul>
          <li><strong>Principle of Least Privilege</strong>: Minimale Rechte für jeden Account</li>
          <li>Regelmäßige Passwort-Rotation und Deaktivierung inaktiver Konten</li>
          <li>Häufige Risiken: Credential Stuffing, Phishing, schwache Service-Accounts</li>
        </ul>
        <p><strong>Praktische Maßnahmen:</strong></p>
        <ul>
          <li>Passwörter: Mind. 12 Zeichen, komplex (Groß-/Kleinbuchstaben, Zahlen, Symbole), keine Wiederverwendung</li>
          <li>MFA aktivieren: App (z.B. Authenticator), Hardware-Token oder SMS – blockt 99% der Account-Hacks</li>
          <li>Audit Logs prüfen, Anomalien erkennen (z.B. mit ADAudit Plus)</li>
        </ul>
        <div class="htl-box"><span class="htl-label">🎓 HTL-Praxis:</span> MFA für Hyper-V-VMs oder GitHub-Accounts einrichten.</div>`
      },
      {
        title: 'Authentifizierung vs. Autorisierung',
        content: `<p>Wichtiger Unterschied:</p>
        <ul>
          <li><strong>Authentifizierung</strong>: Prüft "Wer bist du?" – verifiziert die Identität</li>
          <li><strong>Autorisierung</strong>: Klärt "Was darfst du?" – legt Zugriffsrechte fest</li>
        </ul>
        <p>Ohne starke Authentifizierung nützt auch die beste Autorisierung nichts. MFA ist heute der wichtigste Schutz gegen Credential-Diebstahl.</p>
        <div class="tool-box"><span class="tool-label">🔧 Tool-Tipp:</span> <strong>SAML</strong> ermöglicht Single Sign-On (SSO) – zentraler Login über einen Identity Provider (IdP).</div>`
      }
    ],
    questions: [
      {
        question: 'Was ist der Hauptzweck der Authentifizierung?',
        options: [{ key: 'a', text: 'Zugriffsrechte verteilen' }, { key: 'b', text: 'Identität eines Nutzers prüfen' }, { key: 'c', text: 'Daten verschlüsseln' }, { key: 'd', text: 'Backups erstellen' }],
        correct: 'b',
        explanation: 'Authentifizierung prüft "Wer bist du?" und verifiziert die Identität – im Gegensatz zur Autorisierung.'
      },
      {
        question: 'Welcher Faktor gehört zur MFA (Multi-Factor-Authentifizierung)?',
        options: [{ key: 'a', text: 'Nur Passwort' }, { key: 'b', text: 'Smartphone-App + Passwort' }, { key: 'c', text: 'Firewall' }, { key: 'd', text: 'Antivirus' }],
        correct: 'b',
        explanation: 'MFA kombiniert Besitz (Smartphone-App) + Wissen (Passwort) für sicheren Zugang.'
      },
      {
        question: 'Was besagt das Principle of Least Privilege?',
        options: [{ key: 'a', text: 'Konten nur minimale Rechte geben' }, { key: 'b', text: 'Alle Rechte für Admins' }, { key: 'c', text: 'Passwörter teilen' }, { key: 'd', text: 'Keine Logs führen' }],
        correct: 'a',
        explanation: 'Minimale Rechte reduzieren das Schadenspotenzial bei einer Kompromittierung.'
      },
      {
        question: 'Welche Bedrohung zielt auf Account-Sicherheit ab?',
        options: [{ key: 'a', text: 'Virus-Scan' }, { key: 'b', text: 'Phishing für Passwörter' }, { key: 'c', text: 'Hardware-Update' }, { key: 'd', text: 'Netzwerk-Switch' }],
        correct: 'b',
        explanation: 'Phishing ist der häufigste Angriff auf Credentials und zielt direkt auf Account-Sicherheit ab.'
      },
      {
        question: 'Welches Protokoll wird für SSO-Authentifizierung genutzt?',
        options: [{ key: 'a', text: 'HTTP' }, { key: 'b', text: 'SAML' }, { key: 'c', text: 'FTP' }, { key: 'd', text: 'SMTP' }],
        correct: 'b',
        explanation: 'SAML (Security Assertion Markup Language) ermöglicht zentralen Login über einen Identity Provider.'
      }
    ]
  },
  {
    icon: '🌐',
    title: 'Netzwerksicherheit Grundlagen',
    sections: [
      {
        title: 'Grundlagen & Architekturen',
        content: `<p><strong>Netzwerksicherheit</strong> schützt Netzwerke vor unbefugtem Zugriff, Angriffen und Ausfällen. Häufige Bedrohungen: DDoS, Man-in-the-Middle, Port-Scans.</p>
        <p><strong>Netzwerk-Zonen:</strong></p>
        <ul>
          <li><strong>DMZ</strong> (Demilitarisierte Zone): für öffentliche Services</li>
          <li><strong>Internal-Netz</strong>: geschützt, nur intern erreichbar</li>
          <li><strong>VLANs</strong>: Segmentierung – trennt Traffic logisch (z.B. IoT von Admin-Netz)</li>
        </ul>
        <p>Subnetting (z.B. 192.168.1.0/24) minimiert Broadcast-Domains und Angriffsflächen.</p>
        <div class="htl-box"><span class="htl-label">🎓 HTL-Praxis:</span> Hyper-V mit VLAN-Tags für simulierte Netze nutzen.</div>`
      },
      {
        title: 'Kerntechnologien: Firewalls, IDS/IPS, VPN',
        content: `<ul>
          <li><strong>Firewalls</strong>: Stateful Inspection (prüft Sessions) vs. Next-Gen (App-Control, IPS). Regeln: Allow/deny nach IP, Port, Protokoll.</li>
          <li><strong>IDS/IPS</strong>: Intrusion Detection (passiv warnt), Prevention (blockt aktiv). Signaturen vs. Anomalie-basiert (z.B. Snort).</li>
          <li><strong>VPNs</strong>: IPsec (Tunnel) oder OpenVPN für sichere Remote-Zugriffe. Schützt vor Sniffing in öffentlichen WLANs.</li>
          <li><strong>NAC</strong> (Network Access Control): Prüft Geräte vor Einlass (802.1X mit RADIUS).</li>
        </ul>
        <div class="tool-box"><span class="tool-label">🔧 Tool-Tipp:</span> <strong>pfSense</strong> – kostenlose Firewall-VM; <strong>Wireshark</strong> – VPN-Tunnel analysieren.</div>`
      },
      {
        title: 'Bedrohungen & Zero-Trust',
        content: `<ul>
          <li><strong>DDoS</strong>: Volumen-Angriffe überfluten Bandbreite – Mitigation via Rate-Limiting, Cloud-Scrubber (Cloudflare).</li>
          <li><strong>Man-in-the-Middle (MitM)</strong>: ARP-Poisoning – Schutz: Dynamic ARP Inspection, HSTS/HTTPS.</li>
          <li><strong>WLAN-Sicherheit</strong>: WPA3 > WPA2, EAP für Enterprise, WPS deaktivieren.</li>
        </ul>
        <p><strong>Zero-Trust</strong>: "Vertraue niemandem, verifiziere alles." Jeder Zugriff wird geprüft – egal ob innen oder außen. Paradigmenwechsel weg vom alten Perimeter-Modell.</p>
        <div class="htl-box"><span class="htl-label">🎓 HTL-Praxis:</span> Starte mit Wireshark für Traffic-Analyse, Port-Knocking für SSH (knockd auf Linux), Monitoring mit Zabbix oder ELK-Stack.</div>`
      }
    ],
    questions: [
      {
        question: 'Was ist der Zweck einer Firewall?',
        options: [{ key: 'a', text: 'Daten verschlüsseln' }, { key: 'b', text: 'Traffic nach Regeln filtern' }, { key: 'c', text: 'Backups machen' }, { key: 'd', text: 'User authentifizieren' }],
        correct: 'b',
        explanation: 'Eine Firewall filtert Netzwerkverkehr nach definierten Regeln und blockt unerwünschten Zu- oder Abfluss.'
      },
      {
        question: 'Welches Protokoll schützt VPN-Verbindungen?',
        options: [{ key: 'a', text: 'HTTP' }, { key: 'b', text: 'IPsec' }, { key: 'c', text: 'FTP' }, { key: 'd', text: 'SNMP' }],
        correct: 'b',
        explanation: 'IPsec verschlüsselt Tunnel-Daten und schützt VPN-Verbindungen vor Sniffing.'
      },
      {
        question: 'Was bewirkt VLAN-Segmentierung?',
        options: [{ key: 'a', text: 'Trennt Netzwerk-Traffic logisch' }, { key: 'b', text: 'Erhöht Bandbreite' }, { key: 'c', text: 'Verschlüsselt Daten' }, { key: 'd', text: 'Speichert Logs' }],
        correct: 'a',
        explanation: 'VLANs trennen Traffic logisch, reduzieren Broadcasts und verkleinern die Angriffsfläche.'
      },
      {
        question: 'Welcher Angriff zielt auf Verfügbarkeit ab?',
        options: [{ key: 'a', text: 'Phishing' }, { key: 'b', text: 'DDoS' }, { key: 'c', text: 'SQL-Injection' }, { key: 'd', text: 'Buffer Overflow' }],
        correct: 'b',
        explanation: 'DDoS (Distributed Denial of Service) überflutet Ressourcen und macht sie für Berechtigte unzugänglich.'
      },
      {
        question: 'Was ist Zero-Trust?',
        options: [{ key: 'a', text: 'Alle Netzwerkgeräte voll vertrauen' }, { key: 'b', text: 'Perimeter-Verteidigung maximieren' }, { key: 'c', text: 'Jede Anfrage explizit autorisieren' }, { key: 'd', text: 'Offene Ports erlauben' }],
        correct: 'c',
        explanation: 'Zero-Trust bedeutet kein implizites Vertrauen – auch interne Zugriffe werden stets verifiziert.'
      }
    ]
  }
]

// --- Final Quiz ---
const finalQuizQuestions = [
  {
    question: 'Was steht "I" in der CIA-Triade?',
    options: [{ key: 'a', text: 'Integrity (Integrität)' }, { key: 'b', text: 'Identification' }, { key: 'c', text: 'Internet' }, { key: 'd', text: 'Installation' }],
    correct: 'a',
    explanation: 'Integrity (Integrität) schützt vor Manipulation von Daten.'
  },
  {
    question: 'Welche Maßnahme unterstützt Verfügbarkeit?',
    options: [{ key: 'a', text: 'Verschlüsselung' }, { key: 'b', text: 'Backups' }, { key: 'c', text: 'Hashing' }, { key: 'd', text: 'Passwortrichtlinie' }],
    correct: 'b',
    explanation: 'Backups ermöglichen die Wiederherstellung nach Ausfällen und sichern die Verfügbarkeit.'
  },
  {
    question: 'Was ist MFA?',
    options: [{ key: 'a', text: 'Multi-Firewall-Auth' }, { key: 'b', text: 'Multi-Factor-Authentifizierung' }, { key: 'c', text: 'Mainframe-Access' }, { key: 'd', text: 'Manual File Audit' }],
    correct: 'b',
    explanation: 'Multi-Factor-Authentifizierung kombiniert ≥2 Faktoren für sicheren Zugang.'
  },
  {
    question: 'Best Practice für Passwörter?',
    options: [{ key: 'a', text: 'Kurze, einfache Wörter' }, { key: 'b', text: 'Mind. 12 Zeichen, komplex' }, { key: 'c', text: 'Wiederverwenden' }, { key: 'd', text: 'Teilen mit Kollegen' }],
    correct: 'b',
    explanation: 'Mindestens 12 komplexe Zeichen erhöhen die Brute-Force-Resistenz erheblich.'
  },
  {
    question: 'Zweck einer Firewall?',
    options: [{ key: 'a', text: 'Daten speichern' }, { key: 'b', text: 'Traffic filtern' }, { key: 'c', text: 'User trainieren' }, { key: 'd', text: 'Hardware reparieren' }],
    correct: 'b',
    explanation: 'Firewalls filtern Netzwerkverkehr nach Regeln (allow/deny).'
  },
  {
    question: 'Was ist Zero-Trust?',
    options: [{ key: 'a', text: 'Alles vertrauen' }, { key: 'b', text: 'Jede Anfrage verifizieren' }, { key: 'c', text: 'Offene Ports' }, { key: 'd', text: 'Single-Factor' }],
    correct: 'b',
    explanation: 'Zero-Trust bedeutet kein implizites Vertrauen – jede Anfrage wird explizit autorisiert.'
  },
  {
    question: 'Principle of Least Privilege bedeutet?',
    options: [{ key: 'a', text: 'Minimale Rechte vergeben' }, { key: 'b', text: 'Alle Rechte für alle' }, { key: 'c', text: 'Keine Logs' }, { key: 'd', text: 'Standard-Passwörter' }],
    correct: 'a',
    explanation: 'Minimale Rechte reduzieren den Schaden bei einer Kompromittierung.'
  },
  {
    type: 'open',
    question: 'Nenne die 3 Säulen der CIA-Triade und je eine Beispiel-Maßnahme pro Säule.',
    hint: 'Confidentiality (Verschlüsselung), Integrity (Hashing/digitale Signaturen), Availability (Redundanz/Backups).'
  },
  {
    type: 'open',
    question: 'Warum ist MFA wichtiger als nur Passwörter?',
    hint: 'MFA erfordert einen zusätzlichen Faktor (z.B. App). Selbst wenn das Passwort geleakt wird, fehlt dem Angreifer der zweite Faktor – 99% der Angriffe werden geblockt.'
  },
  {
    type: 'open',
    question: 'Erkläre kurz den Unterschied zwischen IDS und IPS.',
    hint: 'IDS (Intrusion Detection System) erkennt und warnt vor Angriffen passiv. IPS (Intrusion Prevention System) blockt Angriffe aktiv, z.B. durch Traffic-Drop.'
  }
]
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
.quiz-circle:not(.locked):hover { transform: scale(1.15); box-shadow: 0 10px 30px var(--accent-teal-glow); border-color: var(--accent-teal); }
.quiz-circle.unlocked { border-color: var(--accent-teal); }
.quiz-circle.done { border-color: var(--accent-teal); background: var(--accent-teal-glow); }

/* ---- Icon Spin Animation (Mario-Star style) ---- */
.quiz-circle-icon,
.final-star-icon {
  display: inline-block;
  transform-origin: center;
  will-change: transform;
  transition: transform 0.15s ease, filter 0.15s ease;
}

/* Small quiz circle icon */
.quiz-circle-icon { font-size: 1.6rem; line-height: 1; }

/* Trigger on parent hover — spin loops as long as hovered */
.quiz-circle:not(.locked):hover .quiz-circle-icon {
  animation: marioSpin 0.4s linear infinite;
  filter: drop-shadow(0 0 6px rgba(31, 179, 156, 0.7));
}

@keyframes marioSpin {
  0%   { transform: rotateY(0deg)   scaleX(1); }
  25%  { transform: rotateY(90deg)  scaleX(0.1); }
  50%  { transform: rotateY(180deg) scaleX(1); }
  75%  { transform: rotateY(270deg) scaleX(0.1); }
  100% { transform: rotateY(360deg) scaleX(1); }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .quiz-circle:not(.locked):hover .quiz-circle-icon,
  .final-star.unlocked:hover .final-star-icon {
    animation: none;
    transform: scale(1.2);
  }
}
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
.final-star { perspective: 800px; }
.final-star.unlocked:hover {
  transform: scale(1.12);
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

.final-star.unlocked:hover .final-star-icon {
  animation: marioSpin 0.35s linear infinite;
  filter: drop-shadow(0 0 10px rgba(31, 179, 156, 0.85));
}
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
.nav-btn-small.outline { background: transparent; color: var(--accent-teal); border-color: var(--accent-teal); }
.nav-btn-small.primary { background: var(--accent-teal); color: #062720; border-color: var(--accent-teal); }
.nav-btn-small.primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
.nav-btn-small.finish { background: linear-gradient(135deg, var(--accent-teal), #0ea58e); font-size: 0.95rem; padding: 0.55rem 1.4rem; }

.chat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1200;
}
.chat-modal {
  width: min(640px, 100%);
  max-height: 90vh;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid var(--border-color);
}
.chat-header h3 { margin: 0; font-size: 1rem; color: var(--text-primary); }
.chat-messages {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  flex: 1;
}
.chat-message {
  border-radius: 18px;
  padding: 0.9rem 1rem;
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
}
.chat-message.user { align-self: flex-end; background: rgba(35, 155, 255, 0.12); }
.chat-message.assistant { align-self: flex-start; background: rgba(41, 211, 134, 0.12); }
.chat-role { display: block; margin-bottom: 0.25rem; font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; }
.chat-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  padding: 1rem 1.2rem 1.2rem;
  background: var(--bg-card-alt);
}
.chat-input-row textarea {
  width: 100%;
  min-height: 84px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0.9rem 1rem;
  background: var(--bg-main);
  color: var(--text-primary);
  font: inherit;
  resize: vertical;
}
.chat-input-row textarea:focus { outline: none; border-color: var(--accent-teal); }

/* Quiz Complete */
.quiz-complete {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1rem; padding: 3rem 2rem; text-align: center;
}
.complete-icon { font-size: 4rem; }
.quiz-complete h3 { margin: 0; font-size: 1.6rem; color: var(--text-primary); }
.score-text { color: var(--text-secondary); margin: 0; font-size: 1.1rem; }
.xp-reward-text { color: var(--accent-teal); font-weight: 700; font-size: 1.2rem; margin: 0; }
.coins-reward-text { color: #f5b731; font-weight: 700; font-size: 1.1rem; margin: 0.25rem 0 0; }
.lingcoin-inline { width: 18px; height: 18px; object-fit: contain; vertical-align: middle; margin-left: 2px; }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.35s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; }
.slide-enter-to, .slide-leave-from { opacity: 1; max-height: 2000px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.quiz-appear-enter-active, .quiz-appear-leave-active { transition: all 0.3s ease; }
.quiz-appear-enter-from, .quiz-appear-leave-to { opacity: 0; }
.quiz-appear-enter-from .quiz-modal, .quiz-appear-leave-to .quiz-modal { transform: scale(0.92) translateY(20px); }

/* ---- Ask AI Button ---- */
.ask-ai-btn {
  padding: 0.45rem 1rem;
  border-radius: 10px;
  border: 1.5px solid rgba(139, 92, 246, 0.4);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
  color: #a78bfa;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  margin-right: auto;
}
.ask-ai-btn:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.2));
  border-color: #a78bfa;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
}

/* ---- AI Chat Window ---- */
.ai-chat-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1100; padding: 1rem;
}

.ai-chat-window {
  width: 100%; max-width: 520px; height: 600px; max-height: 85vh;
  background: var(--bg-card);
  border: 1.5px solid rgba(139, 92, 246, 0.3);
  border-radius: 24px;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
}

.ai-chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 1.4rem;
  background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05));
  border-bottom: 1px solid rgba(139,92,246,0.15);
}
.ai-chat-header-left { display: flex; align-items: center; gap: 0.75rem; }
.ai-avatar {
  width: 42px; height: 42px; border-radius: 14px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; box-shadow: 0 4px 12px rgba(139,92,246,0.3);
  overflow: hidden;
}
.ai-avatar img { width: 100%; height: 100%; object-fit: cover; }
.ai-chat-header h3 { margin: 0; font-size: 1rem; color: var(--text-primary); font-weight: 700; }
.ai-status { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: #4ade80; font-weight: 500; }
.ai-status-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #4ade80; box-shadow: 0 0 6px #4ade80;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }

.ai-chat-close {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(255,255,255,0.05); border: 1px solid var(--border-color);
  color: var(--text-secondary); cursor: pointer; font-size: 0.95rem;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.ai-chat-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.4); }

.ai-chat-context { display: flex; gap: 0.5rem; padding: 0.65rem 1.4rem; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; }
.context-tag {
  font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 99px;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
  color: #c4b5fd; font-weight: 500;
}

.ai-chat-messages {
  flex: 1; overflow-y: auto; padding: 1.2rem 1.2rem 0.5rem;
  display: flex; flex-direction: column; gap: 1rem; scroll-behavior: smooth;
}
.ai-chat-messages::-webkit-scrollbar { width: 4px; }
.ai-chat-messages::-webkit-scrollbar-track { background: transparent; }
.ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 99px; }

.ai-msg { display: flex; gap: 0.6rem; align-items: flex-end; animation: msgSlideIn 0.3s ease; }
@keyframes msgSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.ai-msg.user { flex-direction: row-reverse; }

.ai-msg-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-card-alt);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; flex-shrink: 0;
  overflow: hidden;
}
.ai-msg.assistant .ai-msg-avatar { background: linear-gradient(135deg, #7c3aed, #3b82f6); }
.ai-msg-avatar img { width: 100%; height: 100%; object-fit: cover; }

.ai-msg-bubble { max-width: 80%; padding: 0.75rem 1rem; border-radius: 18px; position: relative; }
.ai-msg.assistant .ai-msg-bubble {
  background: var(--bg-card-alt); border: 1px solid var(--border-color);
  border-bottom-left-radius: 6px; color: var(--text-primary);
}
.ai-msg.user .ai-msg-bubble {
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  border-bottom-right-radius: 6px; color: #fff;
}
.ai-msg-bubble p { margin: 0; font-size: 0.9rem; line-height: 1.55; }
.ai-msg-time { font-size: 0.65rem; opacity: 0.5; display: block; margin-top: 0.35rem; }

.ai-msg-bubble.typing { display: flex; gap: 0.3rem; align-items: center; padding: 0.9rem 1.2rem; }
.typing-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #a78bfa;
  animation: typingBounce 1.4s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.15s; }
.typing-dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes typingBounce { 0%,60%,100% { transform:translateY(0); opacity:0.4; } 30% { transform:translateY(-6px); opacity:1; } }

.ai-chat-input-area {
  display: flex; gap: 0.6rem; padding: 1rem 1.2rem;
  border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.1);
}
.ai-chat-input {
  flex: 1; padding: 0.7rem 1rem; border-radius: 14px;
  border: 1.5px solid var(--border-color); background: var(--bg-card-alt);
  color: var(--text-primary); font: inherit; font-size: 0.9rem; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ai-chat-input:focus { border-color: #a78bfa; box-shadow: 0 0 12px rgba(139,92,246,0.15); }
.ai-chat-input::placeholder { color: var(--text-secondary); opacity: 0.6; }

.ai-send-btn {
  width: 42px; height: 42px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  color: white; cursor: pointer; font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.ai-send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 4px 16px rgba(139,92,246,0.4); }
.ai-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.chat-appear-enter-active, .chat-appear-leave-active { transition: all 0.35s ease; }
.chat-appear-enter-from, .chat-appear-leave-to { opacity: 0; }
.chat-appear-enter-from .ai-chat-window { transform: scale(0.9) translateY(30px); }
.chat-appear-leave-to .ai-chat-window { transform: scale(0.9) translateY(30px); }

/* Responsive */
@media (max-width: 900px) {
  .topics-row { grid-template-columns: 1fr; }
  .merge-zone { display: none; }
  .lesson-header h1 { font-size: 1.3rem; }
  .ai-chat-window { max-width: 100%; height: 85vh; border-radius: 18px; }
}
</style>
