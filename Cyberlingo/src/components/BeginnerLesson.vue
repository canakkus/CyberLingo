<template>
  <main class="lesson-page">
    <div class="lesson-container">
      <!-- Header -->
      <header class="lesson-header">
        <button class="back-btn" @click="$emit('go-back')">← Zurück</button>
        <h1>🛡️ Cybersecurity Grundlagen</h1>
        <span class="level-badge">BEGINNER</span>
      </header>

      <!-- Learning Path -->
      <div class="learning-path">

        <!-- THEORY BLOCK -->
        <div class="path-node theory-node" :class="{ completed: theoryCompleted }">
          <div class="node-card" @click="showTheory = !showTheory">
            <div class="node-icon">📖</div>
            <div class="node-info">
              <h3>Theorieblock</h3>
              <p v-if="!theoryCompleted">{{ theorySteps.length }} Kapitel durchlesen</p>
              <p v-else class="completed-text">✅ Theorie abgeschlossen!</p>
            </div>
            <div class="node-arrow" :class="{ open: showTheory }">▼</div>
          </div>

          <!-- Theory Content (expandable) -->
          <Transition name="slide">
            <div v-if="showTheory" class="theory-content">
              <div
                v-for="(step, idx) in theorySteps"
                :key="idx"
                class="theory-section"
                :class="{ active: currentTheoryStep === idx, done: idx < currentTheoryStep }"
              >
                <div class="section-header" @click="currentTheoryStep = idx">
                  <span class="step-num" :class="{ completed: idx < currentTheoryStep }">{{ idx < currentTheoryStep ? '✓' : idx + 1 }}</span>
                  <h4>{{ step.title }}</h4>
                </div>
                <div v-if="currentTheoryStep === idx" class="section-body">
                  <div v-html="step.content"></div>
                  <div class="section-nav">
                    <button v-if="idx > 0" class="nav-btn-small" @click="currentTheoryStep = idx - 1">← Zurück</button>
                    <button v-if="idx < theorySteps.length - 1" class="nav-btn-small primary" @click="currentTheoryStep = idx + 1">Weiter →</button>
                    <button v-else-if="!theoryCompleted" class="nav-btn-small primary finish" @click="completeTheory">🎉 Theorie abschließen</button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- PATH CONNECTOR -->
        <div class="path-connector">
          <div class="path-line" :class="{ active: theoryCompleted }"></div>
          <div class="path-dots">
            <span class="dot" :class="{ active: theoryCompleted }"></span>
            <span class="dot" :class="{ active: theoryCompleted }"></span>
            <span class="dot" :class="{ active: theoryCompleted }"></span>
          </div>
        </div>

        <!-- QUIZ STAR NODE -->
        <div class="path-node quiz-node" :class="{ locked: !theoryCompleted, unlocking: unlockAnimation }">
          <div class="star-wrapper" :class="{ unlocked: theoryCompleted }" @click="openQuiz">
            <div class="star-icon">⭐</div>
            <span class="star-label">Quiz</span>
            <span v-if="!theoryCompleted" class="lock-overlay">🔒</span>
          </div>
        </div>
      </div>

      <!-- QUIZ MODAL -->
      <Transition name="quiz-appear">
        <div v-if="showQuiz && theoryCompleted" class="quiz-overlay" @click.self="showQuiz = false">
          <div class="quiz-modal">
            <div class="quiz-header">
              <h2>📝 Quiz – Cybersecurity Grundlagen</h2>
              <button class="close-btn" @click="showQuiz = false">✕</button>
            </div>

            <!-- MC Questions -->
            <div v-if="!quizCompleted" class="quiz-body">
              <div class="quiz-progress">
                <span>Frage {{ currentQuizQ + 1 }} / {{ mcQuestions.length + openQuestions.length }}</span>
                <div class="progress-bar-container">
                  <div class="progress-fill" :style="{ width: quizProgress + '%' }"></div>
                </div>
              </div>

              <!-- MC Question Display -->
              <div v-if="currentQuizQ < mcQuestions.length" class="question-card">
                <h3>{{ mcQuestions[currentQuizQ].question }}</h3>
                <div class="options">
                  <button
                    v-for="opt in mcQuestions[currentQuizQ].options"
                    :key="opt.key"
                    class="option-btn"
                    :class="{
                      selected: selectedAnswer === opt.key,
                      correct: answered && opt.key === mcQuestions[currentQuizQ].correct,
                      wrong: answered && selectedAnswer === opt.key && opt.key !== mcQuestions[currentQuizQ].correct
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
                    <p :class="selectedAnswer === mcQuestions[currentQuizQ].correct ? 'correct-text' : 'wrong-text'">
                      {{ selectedAnswer === mcQuestions[currentQuizQ].correct ? '✅ Richtig!' : '❌ Falsch!' }}
                    </p>
                    <p class="expl-text">{{ mcQuestions[currentQuizQ].explanation }}</p>
                    <button class="nav-btn-small primary" @click="nextQuestion">Weiter →</button>
                  </div>
                </Transition>
              </div>

              <!-- Open Questions -->
              <div v-else class="question-card open-question">
                <h3>{{ openQuestions[currentQuizQ - mcQuestions.length].question }}</h3>
                <textarea
                  v-model="openAnswers[currentQuizQ - mcQuestions.length]"
                  class="open-answer-input"
                  rows="4"
                  placeholder="Deine Antwort..."
                ></textarea>
                <div class="open-hint">
                  <details>
                    <summary>💡 Beispiel-Antwort zeigen</summary>
                    <p>{{ openQuestions[currentQuizQ - mcQuestions.length].hint }}</p>
                  </details>
                </div>
                <button class="nav-btn-small primary" @click="nextQuestion">
                  {{ currentQuizQ < mcQuestions.length + openQuestions.length - 1 ? 'Weiter →' : '🎉 Quiz abschließen' }}
                </button>
              </div>
            </div>

            <!-- Quiz Complete -->
            <div v-else class="quiz-complete">
              <div class="complete-icon">🏆</div>
              <h3>Quiz abgeschlossen!</h3>
              <p class="score-text">{{ correctCount }} / {{ mcQuestions.length }} MC-Fragen richtig</p>
              <p class="xp-reward-text">+150 XP verdient! ⚡</p>
              <button class="nav-btn-small primary" @click="claimQuizXP">XP abholen & zurück</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { authStore } from '../authStore'

const emit = defineEmits(['go-back'])

// --- Theory ---
const showTheory = ref(true)
const currentTheoryStep = ref(0)
const theoryCompleted = ref(false)
const unlockAnimation = ref(false)
const showQuiz = ref(false)
const quizCompleted = ref(false)
const selectedAnswer = ref(null)
const answered = ref(false)
const currentQuizQ = ref(0)
const correctCount = ref(0)
const openAnswers = ref(['', ''])

const theorySteps = [
  {
    title: 'CIA-Triade: Das Fundament der IT-Sicherheit',
    content: `
      <p>Die <strong>CIA-Triade</strong> bildet das absolute Grundgerüst der Informationssicherheit. Jede Sicherheitsmaßnahme lässt sich auf eines dieser drei Schutzziele zurückführen:</p>
      <ul>
        <li><strong>Confidentiality (Vertraulichkeit)</strong> — Nur autorisierte Personen dürfen auf Daten zugreifen. <em>Beispiel:</em> Verschlüsselung von E-Mails, Dateiberechtigungen auf dem Schulserver.</li>
        <li><strong>Integrity (Integrität)</strong> — Daten dürfen nicht unbemerkt verändert werden. <em>Beispiel:</em> Hashing von Dateien, digitale Signaturen bei Software-Updates.</li>
        <li><strong>Availability (Verfügbarkeit)</strong> — Systeme und Daten müssen erreichbar sein, wenn sie gebraucht werden. <em>Beispiel:</em> Redundante Server, DDoS-Schutz.</li>
      </ul>
      <div class="tool-box">
        <span class="tool-label">🔧 Tool-Tipp:</span>
        <strong>Wireshark</strong> — Damit kannst du Netzwerkverkehr analysieren und prüfen, ob vertrauliche Daten unverschlüsselt übertragen werden (z.B. HTTP vs. HTTPS).
      </div>
      <div class="htl-box">
        <span class="htl-label">🎓 HTL-Praxis:</span>
        Im <strong>Hyper-V Lab</strong> kannst du eigene VMs erstellen und testen, was passiert wenn ein Server ausfällt — so verstehst du Verfügbarkeit direkt in der Praxis.
      </div>
    `
  },
  {
    title: 'Authentifizierung & MFA',
    content: `
      <p>Ein Passwort allein reicht längst nicht mehr aus. Moderne Authentifizierung basiert auf <strong>mehreren Faktoren</strong>:</p>
      <ul>
        <li><strong>Wissen</strong> — Etwas das du weißt (Passwort, PIN)</li>
        <li><strong>Besitz</strong> — Etwas das du hast (Smartphone, Hardware-Token, YubiKey)</li>
        <li><strong>Eigenschaft</strong> — Etwas das du bist (Fingerabdruck, Gesichtserkennung)</li>
      </ul>
      <p><strong>Multi-Factor Authentication (MFA)</strong> kombiniert mindestens zwei dieser Kategorien. Warum ist das wichtig?</p>
      <ul>
        <li>Passwörter werden regelmäßig geleakt (z.B. durch Datenbank-Breaches)</li>
        <li>Brute-Force-Angriffe können simple Passwörter in Sekunden knacken</li>
        <li>MFA bedeutet: Selbst wenn dein Passwort geleakt wird, braucht der Angreifer noch deinen zweiten Faktor</li>
      </ul>
      <div class="htl-box">
        <span class="htl-label">🎓 HTL-Praxis:</span>
        Mit einem <strong>Raspberry Pi</strong> kannst du einen eigenen TOTP-Server (Time-based One-Time Password) aufsetzen und MFA selbst implementieren.
      </div>
    `
  },
  {
    title: 'Netzwerksicherheit: Firewalls, VLANs, VPNs & Zero-Trust',
    content: `
      <p>Netzwerksicherheit schützt die Kommunikation zwischen Systemen. Die wichtigsten Konzepte:</p>
      <ul>
        <li><strong>Firewalls</strong> — Kontrollieren den eingehenden und ausgehenden Netzwerkverkehr nach definierten Regeln. <em>Typen:</em> Paketfilter, Stateful Inspection, Application-Level Gateways.</li>
        <li><strong>VLANs (Virtual LANs)</strong> — Segmentieren ein physisches Netzwerk in logische Teilnetze. So kann z.B. das Schüler-WLAN vom Verwaltungsnetz getrennt werden.</li>
        <li><strong>VPNs (Virtual Private Networks)</strong> — Erstellen einen verschlüsselten Tunnel über ein unsicheres Netzwerk (z.B. öffentliches WLAN).</li>
        <li><strong>Zero-Trust</strong> — "Vertraue niemandem, verifiziere alles." Jeder Zugriff wird geprüft — egal ob er von innen oder außen kommt. Das ist ein Paradigmenwechsel weg vom alten Perimeter-Modell.</li>
      </ul>
      <div class="tool-box">
        <span class="tool-label">🔧 Tool-Tipp:</span>
        <strong>Wireshark</strong> hilft dir VPN-Tunnel zu analysieren: Ist der Traffic wirklich verschlüsselt? Welche Protokolle (IPsec, WireGuard, OpenVPN) werden verwendet?
      </div>
    `
  },
  {
    title: 'OSINT: Passives Aufklären',
    content: `
      <p><strong>Open Source Intelligence (OSINT)</strong> bedeutet, frei verfügbare Informationen aus öffentlichen Quellen zu sammeln — <em>ohne</em> aktiv mit dem Zielsystem zu interagieren.</p>
      <p><strong>Passiv vs. Aktiv:</strong></p>
      <ul>
        <li><strong>Passiv (OSINT)</strong> — Du schaust nur, was öffentlich erreichbar ist. Kein direkter Kontakt zum Ziel. <em>Beispiel:</em> Google Dorks, Social Media recherche.</li>
        <li><strong>Aktiv (Scanning)</strong> — Du sendest Pakete an das Zielsystem und wartest auf Antworten. <em>Beispiel:</em> Port-Scans mit Nmap.</li>
      </ul>
      <p><strong>Die wichtigsten OSINT-Tools:</strong></p>
      <ul>
        <li><strong>Google Dorks</strong> — Erweiterte Google-Suchoperatoren: <code>site:example.com filetype:pdf</code> findet alle PDFs einer Domain.</li>
        <li><strong>Shodan</strong> — Suchmaschine für internetverbundene Geräte. Findet offene Webcams, Industriesteuerungen, Server mit bekannten Schwachstellen.</li>
        <li><strong>crt.sh</strong> — Certificate Transparency Log: Zeigt alle SSL-Zertifikate einer Domain → verrät Subdomains.</li>
      </ul>
      <div class="htl-box">
        <span class="htl-label">🎓 HTL-Praxis:</span>
        Im <strong>Cyber-Threat-Simulator</strong> kannst du OSINT-Techniken sicher üben, ohne echte Systeme zu scannen. Probier z.B. Google Dorks auf der Übungsumgebung.
      </div>
    `
  },
  {
    title: 'Scanning, Enumeration & Social Engineering',
    content: `
      <p><strong>Scanning & Enumeration</strong> — der Übergang von passiv zu aktiv. Hier interagierst du direkt mit dem Zielsystem:</p>
      <ul>
        <li><strong>Nmap</strong> — Der Klassiker. Ein <code>TCP SYN Scan (-sS)</code> prüft welche Ports offen sind, ohne eine vollständige TCP-Verbindung aufzubauen.</li>
        <li><strong>SMB Enumeration</strong> — Auflisten von Freigaben, Benutzernamen und Gruppen auf Windows-Systemen.</li>
        <li><strong>SNMP Enumeration</strong> — Simple Network Management Protocol: Kann detaillierte Informationen über Netzwerkgeräte verraten (oft mit Standard-Community-Strings).</li>
      </ul>
      <p><strong>Social Engineering</strong> — Die menschliche Schwachstelle ausnutzen:</p>
      <ul>
        <li><strong>Phishing</strong> — Gefälschte E-Mails die wie echte aussehen</li>
        <li><strong>Vishing</strong> — Phishing per Telefon</li>
        <li><strong>Smishing</strong> — Phishing per SMS</li>
      </ul>
      <p><strong>Psychologische Prinzipien:</strong></p>
      <ul>
        <li><strong>Dringlichkeit</strong> — "Ihr Konto wird in 24 Stunden gesperrt!"</li>
        <li><strong>Autorität</strong> — "Hier spricht die IT-Abteilung, wir brauchen Ihr Passwort."</li>
      </ul>
      <div class="tool-box">
        <span class="tool-label">🔧 Tool-Tipp:</span>
        <strong>Nmap</strong> Cheat Sheet: <code>nmap -sS -sV -O target</code> → SYN Scan + Service Version + OS Detection.
      </div>
    `
  },
]

const mcQuestions = [
  {
    question: 'Wofür steht das "I" in der CIA-Triade?',
    options: [
      { key: 'a', text: 'Intelligence — Informationsgewinnung' },
      { key: 'b', text: 'Integrity — Daten dürfen nicht unbemerkt verändert werden' },
      { key: 'c', text: 'Infrastructure — Schutz der Netzwerkinfrastruktur' },
      { key: 'd', text: 'Identity — Identitätsprüfung aller Benutzer' },
    ],
    correct: 'b',
    explanation: 'Integrity (Integrität) stellt sicher, dass Daten nicht unbemerkt manipuliert werden. Neben Confidentiality und Availability bildet es die CIA-Triade.'
  },
  {
    question: 'Was ist der Hauptvorteil von MFA gegenüber einem einzelnen Passwort?',
    options: [
      { key: 'a', text: 'MFA macht Passwörter kürzer und einfacher zu merken' },
      { key: 'b', text: 'Selbst bei einem geleakten Passwort fehlt dem Angreifer der zweite Faktor' },
      { key: 'c', text: 'MFA ersetzt Passwörter vollständig' },
      { key: 'd', text: 'MFA verschlüsselt das Passwort automatisch' },
    ],
    correct: 'b',
    explanation: 'MFA kombiniert mindestens zwei Faktoren (Wissen, Besitz, Eigenschaft). Wird ein Faktor kompromittiert, schützt der zweite Faktor weiterhin den Zugang.'
  },
  {
    question: 'Was unterscheidet OSINT (passiv) von aktivem Scanning?',
    options: [
      { key: 'a', text: 'OSINT nutzt nur kostenpflichtige Tools' },
      { key: 'b', text: 'Aktives Scanning hinterlässt keine Spuren im Zielsystem' },
      { key: 'c', text: 'OSINT sammelt öffentliche Infos ohne direkten Kontakt zum Ziel; Scanning sendet Pakete ans Ziel' },
      { key: 'd', text: 'Es gibt keinen Unterschied, beide Begriffe sind Synonyme' },
    ],
    correct: 'c',
    explanation: 'Bei OSINT greifst du nur auf öffentlich verfügbare Quellen zu. Beim aktiven Scanning sendest du Pakete an das Zielsystem, was potenziell entdeckt werden kann.'
  },
  {
    question: 'Welches psychologische Prinzip nutzt ein Angreifer, wenn er sagt: "Ihr Konto wird in 24h gesperrt!"?',
    options: [
      { key: 'a', text: 'Sympathie' },
      { key: 'b', text: 'Reziprozität' },
      { key: 'c', text: 'Dringlichkeit' },
      { key: 'd', text: 'Social Proof' },
    ],
    correct: 'c',
    explanation: 'Dringlichkeit setzt das Opfer unter Zeitdruck, damit es ohne Nachdenken handelt — ein Klassiker im Social Engineering und bei Phishing-Mails.'
  },
  {
    question: 'Was ist der Zweck des Zero-Trust-Modells?',
    options: [
      { key: 'a', text: 'Nur externen Netzwerkverkehr zu blockieren' },
      { key: 'b', text: 'Allen internen Nutzern automatisch vollen Zugriff zu gewähren' },
      { key: 'c', text: 'Jeden Zugriff zu verifizieren, unabhängig ob er von innen oder außen kommt' },
      { key: 'd', text: 'Alle Firewalls überflüssig zu machen' },
    ],
    correct: 'c',
    explanation: 'Zero-Trust heißt "Vertraue niemandem, verifiziere alles." Auch interne Zugriffe werden geprüft — eine Abkehr vom klassischen Perimeter-Modell.'
  },
]

const openQuestions = [
  {
    question: 'Erkläre das "Principle of Least Privilege" in eigenen Worten. Warum ist es wichtig und nenne ein praktisches Beispiel.',
    hint: 'Das Principle of Least Privilege besagt, dass jeder Benutzer/Prozess nur die minimalen Rechte erhalten sollte, die er für seine Aufgabe braucht. Beispiel: Ein Schüler-Account auf dem Schulserver sollte keine Admin-Rechte haben — falls der Account gehackt wird, kann der Angreifer keine systemweiten Änderungen vornehmen.'
  },
  {
    question: 'Was sind Honeypots und wie können sie ein Netzwerk schützen? Beschreibe den Unterschied zwischen einem Low-Interaction und einem High-Interaction Honeypot.',
    hint: 'Honeypots sind absichtlich verwundbare Systeme, die Angreifer anlocken sollen. Sie dienen als Frühwarnsystem und sammeln Informationen über Angriffsmethoden. Low-Interaction Honeypots simulieren nur Dienste (z.B. einen Fake-SSH-Server), High-Interaction Honeypots sind echte Systeme die vollständig kompromittiert werden können — aber überwacht werden.'
  }
]

const quizProgress = computed(() => {
  const total = mcQuestions.length + openQuestions.length
  return ((currentQuizQ.value) / total) * 100
})

function completeTheory() {
  theoryCompleted.value = true
  showTheory.value = false
  unlockAnimation.value = true
  setTimeout(() => { unlockAnimation.value = false }, 2000)
}

function openQuiz() {
  if (!theoryCompleted.value) return
  showQuiz.value = true
}

function selectAnswer(key) {
  if (answered.value) return
  selectedAnswer.value = key
  answered.value = true
  if (key === mcQuestions[currentQuizQ.value].correct) {
    correctCount.value++
  }
}

function nextQuestion() {
  const total = mcQuestions.length + openQuestions.length
  if (currentQuizQ.value < total - 1) {
    currentQuizQ.value++
    selectedAnswer.value = null
    answered.value = false
  } else {
    quizCompleted.value = true
  }
}

async function claimQuizXP() {
  const newXp = authStore.userStats.xp + 150
  await authStore.saveUserStats({
    xp: newXp,
    level: authStore.userStats.level,
    streak: authStore.userStats.streak
  })
  authStore.userStats.xp = newXp
  showQuiz.value = false
  emit('go-back')
}
</script>

<style scoped>
.lesson-page {
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: var(--bg-main);
}

.lesson-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.lesson-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.lesson-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
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
}

.back-btn:hover {
  background: var(--bg-card-alt);
  color: var(--text-primary);
  border-color: var(--accent-teal);
}

/* Learning Path */
.learning-path {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

/* Path Node */
.path-node {
  width: 100%;
}

.node-card {
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 6px 24px var(--card-shadow);
}

.node-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-teal);
  box-shadow: 0 12px 32px var(--card-shadow);
}

.theory-node.completed .node-card {
  border-color: var(--accent-teal);
  background: var(--accent-teal-glow);
}

.node-icon {
  font-size: 2.5rem;
  background: var(--bg-card-alt);
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.node-info { flex: 1; }
.node-info h3 { margin: 0; font-size: 1.2rem; color: var(--text-primary); }
.node-info p { margin: 0.25rem 0 0; color: var(--text-secondary); font-size: 0.9rem; }
.completed-text { color: var(--accent-teal) !important; font-weight: 700; }

.node-arrow {
  font-size: 1rem;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}
.node-arrow.open { transform: rotate(180deg); }

/* Theory Content */
.theory-content {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.theory-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.theory-section.active {
  border-color: var(--accent-teal);
  box-shadow: 0 0 20px var(--accent-teal-glow);
}

.theory-section.done {
  opacity: 0.7;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.section-header:hover { background: var(--bg-card-alt); }

.step-num {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-card-alt);
  border: 1.5px solid var(--border-color);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.step-num.completed {
  background: var(--accent-teal);
  color: #062720;
  border-color: var(--accent-teal);
}

.section-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.section-body {
  padding: 0 1.5rem 1.5rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.section-body :deep(ul) {
  padding-left: 1.2rem;
  margin: 0.5rem 0;
}

.section-body :deep(li) {
  margin-bottom: 0.5rem;
}

.section-body :deep(code) {
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.15rem 0.4rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85em;
  color: var(--accent-teal);
}

.section-body :deep(strong) {
  color: var(--text-primary);
}

.tool-box, .htl-box {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
}

.tool-box {
  background: rgba(31, 179, 156, 0.08);
  border-left: 3px solid var(--accent-teal);
}

.htl-box {
  background: rgba(243, 156, 18, 0.08);
  border-left: 3px solid #f39c12;
}

.tool-label, .htl-label {
  font-weight: 700;
  display: block;
  margin-bottom: 0.3rem;
  color: var(--text-primary);
}

.section-nav {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.nav-btn-small {
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card-alt);
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  transition: all 0.2s;
}

.nav-btn-small:hover { color: var(--text-primary); border-color: var(--accent-teal); }

.nav-btn-small.primary {
  background: var(--accent-teal);
  color: #062720;
  border-color: var(--accent-teal);
}

.nav-btn-small.primary:hover { filter: brightness(1.1); transform: translateY(-2px); }

.nav-btn-small.finish {
  background: linear-gradient(135deg, var(--accent-teal), #0ea58e);
  font-size: 1rem;
  padding: 0.6rem 1.5rem;
}

/* Path Connector */
.path-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80px;
  position: relative;
}

.path-line {
  width: 3px;
  flex: 1;
  background: var(--border-color);
  border-radius: 99px;
  transition: background 0.6s ease, box-shadow 0.6s ease;
}

.path-line.active {
  background: var(--accent-teal);
  box-shadow: 0 0 12px var(--accent-teal-glow);
}

.path-dots {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-color);
  transition: background 0.6s ease, transform 0.3s ease;
}

.dot.active {
  background: var(--accent-teal);
  animation: dotPulse 1.5s ease infinite;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.4); }
}

/* Quiz Star Node */
.quiz-node {
  width: auto;
}

.star-wrapper {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  box-shadow: 0 6px 20px var(--card-shadow);
}

.quiz-node.locked .star-wrapper {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(1);
}

.star-wrapper.unlocked {
  border-color: var(--accent-teal);
  filter: none;
  opacity: 1;
}

.star-wrapper.unlocked:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 12px 40px var(--accent-teal-glow);
  border-color: var(--accent-teal);
}

.star-icon { font-size: 2rem; }
.star-label { font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }

.lock-overlay {
  position: absolute;
  font-size: 1.2rem;
  top: -6px;
  right: -6px;
}

/* Unlock Animation */
.quiz-node.unlocking .star-wrapper {
  animation: unlockBurst 1.5s ease forwards;
}

@keyframes unlockBurst {
  0% { transform: scale(1); filter: grayscale(1); opacity: 0.4; }
  30% { transform: scale(1.3); filter: grayscale(0); opacity: 1; }
  50% { transform: scale(0.95); box-shadow: 0 0 60px var(--accent-teal-glow); }
  70% { transform: scale(1.1) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); border-color: var(--accent-teal); }
}

/* Quiz Modal */
.quiz-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.quiz-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.quiz-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover { color: var(--accent-red); }

.quiz-body { padding: 1.5rem 2rem; }

.quiz-progress {
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.quiz-progress .progress-bar-container {
  margin-top: 0.5rem;
  height: 6px;
  background: var(--bg-card-alt);
  border-radius: 99px;
  overflow: hidden;
}

.quiz-progress .progress-fill {
  height: 100%;
  background: var(--accent-teal);
  border-radius: 99px;
  transition: width 0.4s ease;
}

/* Questions */
.question-card {
  margin-bottom: 1rem;
}

.question-card h3 {
  margin: 0 0 1.25rem;
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.5;
}

.options { display: flex; flex-direction: column; gap: 0.6rem; }

.option-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.2rem;
  background: var(--bg-card-alt);
  border: 1.5px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
  font: inherit;
  color: var(--text-primary);
}

.option-btn:hover:not(:disabled) { border-color: var(--accent-teal); background: var(--accent-teal-glow); }

.option-btn.selected { border-color: var(--accent-teal); background: var(--accent-teal-glow); }
.option-btn.correct { border-color: var(--accent-teal); background: rgba(31, 179, 156, 0.2); }
.option-btn.wrong { border-color: var(--accent-red); background: rgba(226, 88, 110, 0.15); }

.opt-key {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.opt-text { flex: 1; font-size: 0.95rem; }

.explanation {
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card-alt);
  border-radius: 14px;
}

.correct-text { color: var(--accent-teal); font-weight: 700; margin: 0 0 0.5rem; }
.wrong-text { color: var(--accent-red); font-weight: 700; margin: 0 0 0.5rem; }
.expl-text { color: var(--text-secondary); margin: 0 0 1rem; line-height: 1.6; }

/* Open Questions */
.open-answer-input {
  width: 100%;
  background: var(--bg-main);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  font: inherit;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.open-answer-input:focus { outline: none; border-color: var(--accent-teal); }

.open-hint {
  margin-bottom: 1rem;
}

.open-hint details {
  background: var(--bg-card-alt);
  border-radius: 10px;
  padding: 0.6rem 1rem;
}

.open-hint summary {
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.open-hint p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
}

/* Quiz Complete */
.quiz-complete {
  text-align: center;
  padding: 3rem 2rem;
}

.complete-icon { font-size: 4rem; margin-bottom: 1rem; }
.quiz-complete h3 { color: var(--text-primary); margin: 0 0 0.5rem; font-size: 1.5rem; }
.score-text { color: var(--text-secondary); margin: 0 0 0.5rem; }
.xp-reward-text { color: var(--accent-teal); font-weight: 700; font-size: 1.2rem; margin-bottom: 1.5rem; }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.4s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; transform: translateY(-10px); }
.slide-enter-to, .slide-leave-from { opacity: 1; max-height: 3000px; transform: translateY(0); }

.fade-enter-active { transition: opacity 0.3s ease; }
.fade-enter-from { opacity: 0; }

.quiz-appear-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.quiz-appear-leave-active { transition: all 0.25s ease; }
.quiz-appear-enter-from { opacity: 0; transform: scale(0.9); }
.quiz-appear-leave-to { opacity: 0; transform: scale(0.95); }

@media (max-width: 700px) {
  .lesson-header { flex-wrap: wrap; }
  .lesson-header h1 { font-size: 1.5rem; }
  .node-card { padding: 1rem 1.25rem; }
  .section-body { padding: 0 1rem 1rem; }
  .quiz-body { padding: 1rem; }
}
</style>
